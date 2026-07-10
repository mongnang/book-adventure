const { app } = require("@azure/functions");
const { json } = require("../shared/http");
const { getStudentKey, hasCosmosConfig, listAdventureEvents, normalizeStudent } = require("../shared/store");

const TYPE_LABELS = {
  sessionStart: "입장 기록",
  titleScenarioTurn: "활동 1 대화",
  titleScenarioSubmission: "활동 1 제출",
  questionTurn: "활동 2 질문",
  answerCheck: "활동 2 정답 확인",
  conversationAssessment: "활동 2 평가",
  characterChatTurn: "활동 3 인물 대화"
};

function isAuthorized(request) {
  const expectedCode = process.env.TEACHER_ACCESS_CODE;
  if (!expectedCode) {
    return {
      ok: false,
      status: 503,
      body: {
        ok: false,
        error: "teacher_access_code_missing",
        message: "TEACHER_ACCESS_CODE is not configured."
      }
    };
  }

  const suppliedCode = request.headers.get("x-teacher-access-code") || "";
  if (suppliedCode !== expectedCode) {
    return {
      ok: false,
      status: 403,
      body: {
        ok: false,
        error: "teacher_access_denied",
        message: "Teacher access code is incorrect."
      }
    };
  }

  return { ok: true };
}

function getLimit(request) {
  try {
    return new URL(request.url).searchParams.get("limit") || 500;
  } catch (error) {
    return 500;
  }
}

function getCreatedAt(item) {
  return item.createdAt || item.clientTimestamp || "";
}

function compareCreatedAt(a, b) {
  return String(getCreatedAt(a)).localeCompare(String(getCreatedAt(b)));
}

function getStudentLabel(student) {
  const normalized = normalizeStudent(student);
  const className = normalized.className ? `${normalized.className}반` : "";
  const number = normalized.number ? `${normalized.number}번` : "";
  const nickname = normalized.nickname || "닉네임 없음";
  return [className, number, nickname].filter(Boolean).join(" ");
}

function summarizeRecord(item) {
  const assessment = item.assessment || {};
  const totalScore = assessment.totalScore ?? null;
  const maxScore = assessment.maxScore ?? null;

  return {
    id: item.id,
    type: item.type || "adventureEvent",
    typeLabel: TYPE_LABELS[item.type] || item.type || "기록",
    activityId: item.activityId || "",
    createdAt: getCreatedAt(item),
    sessionId: item.sessionId || "",
    bookId: item.bookId || "",
    bookTitle: item.bookTitle || "",
    characterName: item.characterName || "",
    characterRole: item.characterRole || "",
    studentMessage: item.studentMessage || "",
    characterReply: item.characterReply || "",
    question: item.question || "",
    answer: item.answer || "",
    correct: typeof item.correct === "boolean" ? item.correct : null,
    message: item.message || "",
    scenarioText: item.scenarioText || "",
    promptKo: item.promptKo || item.nanoBananaPrompt?.ko || "",
    promptEn: item.promptEn || item.nanoBananaPrompt?.en || "",
    totalScore,
    maxScore,
    assessment,
    progress: item.progress || null,
    mode: item.mode || ""
  };
}

function groupByStudent(items) {
  const groups = new Map();

  items.forEach((item) => {
    const student = normalizeStudent(item.student);
    const key = item.studentKey || getStudentKey(student, item.sessionId);
    if (!groups.has(key)) {
      groups.set(key, {
        studentKey: key,
        className: student.className,
        number: student.number,
        nickname: student.nickname,
        nicknames: new Set(),
        label: getStudentLabel(student),
        latestAt: "",
        recordCount: 0,
        activity1Count: 0,
        activity2QuestionCount: 0,
        activity3Count: 0,
        assessmentCount: 0,
        records: []
      });
    }

    const group = groups.get(key);
    if (student.nickname) group.nicknames.add(student.nickname);
    if (!group.className && student.className) group.className = student.className;
    if (!group.number && student.number) group.number = student.number;
    if (student.nickname) group.nickname = student.nickname;

    group.recordCount += 1;
    if (item.type === "titleScenarioSubmission") group.activity1Count += 1;
    if (item.type === "questionTurn" || item.type === "answerCheck") group.activity2QuestionCount += 1;
    if (item.type === "characterChatTurn") group.activity3Count += 1;
    if (item.type === "conversationAssessment") group.assessmentCount += 1;

    const record = summarizeRecord(item);
    group.records.push(record);
    if (!group.latestAt || String(record.createdAt).localeCompare(String(group.latestAt)) > 0) {
      group.latestAt = record.createdAt;
    }
  });

  return Array.from(groups.values()).map((group) => {
    group.records.sort(compareCreatedAt);
    group.nicknames = Array.from(group.nicknames);
    group.label = getStudentLabel(group);
    return group;
  }).sort((a, b) => {
    const classCompare = String(a.className).localeCompare(String(b.className), "ko", { numeric: true });
    if (classCompare) return classCompare;
    const numberCompare = String(a.number).localeCompare(String(b.number), "ko", { numeric: true });
    if (numberCompare) return numberCompare;
    return String(a.latestAt).localeCompare(String(b.latestAt));
  });
}

app.http("teacherResults", {
  methods: ["GET"],
  authLevel: "anonymous",
  route: "adventure/teacher-results",
  handler: async (request, context) => {
    const auth = isAuthorized(request);
    if (!auth.ok) return json(auth.status, auth.body);

    if (!hasCosmosConfig()) {
      return json(503, {
        ok: false,
        error: "cosmos_not_configured",
        message: "Cosmos DB is not configured."
      });
    }

    const result = await listAdventureEvents({ limit: getLimit(request) }, context);
    if (result.error) {
      return json(500, {
        ok: false,
        error: "cosmos_query_failed",
        message: result.error
      });
    }

    const students = groupByStudent(result.items);

    return json(200, {
      ok: true,
      storage: "cosmos-db",
      studentCount: students.length,
      recordCount: result.items.length,
      students,
      generatedAt: new Date().toISOString()
    });
  }
});
