const BOOK_DISPLAY_DEFAULTS = {
  cover: "",
  coverA: "#6e2c20",
  coverB: "#2d1510",
  spineWidth: 72,
  spineHeight: 350
};
let books = [];

const STUDENT_PROFILE_KEY = "book-adventure-student-profile";
const CONVERSATION_LOG_KEY = "book-adventure-conversation-log";
const TITLE_SCENARIO_SUBMISSIONS_KEY = "book-adventure-title-scenario-submissions";
const GUIDE_CHARACTER_IMAGE = "./assets/characters/rabbit-librarian.png";
const AI_UNAVAILABLE_MESSAGE = "AI와 연결이 불안정합니다. 다시 시도해보세요.";

function formatApiError(error, action = "요청") {
  if (typeof window.formatBookAdventureApiError === "function") {
    return window.formatBookAdventureApiError(error, action);
  }
  return `${action} 중 문제가 생겼어요. 잠시 후 다시 시도해 주세요.`;
}

const heroScreen = document.querySelector("#heroScreen");
const profileScreen = document.querySelector("#profileScreen");
const bookScreen = document.querySelector("#bookScreen");
const activityMenuScreen = document.querySelector("#activityMenuScreen");
const teacherGateScreen = document.querySelector("#teacherGateScreen");
const teacherDashboardScreen = document.querySelector("#teacherDashboardScreen");
const scenarioScreen = document.querySelector("#scenarioScreen");
const adventureScreen = document.querySelector("#adventureScreen");
const characterChatScreen = document.querySelector("#characterChatScreen");
const resultScreen = document.querySelector("#resultScreen");
const resultPanel = document.querySelector("#resultPanel");
const resultBackToBooks = document.querySelector("#resultBackToBooks");
const screenPrevButton = document.querySelector("#screenPrevButton");
const screenNextButton = document.querySelector("#screenNextButton");
const screenStepLabel = document.querySelector("#screenStepLabel");
const enterControl = document.querySelector("#enterControl");
const studentProfileForm = document.querySelector("#studentProfileForm");
const studentClassInput = document.querySelector("#studentClassInput");
const studentNumberInput = document.querySelector("#studentNumberInput");
const studentNicknameInput = document.querySelector("#studentNicknameInput");
const studentProfileError = document.querySelector("#studentProfileError");
const shelfWindow = document.querySelector("#shelfWindow");
const shelfRow = document.querySelector("#shelfRow");
const selectedCover = document.querySelector("#selectedCover");
const selectedTitle = document.querySelector("#selectedTitle");
const selectedAuthor = document.querySelector("#selectedAuthor");
const selectedDescription = document.querySelector("#selectedDescription");
const coverTitle = document.querySelector("#coverTitle");
const coverAuthor = document.querySelector("#coverAuthor");
const startButton = document.querySelector("#startButton");
const bookLoadStatus = document.querySelector("#bookLoadStatus");
const retryBooksButton = document.querySelector("#retryBooksButton");
const startScenarioButton = document.querySelector("#startScenarioButton");
const startAdventureActivityButton = document.querySelector("#startAdventureActivityButton");
const startCharacterChatButton = document.querySelector("#startCharacterChatButton");
const openTeacherGateButton = document.querySelector("#openTeacherGateButton");
const teacherGatePanel = document.querySelector("#teacherGatePanel");
const teacherGateBackButton = document.querySelector("#teacherGateBackButton");
const teacherGateForm = document.querySelector("#teacherGateForm");
const teacherGateCodeInput = document.querySelector("#teacherGateCodeInput");
const teacherGateSubmitButton = document.querySelector("#teacherGateSubmitButton");
const teacherGateStatus = document.querySelector("#teacherGateStatus");
const teacherRefreshButton = document.querySelector("#teacherRefreshButton");
const teacherDashboardBackButton = document.querySelector("#teacherDashboardBackButton");
const teacherDashboardStatus = document.querySelector("#teacherDashboardStatus");
const teacherSummaryStrip = document.querySelector("#teacherSummaryStrip");
const teacherStudentSearchInput = document.querySelector("#teacherStudentSearchInput");
const teacherStudentList = document.querySelector("#teacherStudentList");
const teacherStudentDetail = document.querySelector("#teacherStudentDetail");
const teacherStudentViewTab = document.querySelector("#teacherStudentViewTab");
const teacherPromptViewTab = document.querySelector("#teacherPromptViewTab");
const teacherStudentView = document.querySelector("#teacherStudentView");
const teacherPromptView = document.querySelector("#teacherPromptView");
const teacherPromptDateFilter = document.querySelector("#teacherPromptDateFilter");
const teacherPromptClearDateButton = document.querySelector("#teacherPromptClearDateButton");
const teacherPromptSelectAllButton = document.querySelector("#teacherPromptSelectAllButton");
const teacherPromptClearSelectionButton = document.querySelector("#teacherPromptClearSelectionButton");
const teacherPromptCopyButton = document.querySelector("#teacherPromptCopyButton");
const teacherPromptExportButton = document.querySelector("#teacherPromptExportButton");
const teacherPromptSelectionStatus = document.querySelector("#teacherPromptSelectionStatus");
const teacherPromptList = document.querySelector("#teacherPromptList");
const scenarioBookTitle = document.querySelector("#scenarioBookTitle");
const scenarioChatLog = document.querySelector("#scenarioChatLog");
const scenarioChoicePanel = document.querySelector("#scenarioChoicePanel");
const scenarioStepForm = document.querySelector("#scenarioStepForm");
const scenarioStepInput = document.querySelector("#scenarioStepInput");
const scenarioStepSubmitButton = document.querySelector("#scenarioStepSubmitButton");
const scenarioError = document.querySelector("#scenarioError");
const answerGuessButton = document.querySelector("#answerGuessButton");
const statusSummary = document.querySelector("#statusSummary");
const hudBookTitle = document.querySelector("#hudBookTitle");
const hudBookAuthor = document.querySelector("#hudBookAuthor");
const hudQuestionText = document.querySelector("#hudQuestionText");
const readingChat = document.querySelector("#readingChat");
const chatTitle = document.querySelector("#chatTitle");
const chatLog = document.querySelector("#chatLog");
const questionPanel = document.querySelector("#questionPanel");
const customQuestionForm = document.querySelector("#customQuestionForm");
const customQuestionInput = document.querySelector("#customQuestionInput");
const customQuestionButton = customQuestionForm.querySelector("button");
const backToBooks = document.querySelector("#backToBooks");
const adventureBookTitle = document.querySelector("#adventureBookTitle");
const adventureBookAuthor = document.querySelector("#adventureBookAuthor");
const adventureBackdrop = document.querySelector(".adventure-backdrop");
const characterPortrait = document.querySelector("#characterPortrait");
const characterImage = document.querySelector("#characterImage");
const dialogueBox = document.querySelector(".dialogue-box");
const speakerName = document.querySelector("#speakerName");
const dialogueText = document.querySelector("#dialogueText");
const nextQuestionButton = document.querySelector("#nextQuestionButton");
const characterChatBackButton = document.querySelector("#characterChatBackButton");
const characterChatBookTitle = document.querySelector("#characterChatBookTitle");
const characterChatIntro = document.querySelector("#characterChatIntro");
const characterChatProfileGrid = document.querySelector("#characterChatProfileGrid");
const characterChatLog = document.querySelector("#characterChatLog");
const characterChatForm = document.querySelector("#characterChatForm");
const characterChatInput = document.querySelector("#characterChatInput");
const characterChatSubmitButton = document.querySelector("#characterChatSubmitButton");
const characterChatError = document.querySelector("#characterChatError");

const questionCategories = [
  {
    id: "mind",
    number: "①",
    title: "인물의 마음",
    summary: "감정, 속마음, 마음의 변화",
    status: "마음 질문 고르기",
    questions: [
      "{인물명}의 주된 마음, 생각은 무엇일까?",
      "{인물명}의 소원이나 바람은 무엇일까?",
      "인물의 행동이나 태도가 바뀌었다면 그 이유는 무엇일까?"
    ]
  },
  {
    id: "place",
    number: "②",
    title: "장소 돌아보기",
    summary: "장터, 밤길, 메밀꽃밭의 단서",
    status: "장소 질문 고르기",
    questions: [
      "이 장소에는 어떤 단서가 숨어 있을까?",
      "이 장소의 분위기는 인물의 마음을 어떻게 보여줄까?",
      "이 장소에서 누가 무엇을 기억하고 있을까?"
    ]
  }
];

const majorCharactersByBook = {
  memil: ["허 생원", "조 선달", "동이", "성 서방네 처녀"],
  sonagi: ["소년", "소녀"],
  "unlucky-day": ["김 첨지", "아내", "손님"],
  wings: ["나", "아내"],
  spring: ["나", "점순", "장인"],
  "young-prince": ["어린 왕자", "조종사", "장미"],
  honggildong: ["홍길동", "아버지", "활빈당"],
  heungbu: ["흥부", "놀부", "제비"],
  simcheong: ["심청", "심봉사", "뺑덕어멈"],
  chunhyang: ["춘향", "이몽룡", "변학도"],
  heosaeng: ["허생", "변씨", "아내"],
  sangnoksu: ["박동혁", "채영신", "마을 사람들"],
  munjangganghwa: ["글쓴이", "독자", "문장"],
  "nami-janggun": ["남이", "왕", "신하들"],
  mujong: ["이형식", "박영채", "김선형"],
  "old-man-sea": ["산티아고", "마놀린", "바다"],
  alice: ["앨리스", "흰 토끼", "여왕"],
  "wizard-oz": ["도로시", "허수아비", "양철 나무꾼"],
  anne: ["앤", "마릴라", "매슈"],
  "treasure-island": ["짐", "실버", "선장"],
  "little-women": ["조", "메그", "베스"],
  pinocchio: ["피노키오", "제페토", "요정"],
  momo: ["모모", "베포", "회색 신사들"]
};

const characterRoleByBook = {
  memil: ["장돌뱅이", "동행", "젊은 장돌뱅이", "회상 속 인물"],
  sonagi: ["주요 인물", "주요 인물"],
  "unlucky-day": ["인력거꾼", "가족", "손님"],
  wings: ["화자", "아내"],
  spring: ["화자", "마을 소녀", "어른"],
  "young-prince": ["여행자", "이야기하는 사람", "소중한 존재"],
  honggildong: ["주인공", "가족", "동료"],
  heungbu: ["동생", "형", "도움을 주는 존재"],
  simcheong: ["딸", "아버지", "주변 인물"],
  chunhyang: ["주인공", "연인", "권력자"],
  heosaeng: ["선비", "상인", "가족"],
  sangnoksu: ["청년", "청년", "공동체"],
  munjangganghwa: ["화자", "읽는 사람", "생각의 대상"],
  "nami-janggun": ["장군", "권력자", "주변 인물"],
  mujong: ["교사", "여성 인물", "여성 인물"],
  "old-man-sea": ["노인", "소년", "상징적 대상"],
  alice: ["주인공", "안내자", "권력자"],
  "wizard-oz": ["주인공", "동료", "동료"],
  anne: ["주인공", "보호자", "보호자"],
  "treasure-island": ["소년", "해적", "어른"],
  "little-women": ["자매", "자매", "자매"],
  pinocchio: ["주인공", "아버지", "도움을 주는 존재"],
  momo: ["주인공", "친구", "상대 세력"]
};

const locationsByBook = {
  memil: [
    {
      name: "봉평 장터",
      summary: "허 생원이 오래 떠돌아온 장터",
      clue: "과거의 기억과 현재의 만남이 겹쳐지는 출발점",
      image: "./assets/places/memil-market.png"
    },
    {
      name: "대화 장으로 가는 밤길",
      summary: "허 생원, 조 선달, 동이가 함께 걷는 길",
      clue: "인물들의 말과 침묵을 이어 볼 수 있는 길",
      image: "./assets/places/memil-night-road.png"
    },
    {
      name: "메밀꽃밭",
      summary: "달빛 아래 하얗게 펼쳐진 풍경",
      clue: "허 생원의 오래된 기억이 선명해지는 장소",
      image: "./assets/places/memil-buckwheat-field.png"
    },
    {
      name: "개울가",
      summary: "동이가 허 생원을 도와주는 장면이 떠오르는 곳",
      clue: "동이의 행동과 두 사람의 가까워지는 분위기를 볼 수 있는 곳",
      image: "./assets/places/memil-stream.png"
    }
  ]
};

const profileImageByBook = {
  memil: [
    "profiles/memil-1.png",
    "profiles/memil-2.png",
    "profiles/memil-3.png",
    "profiles/memil-4.png"
  ]
};

const standingImageByBook = {
  memil: [
    "memil-heo-saengwon.png",
    "memil-jo-seondal.png",
    "memil-dongi.png",
    "memil-seong-seobang-girl.png"
  ]
};

const characterChatRulesByBook = {
  memil: {
    "허 생원": {
      speechStyle: "무뚝뚝하지만 속정이 깊다. 말끝을 길게 늘이기보다 짧고 담담하게 말한다.",
      perspective: "오래 장터를 떠돈 장돌뱅이로서 길, 장터, 밤길, 오래된 기억을 자주 떠올린다.",
      boundaries: [
        "동이와의 관계를 처음부터 직접 단정하지 않는다.",
        "마음속 그리움은 드러내되 과하게 감상적으로 말하지 않는다.",
        "학생에게 원전의 결말을 바로 말하지 않고 장면을 떠올리게 한다."
      ],
      starter: "흠, 나한테 묻고 싶은 게 있나. 길 위에서 본 것들은 생각보다 오래 남는 법이지."
    },
    "조 선달": {
      speechStyle: "능청스럽고 현실적이다. 허 생원을 놀리듯 말하지만 분위기를 부드럽게 만든다.",
      perspective: "동행자의 눈으로 허 생원과 동이를 관찰한다. 장터 사람들의 말투와 길 위의 분위기를 잘 안다.",
      boundaries: [
        "모든 비밀을 아는 사람처럼 굴지 않는다.",
        "농담은 짧게 하고 학생의 질문을 흐리지 않는다.",
        "중요한 단서는 관찰한 행동 중심으로만 말한다."
      ],
      starter: "허허, 나한테 묻겠다고? 길동무 눈에는 제법 보이는 게 많지."
    },
    "동이": {
      speechStyle: "젊고 조심스럽지만 마음이 따뜻하다. 예의를 지키며 솔직하게 말한다.",
      perspective: "자신의 행동, 어머니 이야기, 허 생원을 돕는 마음을 중심으로 말한다.",
      boundaries: [
        "자신의 출생 비밀을 확정적으로 먼저 말하지 않는다.",
        "허 생원을 함부로 평가하지 않는다.",
        "학생이 묻는 장면 안에서 느낀 마음을 중심으로 답한다."
      ],
      starter: "저에게 물어보실 게 있나요? 제가 본 것과 느낀 것이라면 조심히 말해 볼게요."
    },
    "성 서방네 처녀": {
      speechStyle: "회상 속 인물처럼 차분하고 부드럽다. 직접적인 설명보다 기억의 분위기로 말한다.",
      perspective: "허 생원의 오래된 기억, 달밤, 메밀꽃밭의 분위기와 연결된다.",
      boundaries: [
        "현재 시점의 사건을 모두 알고 있는 것처럼 말하지 않는다.",
        "작품의 숨은 인연을 직접 결론으로 말하지 않는다.",
        "기억과 분위기를 통해 학생이 추리하도록 돕는다."
      ],
      starter: "오래된 이야기는 달빛처럼 조용히 남아 있지요. 무엇이 궁금한가요?"
    }
  }
};

const finalAnswerRulesByBook = {
  memil: {
    question: "허 생원과 동이 사이에는 어떤 숨은 인연이 있을까?",
    answer: "동이는 허 생원의 아들일 가능성이 크다.",
    keywords: ["동이", "아들"]
  }
};

let selectedBook = books[0];
let studentProfile = loadStudentProfile();
let conversationLog = loadConversationLog();
let heroDragStartY = null;
let shelfDragStartX = 0;
let shelfScrollStart = 0;
let shelfPointerDown = false;
let didShelfDrag = false;
let pendingSpineId = null;
let activeCategory = null;
let activeCharacter = null;
let activePlace = null;
let customInputMode = "question";
let chatStarted = false;
let activeAdventureBookId = null;
let activeScreenId = "heroScreen";
let resultOriginScreenId = "adventureScreen";
let viewportRaf = null;
let titleScenarioActivity = null;
let characterChatActivity = null;
let adventureProgress = {
  chancesLeft: 10,
  cluesFound: 0,
  solved: false
};

const titleScenarioRevisionChoices = [
  {
    id: "adventure",
    label: "① 더 신나고 모험 가득하게",
    mood: "신나고 모험 가득한",
    colors: "달빛 금색과 깊은 남색"
  },
  {
    id: "warm",
    label: "② 더 따뜻하고 감동적으로",
    mood: "따뜻하고 감동적인",
    colors: "부드러운 노을빛 주황과 크림색"
  },
  {
    id: "twist",
    label: "③ 깜짝 반전을 넣어서",
    mood: "신비롭고 반전이 있는",
    colors: "보랏빛 밤하늘과 은은한 금색"
  }
];

const screenOrder = ["heroScreen", "profileScreen", "bookScreen", "activityMenuScreen", "scenarioScreen", "adventureScreen", "characterChatScreen", "resultScreen"];
const screenLabels = {
  heroScreen: "입장",
  profileScreen: "학생 정보",
  bookScreen: "책장",
  activityMenuScreen: "활동 선택",
  teacherGateScreen: "교사용 문",
  teacherDashboardScreen: "결과실",
  scenarioScreen: "활동 1",
  adventureScreen: "모험",
  characterChatScreen: "활동 3",
  resultScreen: "결과"
};

const teacherRecordTypeLabels = {
  sessionStart: "입장 기록",
  titleScenarioTurn: "활동 1 대화",
  titleScenarioSubmission: "활동 1 제출",
  questionTurn: "활동 2 질문",
  answerCheck: "활동 2 정답 확인",
  conversationAssessment: "활동 2 평가",
  characterChatTurn: "활동 3 인물 대화"
};

const teacherActivityTabLabels = {
  all: "전체",
  activity1: "활동 1",
  activity2: "활동 2",
  activity3: "활동 3",
  session: "입장 기록"
};

const teacherState = {
  accessCode: "",
  students: [],
  selectedStudentKey: "",
  selectedActivityTab: "",
  activeView: "students",
  promptDate: "",
  selectedPromptIds: new Set()
};

function readJsonStorage(key, fallback) {
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch (error) {
    return fallback;
  }
}

function writeJsonStorage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    // Local persistence is a backup; the app can continue if storage is full or blocked.
  }
}

function loadStudentProfile() {
  const profile = readJsonStorage(STUDENT_PROFILE_KEY, null);
  if (!profile || typeof profile !== "object") return null;

  return {
    className: String(profile.className || "").trim(),
    number: String(profile.number || "").trim(),
    nickname: String(profile.nickname || "").trim()
  };
}

function loadConversationLog() {
  const log = readJsonStorage(CONVERSATION_LOG_KEY, []);
  return Array.isArray(log) ? log.slice(-80) : [];
}

function isStudentProfileComplete(profile = studentProfile) {
  return Boolean(profile?.className && profile?.number && profile?.nickname);
}

function getStudentLabel(profile = studentProfile) {
  if (!isStudentProfileComplete(profile)) return "학생 정보 없음";
  return `${profile.className}반 ${profile.number}번 ${profile.nickname}`;
}

function getStudentSnapshot() {
  return isStudentProfileComplete()
    ? {
        className: studentProfile.className,
        number: studentProfile.number,
        nickname: studentProfile.nickname,
        label: getStudentLabel()
      }
    : null;
}

function persistStudentProfile(profile) {
  studentProfile = profile;
  writeJsonStorage(STUDENT_PROFILE_KEY, studentProfile);
}

function persistConversationLog() {
  writeJsonStorage(CONVERSATION_LOG_KEY, conversationLog.slice(-80));
}

function resetConversationLog() {
  conversationLog = [];
  persistConversationLog();
}

function recordConversationMessage(text, role = "agent") {
  const entry = {
    id: `message-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString(),
    student: getStudentSnapshot(),
    bookId: selectedBook?.id || "",
    bookTitle: selectedBook?.title || "",
    categoryId: activeCategory?.id || "",
    categoryTitle: activeCategory?.title || "",
    characterName: activeCharacter?.name || "",
    placeName: activePlace?.name || "",
    role,
    text: String(text || "")
  };

  conversationLog.push(entry);
  conversationLog = conversationLog.slice(-80);
  persistConversationLog();
  return entry;
}

function getConversationSnapshot(limit = 12) {
  return conversationLog.slice(-limit).map((entry) => ({
    role: entry.role,
    text: entry.text,
    createdAt: entry.createdAt,
    categoryTitle: entry.categoryTitle,
    characterName: entry.characterName,
    placeName: entry.placeName
  }));
}

function getProgressSnapshot() {
  return {
    chancesLeft: adventureProgress.chancesLeft,
    cluesFound: adventureProgress.cluesFound,
    solved: adventureProgress.solved
  };
}

function showProfileError(message) {
  studentProfileError.textContent = message;
  studentProfileError.classList.toggle("is-hidden", !message);
}

function hydrateStudentProfileForm() {
  if (!studentProfileForm || !studentProfile) return;
  studentClassInput.value = studentProfile.className || "";
  studentNumberInput.value = studentProfile.number || "";
  studentNicknameInput.value = studentProfile.nickname || "";
}

function readStudentProfileForm() {
  return {
    className: studentClassInput.value.trim(),
    number: studentNumberInput.value.trim(),
    nickname: studentNicknameInput.value.trim()
  };
}

async function recordStudentSessionStart() {
  if (typeof window.recordAdventureSessionStart !== "function") return;

  try {
    await window.recordAdventureSessionStart({
      student: getStudentSnapshot(),
      event: "studentProfileSubmitted"
    });
  } catch (error) {
    // The local profile is enough for offline use; server storage can retry on later API turns.
  }
}

function syncViewportMetrics() {
  const viewport = window.visualViewport;
  const width = Math.max(320, Math.round(viewport?.width || window.innerWidth));
  const height = Math.max(420, Math.round(viewport?.height || window.innerHeight));
  const ratio = width / height;
  const root = document.documentElement;

  root.style.setProperty("--app-width", `${width}px`);
  root.style.setProperty("--app-height", `${height}px`);
  root.style.setProperty("--app-ratio", ratio.toFixed(3));
  root.dataset.viewportShape = width < 700 ? "narrow" : ratio > 1.8 ? "wide" : ratio < 0.85 ? "tall" : "regular";
}

function getScreenElements() {
  return [heroScreen, profileScreen, bookScreen, activityMenuScreen, teacherGateScreen, teacherDashboardScreen, scenarioScreen, adventureScreen, characterChatScreen, resultScreen];
}

function hasResultScreenContent() {
  return Boolean(resultPanel?.children.length);
}

function canMoveNextFrom(screenId) {
  if (screenId === "heroScreen" || screenId === "profileScreen" || screenId === "bookScreen") {
    return true;
  }

  if (screenId === "adventureScreen") {
    return hasResultScreenContent();
  }

  return false;
}

function updateScreenNavigation() {
  const currentIndex = screenOrder.indexOf(activeScreenId);
  screenStepLabel.textContent = screenLabels[activeScreenId] || "";
  screenPrevButton.disabled = currentIndex <= 0;
  screenNextButton.disabled = !canMoveNextFrom(activeScreenId);
}

function setActiveScreen(screenId) {
  activeScreenId = screenId;
  getScreenElements().forEach((screen) => {
    screen.classList.toggle("is-active-screen", screen.id === screenId);
  });
  document.body.dataset.activeScreen = screenId;
  document.documentElement.dataset.activeScreen = screenId;
  updateScreenNavigation();
}

function requestViewportSync() {
  window.cancelAnimationFrame(viewportRaf);
  viewportRaf = window.requestAnimationFrame(() => {
    syncViewportMetrics();
    updateScreenNavigation();
  });
}

function goToHero() {
  setActiveScreen("heroScreen");
}

function goToStudentProfile() {
  setActiveScreen("profileScreen");
  window.setTimeout(() => {
    if (!studentClassInput.value) {
      studentClassInput.focus();
    } else if (!studentNumberInput.value) {
      studentNumberInput.focus();
    } else {
      studentNicknameInput.focus();
    }
  }, 350);
}

function goToBooks() {
  if (!isStudentProfileComplete()) {
    goToStudentProfile();
    return;
  }

  setActiveScreen("bookScreen");
}

function goToActivityMenu() {
  if (!isStudentProfileComplete()) {
    goToStudentProfile();
    return;
  }

  scenarioBookTitle.textContent = selectedBook.title;
  setActiveScreen("activityMenuScreen");
}

function goToTeacherGate() {
  setTeacherGateStatus("코드를 입력하면 잠긴 문이 반응합니다.");
  teacherGatePanel.classList.remove("is-unlocking", "is-denied");
  teacherGateCodeInput.value = "";
  setActiveScreen("teacherGateScreen");
  window.setTimeout(() => teacherGateCodeInput.focus(), 250);
}

function goToScenario() {
  scenarioBookTitle.textContent = selectedBook.title;
  startTitleScenarioActivity();
  setActiveScreen("scenarioScreen");
  window.setTimeout(() => scenarioStepInput.focus(), 250);
}

function goToAdventure() {
  setActiveScreen("adventureScreen");
}

function goToCharacterChat() {
  startCharacterChatActivity();
  setActiveScreen("characterChatScreen");
}

function goToResult() {
  setActiveScreen("resultScreen");
}

function createTitleScenarioState(book = selectedBook) {
  return {
    bookId: book.id,
    bookTitle: book.title,
    stage: "character",
    answers: {
      character: "",
      setting: "",
      event: ""
    },
    messages: [],
    scenario: "",
    prompt: null,
    revisionCount: 0,
    lastRevisionId: "",
    lastRevisionLabel: "",
    busy: false
  };
}

function showScenarioError(message) {
  scenarioError.textContent = message;
  scenarioError.classList.toggle("is-hidden", !message);
}

function createTextElement(tagName, className, text) {
  const element = document.createElement(tagName);
  if (className) element.className = className;
  element.textContent = text;
  return element;
}

function setTeacherGateStatus(message, isError = false) {
  teacherGateStatus.textContent = message;
  teacherGateStatus.classList.toggle("is-error", isError);
}

function setTeacherDashboardStatus(message, isError = false) {
  teacherDashboardStatus.textContent = message;
  teacherDashboardStatus.classList.toggle("is-error", isError);
}

function normalizeTeacherStudent(student) {
  return {
    className: String(student?.className || "").trim(),
    number: String(student?.number || "").trim(),
    nickname: String(student?.nickname || "").trim()
  };
}

function getTeacherStudentKey(student, sessionId = "") {
  const normalized = normalizeTeacherStudent(student);
  const className = normalized.className.toLowerCase();
  const number = normalized.number.toLowerCase();
  return className && number ? `class:${className}|number:${number}` : `session:${sessionId || "anonymous"}`;
}

function getTeacherStudentLabel(student) {
  const normalized = normalizeTeacherStudent(student);
  const className = normalized.className ? `${normalized.className}반` : "";
  const number = normalized.number ? `${normalized.number}번` : "";
  return [className, number].filter(Boolean).join(" ");
}

function getTeacherCreatedAt(record) {
  return record.createdAt || record.clientTimestamp || "";
}

function compareTeacherCreatedAt(a, b) {
  return String(getTeacherCreatedAt(a)).localeCompare(String(getTeacherCreatedAt(b)));
}

function getTeacherRecordActivity(record) {
  if (record.type === "titleScenarioTurn" || record.type === "titleScenarioSubmission") return "activity1";
  if (record.type === "questionTurn" || record.type === "answerCheck" || record.type === "conversationAssessment") return "activity2";
  if (record.type === "characterChatTurn") return "activity3";
  if (record.type === "sessionStart") return "session";
  return "other";
}

function getTeacherActivityTabCounts(student) {
  return student.records.reduce((counts, record) => {
    counts.all += 1;
    const activity = getTeacherRecordActivity(record);
    if (counts[activity] !== undefined) counts[activity] += 1;
    return counts;
  }, {
    all: 0,
    activity1: 0,
    activity2: 0,
    activity3: 0,
    session: 0
  });
}

function getPreferredTeacherActivityTab(student) {
  return "all";
}

function getTeacherRecordsForTab(student, tab) {
  if (tab === "all") return student.records;
  return student.records.filter((record) => getTeacherRecordActivity(record) === tab);
}

function normalizeTeacherRecord(record) {
  const assessment = record.assessment || {};
  return {
    id: record.id || `${record.type || "record"}-${Math.random().toString(16).slice(2)}`,
    type: record.type || "adventureEvent",
    typeLabel: record.typeLabel || teacherRecordTypeLabels[record.type] || record.type || "기록",
    activityId: record.activityId || "",
    createdAt: getTeacherCreatedAt(record),
    sessionId: record.sessionId || "",
    nickname: String(record.nickname || record.studentNickname || record.student?.nickname || "").trim(),
    bookId: record.bookId || "",
    bookTitle: record.bookTitle || "",
    characterName: record.characterName || record.character?.name || "",
    studentMessage: record.studentMessage || record.message || record.question || "",
    characterReply: record.characterReply || record.answer || "",
    question: record.question || "",
    answer: record.answer || "",
    correct: typeof record.correct === "boolean" ? record.correct : null,
    message: record.message || "",
    scenarioText: record.scenarioText || "",
    promptKo: record.promptKo || record.nanoBananaPrompt?.ko || "",
    promptEn: record.promptEn || record.nanoBananaPrompt?.en || "",
    totalScore: assessment.totalScore ?? record.totalScore ?? null,
    maxScore: assessment.maxScore ?? record.maxScore ?? null,
    assessment,
    progress: record.progress || null,
    mode: record.mode || ""
  };
}

function buildTeacherParticipations(records) {
  const groups = new Map();

  records.forEach((record) => {
    const key = record.sessionId || "legacy-records";
    if (!groups.has(key)) {
      groups.set(key, {
        sessionId: record.sessionId || "",
        startedAt: record.createdAt || "",
        latestAt: record.createdAt || "",
        nickname: record.nickname || "",
        nicknames: [],
        records: []
      });
    }

    const group = groups.get(key);
    group.records.push(record);
    if (record.nickname && !group.nicknames.includes(record.nickname)) group.nicknames.push(record.nickname);
    if (record.nickname) group.nickname = record.nickname;
    if (!group.startedAt || String(record.createdAt).localeCompare(String(group.startedAt)) < 0) {
      group.startedAt = record.createdAt;
    }
    if (!group.latestAt || String(record.createdAt).localeCompare(String(group.latestAt)) > 0) {
      group.latestAt = record.createdAt;
    }
  });

  return Array.from(groups.values())
    .sort((a, b) => String(a.startedAt).localeCompare(String(b.startedAt)))
    .map((group, index) => ({
      ...group,
      participationNumber: index + 1,
      recordCount: group.records.length,
      bookTitles: Array.from(new Set(group.records.map((record) => record.bookTitle).filter(Boolean)))
    }));
}

function normalizeTeacherStudentGroup(group) {
  const records = Array.isArray(group.records) ? group.records.map(normalizeTeacherRecord).sort(compareTeacherCreatedAt) : [];
  const nicknames = new Set(Array.isArray(group.nicknames) ? group.nicknames : []);
  if (group.nickname) nicknames.add(group.nickname);

  const normalized = {
    studentKey: group.studentKey || getTeacherStudentKey(group, records[0]?.sessionId),
    className: String(group.className || "").trim(),
    number: String(group.number || "").trim(),
    nickname: String(group.nickname || "").trim(),
    nicknames: Array.from(nicknames).filter(Boolean),
    latestAt: group.latestAt || records[records.length - 1]?.createdAt || "",
    records
  };

  normalized.label = getTeacherStudentLabel(normalized);
  normalized.activity1Count = records.filter((record) => getTeacherRecordActivity(record) === "activity1").length;
  normalized.activity2Count = records.filter((record) => getTeacherRecordActivity(record) === "activity2").length;
  normalized.activity3Count = records.filter((record) => getTeacherRecordActivity(record) === "activity3").length;
  normalized.assessmentCount = records.filter((record) => record.type === "conversationAssessment").length;
  normalized.recordCount = records.length;
  normalized.participations = buildTeacherParticipations(records);
  normalized.participationCount = normalized.participations.length;
  return normalized;
}

function buildTeacherStudentsFromRecords(records) {
  const groups = new Map();

  records.forEach((record) => {
    const student = normalizeTeacherStudent(record.student);
    const key = record.studentKey || getTeacherStudentKey(student, record.sessionId);
    if (!groups.has(key)) {
      groups.set(key, {
        studentKey: key,
        className: student.className,
        number: student.number,
        nickname: student.nickname,
        nicknames: [],
        latestAt: "",
        records: []
      });
    }

    const group = groups.get(key);
    if (student.nickname && !group.nicknames.includes(student.nickname)) group.nicknames.push(student.nickname);
    if (!group.className && student.className) group.className = student.className;
    if (!group.number && student.number) group.number = student.number;
    if (student.nickname) group.nickname = student.nickname;

    const normalizedRecord = normalizeTeacherRecord(record);
    group.records.push(normalizedRecord);
    if (!group.latestAt || String(normalizedRecord.createdAt).localeCompare(String(group.latestAt)) > 0) {
      group.latestAt = normalizedRecord.createdAt;
    }
  });

  return Array.from(groups.values()).map(normalizeTeacherStudentGroup);
}

function prepareTeacherStudents(input) {
  const items = Array.isArray(input) ? input : [];
  const students = items.some((item) => Array.isArray(item.records))
    ? items.map(normalizeTeacherStudentGroup)
    : buildTeacherStudentsFromRecords(items);

  return students.sort((a, b) => {
    const classCompare = String(a.className).localeCompare(String(b.className), "ko", { numeric: true });
    if (classCompare) return classCompare;
    const numberCompare = String(a.number).localeCompare(String(b.number), "ko", { numeric: true });
    if (numberCompare) return numberCompare;
    return String(b.latestAt).localeCompare(String(a.latestAt));
  });
}

function teacherShortDate(value) {
  if (!value) return "날짜 없음";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleString("ko-KR", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function teacherPlainText(value) {
  return String(value || "").trim();
}

function createTeacherTextBlock(title, value) {
  const clean = teacherPlainText(value);
  if (!clean) return null;

  const block = document.createElement("section");
  block.className = "teacher-detail-block";
  const heading = document.createElement("strong");
  heading.textContent = title;
  const body = document.createElement("p");
  body.textContent = clean;
  block.append(heading, body);
  return block;
}

function getVisibleTeacherStudents() {
  const query = teacherStudentSearchInput.value.trim().toLowerCase();
  if (!query) return teacherState.students;

  return teacherState.students.filter((student) => [
    student.className,
    student.number,
    student.nickname,
    student.label,
    ...(student.nicknames || [])
  ].filter(Boolean).join(" ").toLowerCase().includes(query));
}

function renderTeacherSummary() {
  const recordCount = teacherState.students.reduce((sum, student) => sum + student.recordCount, 0);
  const participationCount = teacherState.students.reduce((sum, student) => sum + student.participationCount, 0);
  const activity1Count = teacherState.students.reduce((sum, student) => sum + student.activity1Count, 0);
  const activity2Count = teacherState.students.reduce((sum, student) => sum + student.activity2Count, 0);
  const activity3Count = teacherState.students.reduce((sum, student) => sum + student.activity3Count, 0);
  const assessmentCount = teacherState.students.reduce((sum, student) => sum + student.assessmentCount, 0);
  const summaryItems = [
    ["학생", teacherState.students.length],
    ["참여 횟수", participationCount],
    ["전체 기록", recordCount],
    ["활동 1 기록", activity1Count],
    ["활동 2 기록", activity2Count],
    ["활동 3 기록", activity3Count],
    ["평가 완료", assessmentCount]
  ];

  teacherSummaryStrip.innerHTML = "";
  summaryItems.forEach(([label, value]) => {
    const item = document.createElement("article");
    item.className = "teacher-summary-item";
    const labelElement = document.createElement("span");
    labelElement.textContent = label;
    const valueElement = document.createElement("strong");
    valueElement.textContent = String(value);
    item.append(labelElement, valueElement);
    teacherSummaryStrip.appendChild(item);
  });
}

function renderTeacherStudentList() {
  const visibleStudents = getVisibleTeacherStudents();
  teacherStudentList.innerHTML = "";

  if (!visibleStudents.length) {
    const empty = document.createElement("p");
    empty.className = "teacher-empty-state";
    empty.textContent = teacherState.students.length ? "검색에 맞는 학생이 없습니다." : "아직 불러온 학생 기록이 없습니다.";
    teacherStudentList.appendChild(empty);
    return;
  }

  if (!teacherState.selectedStudentKey || !visibleStudents.some((student) => student.studentKey === teacherState.selectedStudentKey)) {
    teacherState.selectedStudentKey = visibleStudents[0].studentKey;
    teacherState.selectedActivityTab = getPreferredTeacherActivityTab(visibleStudents[0]);
  }

  visibleStudents.forEach((student) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "teacher-student-button";
    button.classList.toggle("is-selected", student.studentKey === teacherState.selectedStudentKey);
    button.dataset.studentKey = student.studentKey;

    const title = document.createElement("strong");
    title.textContent = `${student.className || "-"}반 ${student.number || "-"}번`;
    const nickname = document.createElement("span");
    nickname.textContent = student.nickname ? `최근 활동 닉네임: ${student.nickname}` : "활동 닉네임 기록 없음";
    const meta = document.createElement("small");
    meta.textContent = `참여 ${student.participationCount}회 · 활동 1 ${student.activity1Count}개 · 활동 2 ${student.activity2Count}개 · 활동 3 ${student.activity3Count}개 · 최근 ${teacherShortDate(student.latestAt)}`;
    button.append(title, nickname, meta);
    teacherStudentList.appendChild(button);
  });
}

function renderTeacherScoreRows(assessment) {
  const rows = Array.isArray(assessment?.scores) ? assessment.scores : [];
  if (!rows.length) return null;

  const box = document.createElement("div");
  box.className = "teacher-score-list";
  rows.forEach((score) => {
    const row = document.createElement("div");
    row.className = "teacher-score-row";
    const value = Math.max(0, Math.min(5, Number(score.score || 0)));
    const label = document.createElement("span");
    label.textContent = score.label || "평가";
    const meter = document.createElement("meter");
    meter.min = 0;
    meter.max = 5;
    meter.value = value;
    const scoreText = document.createElement("strong");
    scoreText.textContent = `${value}/5`;
    const comment = document.createElement("p");
    comment.textContent = score.comment || "";
    row.append(label, meter, scoreText, comment);
    box.appendChild(row);
  });
  return box;
}

function renderTeacherRecord(record) {
  const card = document.createElement("article");
  card.className = `teacher-timeline-card is-${record.type}`;

  const header = document.createElement("header");
  header.className = "teacher-timeline-header";
  const type = document.createElement("span");
  type.textContent = record.typeLabel;
  const time = document.createElement("time");
  time.textContent = teacherShortDate(record.createdAt);
  header.append(type, time);
  card.appendChild(header);

  if (record.bookTitle || record.bookId) {
    const book = document.createElement("p");
    book.className = "teacher-book-line";
    book.textContent = `책: ${record.bookTitle || record.bookId}`;
    card.appendChild(book);
  }

  if (record.type === "conversationAssessment") {
    const score = document.createElement("div");
    score.className = "teacher-score-badge";
    score.textContent = `총점 ${record.totalScore ?? "-"} / ${record.maxScore ?? 10}`;
    card.appendChild(score);

    const scoreRows = renderTeacherScoreRows(record.assessment);
    if (scoreRows) card.appendChild(scoreRows);

    [
      createTeacherTextBlock("종합 피드백", record.assessment?.summary),
      createTeacherTextBlock("다음 목표", record.assessment?.nextStep),
      createTeacherTextBlock("최종 답안", record.answer)
    ].filter(Boolean).forEach((block) => card.appendChild(block));
    return card;
  }

  if (record.type === "characterChatTurn") {
    [
      createTeacherTextBlock("대화 인물", record.characterName),
      createTeacherTextBlock("학생의 말", record.studentMessage),
      createTeacherTextBlock("인물의 답변", record.characterReply || record.answer)
    ].filter(Boolean).forEach((block) => card.appendChild(block));
    return card;
  }

  if (record.type === "answerCheck") {
    const result = document.createElement("p");
    result.className = record.correct ? "teacher-answer-result is-correct" : "teacher-answer-result";
    result.textContent = record.correct ? "정답으로 확인됨" : "아직 더 생각해 볼 답안";
    card.appendChild(result);
  }

  [
    createTeacherTextBlock("질문", record.question),
    createTeacherTextBlock("응답", record.answer || record.message),
    createTeacherTextBlock("시나리오", record.scenarioText),
    createTeacherTextBlock("표지 프롬프트", record.promptKo || record.promptEn)
  ].filter(Boolean).forEach((block) => card.appendChild(block));

  return card;
}

function teacherCsvEscape(value) {
  return `"${String(value ?? "").replace(/"/g, '""').replace(/\r?\n/g, " ").trim()}"`;
}

function getTeacherRecordParticipation(student, record) {
  return student.participations.find((participation) => participation.records.includes(record)) || null;
}

function getTeacherRecordParticipationNumber(student, record) {
  return getTeacherRecordParticipation(student, record)?.participationNumber || "";
}

function buildTeacherCsv(student, records) {
  const header = ["participation", "createdAt", "type", "class", "number", "nickname", "book", "character", "question", "answer", "score", "summary", "nextStep", "scenarioText", "prompt"];
  const rows = records.map((record) => [
    getTeacherRecordParticipationNumber(student, record),
    record.createdAt,
    record.typeLabel,
    student.className,
    student.number,
    record.nickname || getTeacherRecordParticipation(student, record)?.nickname || student.nickname,
    record.bookTitle || record.bookId,
    record.characterName,
    record.question || record.studentMessage,
    record.answer || record.characterReply || record.message,
    record.totalScore == null ? "" : `${record.totalScore}/${record.maxScore || 10}`,
    record.assessment?.summary,
    record.assessment?.nextStep,
    record.scenarioText,
    record.promptKo || record.promptEn
  ].map(teacherCsvEscape).join(","));
  return [header.join(","), ...rows].join("\n");
}

function downloadTeacherStudentCsv(student) {
  const records = getTeacherRecordsForTab(student, teacherState.selectedActivityTab || "all");
  const csv = `\uFEFF${buildTeacherCsv(student, records)}`;
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `book-adventure-${student.className || "class"}-${student.number || "number"}-${teacherState.selectedActivityTab || "all"}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1200);
}

function getTeacherAssessmentPoints(student, activityTab = "all") {
  return student.participations.map((participation) => {
    const assessments = participation.records.filter((record) => {
      if (record.type !== "conversationAssessment") return false;
      return activityTab === "all" || getTeacherRecordActivity(record) === activityTab;
    });
    const record = assessments[assessments.length - 1];
    if (!record) return null;

    const totalScore = Number(record.totalScore ?? record.assessment?.totalScore);
    const maxScore = Number(record.maxScore ?? record.assessment?.maxScore ?? 15);
    if (!Number.isFinite(totalScore) || !Number.isFinite(maxScore) || maxScore <= 0) return null;

    return {
      participationNumber: participation.participationNumber,
      totalScore,
      maxScore,
      chartScore: Math.max(0, Math.min(15, (totalScore / maxScore) * 15)),
      createdAt: record.createdAt,
      nickname: participation.nickname || record.nickname || "",
      record
    };
  }).filter(Boolean);
}

function buildTeacherScoreGeometry(points) {
  const width = 720;
  const height = 260;
  const padding = { top: 32, right: 28, bottom: 54, left: 52 };
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;
  const coordinates = points.map((point, index) => ({
    ...point,
    x: points.length === 1 ? padding.left + plotWidth / 2 : padding.left + (plotWidth * index) / (points.length - 1),
    y: padding.top + plotHeight * (1 - point.chartScore / 15)
  }));
  return {
    width,
    height,
    padding,
    plotWidth,
    plotHeight,
    coordinates,
    path: coordinates.map((point, index) => `${index ? "L" : "M"} ${point.x.toFixed(2)} ${point.y.toFixed(2)}`).join(" ")
  };
}

function createTeacherSvgElement(tagName, attributes = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", tagName);
  Object.entries(attributes).forEach(([name, value]) => element.setAttribute(name, String(value)));
  return element;
}

function renderTeacherScoreTrend(student) {
  const section = document.createElement("section");
  section.className = "teacher-score-trend";
  const heading = document.createElement("div");
  heading.className = "teacher-score-trend-heading";
  const title = document.createElement("h4");
  title.textContent = "참여별 점수 변화";
  const description = document.createElement("p");
  description.textContent = "평가 총점을 15점 기준으로 맞춰 참여 순서대로 이어 봅니다.";
  heading.append(title, description);
  section.appendChild(heading);

  const points = getTeacherAssessmentPoints(student, teacherState.selectedActivityTab || "all");
  if (!points.length) {
    const empty = document.createElement("p");
    empty.className = "teacher-score-trend-empty";
    empty.textContent = teacherState.selectedActivityTab === "activity1" || teacherState.selectedActivityTab === "activity3" || teacherState.selectedActivityTab === "session"
      ? "이 활동에는 아직 점수 평가가 없습니다. 전체 또는 활동 2 탭에서 점수 변화를 확인하세요."
      : "평가 점수가 쌓이면 참여 회차별 변화가 여기에 선으로 표시됩니다.";
    section.appendChild(empty);
    return section;
  }

  const geometry = buildTeacherScoreGeometry(points);
  const svg = createTeacherSvgElement("svg", {
    class: "teacher-score-trend-chart",
    viewBox: `0 0 ${geometry.width} ${geometry.height}`,
    role: "img",
    "aria-label": points.map((point) => `${point.participationNumber}번째 참여 ${point.totalScore}점`).join(", ")
  });

  [0, 5, 10, 15].forEach((tick) => {
    const y = geometry.padding.top + geometry.plotHeight * (1 - tick / 15);
    svg.appendChild(createTeacherSvgElement("line", {
      class: "teacher-score-grid-line",
      x1: geometry.padding.left,
      x2: geometry.width - geometry.padding.right,
      y1: y,
      y2: y
    }));
    const label = createTeacherSvgElement("text", {
      class: "teacher-score-axis-label",
      x: geometry.padding.left - 12,
      y: y + 4,
      "text-anchor": "end"
    });
    label.textContent = String(tick);
    svg.appendChild(label);
  });

  if (geometry.coordinates.length > 1) {
    svg.appendChild(createTeacherSvgElement("path", {
      class: "teacher-score-trend-line",
      d: geometry.path
    }));
  }

  geometry.coordinates.forEach((point) => {
    const circle = createTeacherSvgElement("circle", {
      class: "teacher-score-trend-point",
      cx: point.x,
      cy: point.y,
      r: 7
    });
    const tooltip = createTeacherSvgElement("title");
    tooltip.textContent = `${point.participationNumber}번째 참여: ${point.totalScore}/${point.maxScore}점${point.nickname ? `, 닉네임 ${point.nickname}` : ""}`;
    circle.appendChild(tooltip);
    svg.appendChild(circle);

    const value = createTeacherSvgElement("text", {
      class: "teacher-score-point-value",
      x: point.x,
      y: Math.max(18, point.y - 14),
      "text-anchor": "middle"
    });
    value.textContent = `${point.totalScore}/${point.maxScore}`;
    svg.appendChild(value);

    const participation = createTeacherSvgElement("text", {
      class: "teacher-score-point-label",
      x: point.x,
      y: geometry.height - 22,
      "text-anchor": "middle"
    });
    participation.textContent = `${point.participationNumber}번째`;
    svg.appendChild(participation);
  });

  const chartWrap = document.createElement("div");
  chartWrap.className = "teacher-score-trend-chart-wrap";
  chartWrap.appendChild(svg);
  section.appendChild(chartWrap);

  if (points.length === 1) {
    const note = document.createElement("p");
    note.className = "teacher-score-trend-note";
    note.textContent = "다음 참여의 평가가 저장되면 점들이 선으로 이어집니다.";
    section.appendChild(note);
  }
  return section;
}

function teacherHtmlEscape(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function teacherReportField(title, value) {
  const clean = teacherPlainText(value);
  if (!clean) return "";
  return `<section class="field"><strong>${teacherHtmlEscape(title)}</strong><p>${teacherHtmlEscape(clean)}</p></section>`;
}

function teacherReportRecordHtml(record) {
  let body = "";
  if (record.type === "conversationAssessment") {
    const scores = Array.isArray(record.assessment?.scores) ? record.assessment.scores : [];
    body += `<div class="score-total">총점 ${teacherHtmlEscape(record.totalScore ?? "-")} / ${teacherHtmlEscape(record.maxScore ?? 15)}</div>`;
    body += `<div class="score-grid">${scores.map((score) => `<article><span>${teacherHtmlEscape(score.label || "평가")}</span><strong>${teacherHtmlEscape(score.score ?? 0)}/5</strong><p>${teacherHtmlEscape(score.comment || "")}</p></article>`).join("")}</div>`;
    body += teacherReportField("종합 피드백", record.assessment?.summary);
    body += teacherReportField("다음 목표", record.assessment?.nextStep);
    body += teacherReportField("최종 답안", record.answer);
  } else if (record.type === "characterChatTurn") {
    body += teacherReportField("대화 인물", record.characterName);
    body += teacherReportField("학생의 말", record.studentMessage);
    body += teacherReportField("인물의 답변", record.characterReply || record.answer);
  } else {
    if (record.type === "answerCheck") {
      body += `<p class="answer-result">${record.correct ? "정답으로 확인됨" : "아직 더 생각해 볼 답안"}</p>`;
    }
    body += teacherReportField("질문", record.question);
    body += teacherReportField("응답", record.answer || record.message);
    body += teacherReportField("시나리오", record.scenarioText);
    body += teacherReportField("표지 프롬프트", record.promptKo || record.promptEn);
  }

  return `<article class="record">
    <header><strong>${teacherHtmlEscape(record.typeLabel)}</strong><time>${teacherHtmlEscape(teacherShortDate(record.createdAt))}</time></header>
    ${record.bookTitle || record.bookId ? `<p class="book">책: ${teacherHtmlEscape(record.bookTitle || record.bookId)}</p>` : ""}
    ${body || "<p class=\"muted\">세부 내용이 없는 기록입니다.</p>"}
  </article>`;
}

function teacherReportChartHtml(points) {
  if (!points.length) return `<p class="chart-empty">아직 저장된 평가 점수가 없습니다.</p>`;
  const geometry = buildTeacherScoreGeometry(points);
  const grid = [0, 5, 10, 15].map((tick) => {
    const y = geometry.padding.top + geometry.plotHeight * (1 - tick / 15);
    return `<line x1="${geometry.padding.left}" x2="${geometry.width - geometry.padding.right}" y1="${y}" y2="${y}"></line><text x="${geometry.padding.left - 12}" y="${y + 4}" text-anchor="end">${tick}</text>`;
  }).join("");
  const line = geometry.coordinates.length > 1 ? `<path d="${geometry.path}"></path>` : "";
  const pointsHtml = geometry.coordinates.map((point) => `<g><circle cx="${point.x}" cy="${point.y}" r="7"><title>${teacherHtmlEscape(`${point.participationNumber}번째 참여 ${point.totalScore}/${point.maxScore}점`)}</title></circle><text class="value" x="${point.x}" y="${Math.max(18, point.y - 14)}" text-anchor="middle">${teacherHtmlEscape(`${point.totalScore}/${point.maxScore}`)}</text><text class="label" x="${point.x}" y="${geometry.height - 22}" text-anchor="middle">${teacherHtmlEscape(`${point.participationNumber}번째`)}</text></g>`).join("");
  return `<svg class="chart" viewBox="0 0 ${geometry.width} ${geometry.height}" role="img" aria-label="참여별 점수 변화">${grid}${line}${pointsHtml}</svg>`;
}

function buildTeacherStudentReportHtml(student) {
  const points = getTeacherAssessmentPoints(student, "all");
  const participationHtml = student.participations.slice().reverse().map((participation) => {
    const nickname = participation.nickname || "기록 없음";
    return `<details open class="participation">
      <summary><strong>${teacherHtmlEscape(participation.participationNumber)}번째 참여</strong><span>${teacherHtmlEscape(teacherShortDate(participation.startedAt))}</span><small>활동 닉네임: ${teacherHtmlEscape(nickname)}</small></summary>
      <div class="records">${participation.records.slice().reverse().map(teacherReportRecordHtml).join("")}</div>
    </details>`;
  }).join("");
  const identity = `${student.className || "-"}반 ${student.number || "-"}번`;
  const generatedAt = new Date().toLocaleString("ko-KR");

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${teacherHtmlEscape(identity)} 독서 모험 보고서</title>
  <style>
    :root{color-scheme:dark;--bg:#160d08;--panel:#24150d;--paper:#fffaf0;--ink:#2b1a10;--gold:#c99b52;--line:#dbc49e}*{box-sizing:border-box}body{margin:0;background:var(--bg);color:#f8ead2;font-family:"Noto Sans KR","Malgun Gothic",sans-serif;line-height:1.6}.page{width:min(1040px,calc(100% - 32px));margin:28px auto 60px}.report-header{display:flex;justify-content:space-between;gap:24px;align-items:flex-start;padding:24px;border:1px solid rgba(219,196,158,.35);border-radius:8px;background:var(--panel)}h1{margin:4px 0;font-size:34px}.eyebrow,.muted{color:#cdbda5}.print-button{border:1px solid var(--line);border-radius:8px;padding:11px 14px;background:#d1a75f;color:#1e120b;font-weight:800;cursor:pointer;white-space:nowrap}.summary{margin:18px 0;padding:18px;border-radius:8px;background:var(--paper);color:var(--ink)}.summary h2{margin:0 0 4px}.chart{display:block;width:100%;height:auto;margin-top:12px}.chart line{stroke:#dfd1b9;stroke-width:1}.chart path{fill:none;stroke:#956323;stroke-width:4;stroke-linecap:round;stroke-linejoin:round}.chart circle{fill:#fff8e9;stroke:#956323;stroke-width:4}.chart text{fill:#745c3d;font-size:12px}.chart .value{fill:#4b2e14;font-size:13px;font-weight:800}.chart .label{font-weight:700}.chart-empty{padding:24px;border:1px dashed #c8b18b;border-radius:8px;text-align:center}.participation{margin-top:14px;border:1px solid rgba(219,196,158,.35);border-radius:8px;background:var(--panel);overflow:hidden}.participation summary{display:grid;grid-template-columns:auto 1fr auto;gap:14px;align-items:center;padding:16px;cursor:pointer}.participation summary span{color:#d4c6b1}.participation summary small{text-align:right;color:#e7c88f}.records{display:grid;gap:12px;padding:0 14px 14px}.record{padding:16px;border-radius:8px;background:var(--paper);color:var(--ink)}.record header{display:flex;justify-content:space-between;gap:16px;border-bottom:1px solid #e4d7c1;padding-bottom:8px}.record time,.book{color:#76634d}.field{margin-top:12px;padding-top:10px;border-top:1px solid #eee2ce}.field p{margin:4px 0 0;white-space:pre-wrap}.score-total,.answer-result{display:inline-block;margin-top:12px;padding:7px 10px;border-radius:8px;background:#ead4aa;font-weight:800}.score-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;margin-top:10px}.score-grid article{padding:10px;border:1px solid #e0cfb2;border-radius:8px}.score-grid span,.score-grid strong{display:block}.score-grid p{margin:6px 0 0;font-size:13px}.book{margin:10px 0 0}@media(max-width:700px){.report-header{display:grid}.participation summary,.score-grid{grid-template-columns:1fr}.participation summary small{text-align:left}}@media print{:root{color-scheme:light}body{background:#fff;color:#111}.page{width:100%;margin:0}.print-button{display:none}.report-header,.participation{border-color:#bbb;background:#fff;color:#111}.participation{break-inside:avoid}.record{border:1px solid #ccc}.summary{border:1px solid #bbb}}
  </style>
</head>
<body>
  <main class="page">
    <header class="report-header"><div><p class="eyebrow">독서 모험 학생 보고서</p><h1>${teacherHtmlEscape(identity)}</h1><p>참여 ${student.participationCount}회, 누적 기록 ${student.recordCount}개, 평가 ${student.assessmentCount}개</p><small class="muted">생성 시각: ${teacherHtmlEscape(generatedAt)}</small></div><button class="print-button" onclick="window.print()">인쇄 또는 PDF 저장</button></header>
    <section class="summary"><h2>참여별 점수 변화</h2><p>평가 총점을 15점 기준으로 맞춰 참여 순서대로 표시합니다.</p>${teacherReportChartHtml(points)}</section>
    <section aria-label="참여 회차별 기록">${participationHtml || `<p class="chart-empty">저장된 참여 기록이 없습니다.</p>`}</section>
  </main>
</body>
</html>`;
}

function downloadTeacherStudentHtmlReport(student) {
  const html = buildTeacherStudentReportHtml(student);
  const blob = new Blob([html], { type: "text/html;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `book-adventure-${student.className || "class"}-${student.number || "number"}-report-${new Date().toISOString().slice(0, 10)}.html`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1200);
}

function renderTeacherActivityTabs(student) {
  const counts = getTeacherActivityTabCounts(student);
  const tabs = ["all", "activity1", "activity2", "activity3", "session"];
  const container = document.createElement("div");
  container.className = "teacher-activity-tabs";

  tabs.forEach((tabId) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "teacher-activity-tab-button";
    button.classList.toggle("is-selected", teacherState.selectedActivityTab === tabId);
    button.disabled = tabId !== "all" && counts[tabId] === 0;
    button.dataset.activityTab = tabId;
    const label = document.createElement("span");
    label.textContent = teacherActivityTabLabels[tabId];
    const count = document.createElement("strong");
    count.textContent = String(counts[tabId]);
    button.append(label, count);
    button.addEventListener("click", () => {
      teacherState.selectedActivityTab = tabId;
      renderTeacherStudentDetail();
    });
    container.appendChild(button);
  });

  return container;
}

function renderTeacherParticipations(student, records) {
  const container = document.createElement("div");
  container.className = "teacher-participation-list";
  const participationBySession = new Map(
    student.participations.map((participation) => [participation.sessionId || "legacy-records", participation])
  );
  const groups = buildTeacherParticipations(records)
    .map((group) => participationBySession.get(group.sessionId || "legacy-records") || group)
    .filter((group) => group.records.some((record) => records.includes(record)))
    .map((group) => ({
      ...group,
      records: group.records.filter((record) => records.includes(record))
    }))
    .sort((a, b) => Number(b.participationNumber || 0) - Number(a.participationNumber || 0));

  groups.forEach((participation, index) => {
    const details = document.createElement("details");
    details.className = "teacher-participation";
    details.open = index === 0;

    const summary = document.createElement("summary");
    summary.className = "teacher-participation-summary";
    const title = document.createElement("strong");
    title.textContent = `${participation.participationNumber || 1}번째 참여`;
    const date = document.createElement("span");
    date.textContent = teacherShortDate(participation.startedAt);
    const meta = document.createElement("small");
    const books = Array.from(new Set(participation.records.map((record) => record.bookTitle).filter(Boolean)));
    const nickname = participation.nickname || "닉네임 기록 없음";
    meta.textContent = `활동 닉네임: ${nickname} · ${participation.records.length}개 기록${books.length ? ` · ${books.join(", ")}` : ""}`;
    summary.append(title, date, meta);

    const recordList = document.createElement("div");
    recordList.className = "teacher-participation-records";
    participation.records.forEach((record) => recordList.appendChild(renderTeacherRecord(record)));
    details.append(summary, recordList);
    container.appendChild(details);
  });

  return container;
}

function renderTeacherStudentDetail() {
  const student = teacherState.students.find((item) => item.studentKey === teacherState.selectedStudentKey);
  teacherStudentDetail.innerHTML = "";

  if (!student) {
    const empty = document.createElement("p");
    empty.className = "teacher-empty-state";
    empty.textContent = "왼쪽에서 학생을 선택하면 활동 기록이 시간순으로 보입니다.";
    teacherStudentDetail.appendChild(empty);
    return;
  }

  const counts = getTeacherActivityTabCounts(student);
  if (!teacherState.selectedActivityTab || (teacherState.selectedActivityTab !== "all" && counts[teacherState.selectedActivityTab] === 0)) {
    teacherState.selectedActivityTab = getPreferredTeacherActivityTab(student);
  }

  const header = document.createElement("header");
  header.className = "teacher-detail-header";
  const headerText = document.createElement("div");
  const kicker = document.createElement("p");
  kicker.className = "teacher-detail-kicker";
  kicker.textContent = "학생 결과";
  const title = document.createElement("h3");
  title.textContent = `${student.className || "-"}반 ${student.number || "-"}번`;
  const meta = document.createElement("p");
  meta.textContent = `참여 ${student.participationCount}회 · 누적 기록 ${student.recordCount}개 · 활동 1 ${student.activity1Count}개 · 활동 2 ${student.activity2Count}개 · 활동 3 ${student.activity3Count}개 · 평가 ${student.assessmentCount}개`;
  headerText.append(kicker, title, meta);
  header.appendChild(headerText);

  const headerActions = document.createElement("div");
  headerActions.className = "teacher-detail-actions";
  const csvButton = document.createElement("button");
  csvButton.type = "button";
  csvButton.textContent = "현재 탭 CSV";
  csvButton.addEventListener("click", () => downloadTeacherStudentCsv(student));
  const reportButton = document.createElement("button");
  reportButton.type = "button";
  reportButton.textContent = "학생 HTML 보고서";
  reportButton.addEventListener("click", () => downloadTeacherStudentHtmlReport(student));
  headerActions.append(csvButton, reportButton);
  header.appendChild(headerActions);
  teacherStudentDetail.appendChild(header);

  const nicknameNote = document.createElement("p");
  nicknameNote.className = "teacher-nickname-note";
  nicknameNote.textContent = "학생 결과는 반과 번호로 묶습니다. 닉네임은 각 참여 회차 안에서 확인할 수 있습니다.";
  teacherStudentDetail.appendChild(nicknameNote);

  teacherStudentDetail.appendChild(renderTeacherActivityTabs(student));
  teacherStudentDetail.appendChild(renderTeacherScoreTrend(student));

  const filteredRecords = getTeacherRecordsForTab(student, teacherState.selectedActivityTab);
  const timelineNote = document.createElement("p");
  timelineNote.className = "teacher-timeline-note";
  timelineNote.textContent = teacherState.selectedActivityTab === "all"
    ? "참여 회차를 눌러 기록을 열거나 닫을 수 있습니다. 활동별로 보려면 탭을 선택하세요."
    : `${teacherActivityTabLabels[teacherState.selectedActivityTab]} 기록을 참여 회차별로 보고 있습니다.`;
  teacherStudentDetail.appendChild(timelineNote);

  if (!filteredRecords.length) {
    const empty = document.createElement("p");
    empty.className = "teacher-empty-state";
    empty.textContent = "이 탭에는 아직 기록이 없습니다.";
    teacherStudentDetail.appendChild(empty);
  } else {
    teacherStudentDetail.appendChild(renderTeacherParticipations(student, filteredRecords));
  }
}

function teacherDateKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value || "").slice(0, 10);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getTeacherPromptItems() {
  return teacherState.students.flatMap((student) => student.records
    .filter((record) => record.type === "titleScenarioSubmission" && (record.promptKo || record.promptEn))
    .map((record) => ({
      id: record.id,
      createdAt: record.createdAt,
      dateKey: teacherDateKey(record.createdAt),
      student: `${student.className || "-"}반 ${student.number || "-"}번${record.nickname || student.nickname ? ` · ${record.nickname || student.nickname}` : ""}`,
      bookTitle: record.bookTitle || "책 제목 없음",
      promptKo: record.promptKo || "",
      promptEn: record.promptEn || ""
    })))
    .sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
}

function getVisibleTeacherPromptItems() {
  const items = getTeacherPromptItems();
  return teacherState.promptDate ? items.filter((item) => item.dateKey === teacherState.promptDate) : items;
}

function buildTeacherPromptText(items) {
  return items.map((item) => [
    `제출 일시: ${teacherShortDate(item.createdAt)}`,
    `학생: ${item.student}`,
    `책: ${item.bookTitle}`,
    "이미지 생성 프롬프트:",
    item.promptKo ? `[한국어]\n${item.promptKo}` : "",
    item.promptEn ? `[English]\n${item.promptEn}` : ""
  ].filter(Boolean).join("\n")).join("\n\n------------------------------\n\n");
}

function getSelectedTeacherPromptItems() {
  return getTeacherPromptItems().filter((item) => teacherState.selectedPromptIds.has(item.id));
}

function renderTeacherPromptView() {
  const items = getVisibleTeacherPromptItems();
  teacherPromptList.innerHTML = "";

  if (!items.length) {
    const empty = document.createElement("p");
    empty.className = "teacher-empty-state";
    empty.textContent = teacherState.promptDate ? "선택한 날짜에 제출된 이미지 생성 프롬프트가 없습니다." : "아직 제출된 이미지 생성 프롬프트가 없습니다.";
    teacherPromptList.appendChild(empty);
  } else {
    const groups = new Map();
    items.forEach((item) => {
      if (!groups.has(item.dateKey)) groups.set(item.dateKey, []);
      groups.get(item.dateKey).push(item);
    });

    groups.forEach((groupItems, dateKey) => {
      const group = document.createElement("section");
      group.className = "teacher-prompt-date-group";
      const heading = document.createElement("h3");
      heading.textContent = `${dateKey} · ${groupItems.length}건`;
      group.appendChild(heading);

      groupItems.forEach((item) => {
        const card = document.createElement("article");
        card.className = "teacher-prompt-card";
        const label = document.createElement("label");
        label.className = "teacher-prompt-check";
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = teacherState.selectedPromptIds.has(item.id);
        checkbox.dataset.promptId = item.id;
        const title = document.createElement("strong");
        title.textContent = `${item.student} · ${item.bookTitle}`;
        label.append(checkbox, title);

        const time = document.createElement("time");
        time.dateTime = item.createdAt;
        time.textContent = teacherShortDate(item.createdAt);
        const prompt = document.createElement("pre");
        prompt.textContent = [
          item.promptKo ? `[한국어]\n${item.promptKo}` : "",
          item.promptEn ? `[English]\n${item.promptEn}` : ""
        ].filter(Boolean).join("\n\n");
        card.append(label, time, prompt);
        group.appendChild(card);
      });
      teacherPromptList.appendChild(group);
    });
  }

  const selectedCount = getSelectedTeacherPromptItems().length;
  teacherPromptSelectionStatus.textContent = selectedCount ? `${selectedCount}개 프롬프트를 선택했습니다.` : "선택한 프롬프트가 없습니다.";
  teacherPromptCopyButton.disabled = selectedCount === 0;
  teacherPromptExportButton.disabled = selectedCount === 0;
  teacherPromptClearSelectionButton.disabled = selectedCount === 0;
  teacherPromptSelectAllButton.disabled = items.length === 0;
}

function setTeacherView(view) {
  teacherState.activeView = view === "prompts" ? "prompts" : "students";
  const promptActive = teacherState.activeView === "prompts";
  teacherStudentView.classList.toggle("is-hidden", promptActive);
  teacherPromptView.classList.toggle("is-hidden", !promptActive);
  teacherStudentViewTab.classList.toggle("is-selected", !promptActive);
  teacherPromptViewTab.classList.toggle("is-selected", promptActive);
  teacherStudentViewTab.setAttribute("aria-selected", String(!promptActive));
  teacherPromptViewTab.setAttribute("aria-selected", String(promptActive));
  if (promptActive) renderTeacherPromptView();
}

async function copySelectedTeacherPrompts() {
  const text = buildTeacherPromptText(getSelectedTeacherPromptItems());
  if (!text) return;
  try {
    await navigator.clipboard.writeText(text);
  } catch (error) {
    const field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    document.execCommand("copy");
    field.remove();
  }
  teacherPromptSelectionStatus.textContent = `${getSelectedTeacherPromptItems().length}개 프롬프트를 클립보드에 복사했습니다.`;
}

function exportSelectedTeacherPrompts() {
  const items = getSelectedTeacherPromptItems();
  const text = buildTeacherPromptText(items);
  if (!text) return;
  const blob = new Blob(["\uFEFF", text], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `book-adventure-image-prompts-${teacherDateKey(new Date())}.txt`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1200);
  teacherPromptSelectionStatus.textContent = `${items.length}개 프롬프트를 UTF-8 TXT로 내보냈습니다.`;
}

function renderTeacherDashboard() {
  renderTeacherSummary();
  renderTeacherStudentList();
  renderTeacherStudentDetail();
  setTeacherView(teacherState.activeView);
}

function setTeacherStudents(input, message) {
  teacherState.students = prepareTeacherStudents(input);
  const promptIds = new Set(getTeacherPromptItems().map((item) => item.id));
  teacherState.selectedPromptIds = new Set(Array.from(teacherState.selectedPromptIds).filter((id) => promptIds.has(id)));
  teacherState.selectedStudentKey = teacherState.students[0]?.studentKey || "";
  teacherState.selectedActivityTab = teacherState.students[0] ? getPreferredTeacherActivityTab(teacherState.students[0]) : "";
  renderTeacherDashboard();
  setTeacherDashboardStatus(message);
}

async function loadTeacherResultsFromCode(code, { animateDoor = false } = {}) {
  teacherGateSubmitButton.disabled = true;
  teacherRefreshButton.disabled = true;
  setTeacherGateStatus("다이얼이 천천히 맞물리는 중입니다.");
  setTeacherDashboardStatus("학생 기록을 불러오는 중입니다.");

  try {
    const response = await fetch("/api/adventure/teacher-results?limit=800", {
      headers: {
        "x-teacher-access-code": code
      }
    });
    const data = await response.json().catch(() => ({}));

    if (!response.ok || !data.ok) {
      throw new Error(data.message || "교사용 코드가 맞지 않거나 결과실을 열 수 없습니다.");
    }

    teacherState.accessCode = code;
    setTeacherStudents(data.students || [], `${data.studentCount || 0}명의 학생 기록을 불러왔습니다.`);

    if (animateDoor) {
      teacherGatePanel.classList.remove("is-denied");
      teacherGatePanel.classList.add("is-unlocking");
      setTeacherGateStatus("문이 열리고 있습니다.");
      window.setTimeout(() => setActiveScreen("teacherDashboardScreen"), 900);
    }
  } catch (error) {
    teacherGatePanel.classList.remove("is-unlocking");
    teacherGatePanel.classList.add("is-denied");
    window.setTimeout(() => teacherGatePanel.classList.remove("is-denied"), 520);
    setTeacherGateStatus(error.message || "문이 열리지 않았어요. 코드를 다시 확인해 주세요.", true);
    setTeacherDashboardStatus("학생 기록을 불러오지 못했습니다.", true);
  } finally {
    teacherGateSubmitButton.disabled = false;
    teacherRefreshButton.disabled = false;
  }
}

function getTitleScenarioQuestion(stage) {
  if (stage === "character") {
    return "등장인물부터 상상해 보자. 누가 나올 것 같아?";
  }

  if (stage === "setting") {
    return "좋아. 이번에는 배경을 정해 보자. 어디서, 언제 일어나는 이야기일까?";
  }

  return "마지막으로, 그곳에서 어떤 일이 벌어질 것 같아?";
}

function getTitleScenarioHint(stage) {
  if (stage === "character") {
    return "예를 들면 길을 잃은 아이, 비밀을 아는 사서, 밤마다 책장을 지키는 친구처럼 써도 좋아.";
  }

  if (stage === "setting") {
    return "예를 들면 오래된 마을, 달빛이 비치는 도서관, 미래 도시, 비 오는 산길처럼 장소와 때를 같이 적어도 좋아.";
  }

  return "예를 들면 사라진 편지를 찾는다, 이상한 문이 열린다, 오래된 약속을 지킨다처럼 사건을 한 문장으로 써 봐.";
}

function isHelpRequest(text) {
  return /모르|어려|예시|힌트|도움/.test(text);
}

function appendTitleScenarioMessage(role, text) {
  if (!titleScenarioActivity) return;
  titleScenarioActivity.messages.push({
    role,
    text: String(text || ""),
    createdAt: new Date().toISOString()
  });
}

function renderTitleScenarioLog() {
  scenarioChatLog.innerHTML = "";

  titleScenarioActivity.messages.forEach((message) => {
    const item = document.createElement("div");
    item.className = `scenario-message is-${message.role === "user" ? "user" : "guide"}`;
    item.textContent = message.text;
    scenarioChatLog.appendChild(item);
  });

  scenarioChatLog.scrollTop = scenarioChatLog.scrollHeight;
}

function renderTitleScenarioChoices() {
  scenarioChoicePanel.innerHTML = "";

  if (!titleScenarioActivity || (titleScenarioActivity.stage !== "review" && titleScenarioActivity.stage !== "final")) {
    scenarioChoicePanel.classList.add("is-hidden");
    return;
  }

  scenarioChoicePanel.classList.remove("is-hidden");

  if (titleScenarioActivity.stage === "final") {
    const resultButton = document.createElement("button");
    resultButton.type = "button";
    resultButton.className = "scenario-choice-button is-primary";
    resultButton.dataset.scenarioAction = "showResult";
    resultButton.textContent = "결과 다시 보기";
    resultButton.disabled = Boolean(titleScenarioActivity.busy);

    const restartButton = document.createElement("button");
    restartButton.type = "button";
    restartButton.className = "scenario-choice-button";
    restartButton.dataset.scenarioAction = "restart";
    restartButton.textContent = "처음부터 다시 하기";
    restartButton.disabled = Boolean(titleScenarioActivity.busy);

    scenarioChoicePanel.append(resultButton, restartButton);
    return;
  }

  titleScenarioRevisionChoices.forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "scenario-choice-button";
    button.dataset.scenarioAction = "revise";
    button.dataset.revisionId = choice.id;
    button.textContent = choice.label;
    button.disabled = Boolean(titleScenarioActivity.busy);
    scenarioChoicePanel.appendChild(button);
  });

  const confirmButton = document.createElement("button");
  confirmButton.type = "button";
  confirmButton.className = "scenario-choice-button is-primary";
  confirmButton.dataset.scenarioAction = "finalize";
  confirmButton.textContent = "이거 좋아! 확정하기";
  confirmButton.disabled = Boolean(titleScenarioActivity.busy);
  scenarioChoicePanel.appendChild(confirmButton);
}

function renderTitleScenarioActivity() {
  if (!titleScenarioActivity) return;

  renderTitleScenarioLog();
  renderTitleScenarioChoices();
  showScenarioError("");

  if (titleScenarioActivity.busy) {
    scenarioStepInput.disabled = true;
    scenarioStepSubmitButton.disabled = true;
    scenarioStepInput.placeholder = "AI 사서가 이야기를 다듬는 중이에요.";
    scenarioStepSubmitButton.textContent = "대기";
    return;
  }

  if (titleScenarioActivity.stage === "final") {
    scenarioStepInput.value = "";
    scenarioStepInput.disabled = true;
    scenarioStepSubmitButton.disabled = true;
    scenarioStepInput.placeholder = "이미 확정한 결과는 결과 화면에서 볼 수 있어요.";
    scenarioStepSubmitButton.textContent = "완료";
    return;
  }

  if (titleScenarioActivity.stage === "review") {
    scenarioStepInput.disabled = false;
    scenarioStepSubmitButton.disabled = false;
    scenarioStepInput.placeholder = "직접 바꾸고 싶은 점을 써도 좋아요.";
    scenarioStepSubmitButton.textContent = "고쳐 쓰기";
    return;
  }

  scenarioStepInput.disabled = false;
  scenarioStepSubmitButton.disabled = false;
  scenarioStepInput.placeholder = "생각을 한 문장으로 써 보세요.";
  scenarioStepSubmitButton.textContent = "보내기";
}

function startTitleScenarioActivity({ restart = false } = {}) {
  if (!titleScenarioActivity || titleScenarioActivity.bookId !== selectedBook.id || restart) {
    titleScenarioActivity = createTitleScenarioState(selectedBook);
    appendTitleScenarioMessage(
      "guide",
      `오늘 상상할 책의 제목은 「${selectedBook.title}」이야. 제목만 보고 어떤 이야기일지 같이 상상해 볼까?`
    );
    appendTitleScenarioMessage("guide", getTitleScenarioQuestion("character"));
  }

  renderTitleScenarioActivity();
}

function setTitleScenarioBusy(isBusy) {
  if (!titleScenarioActivity) return;
  titleScenarioActivity.busy = isBusy;
  renderTitleScenarioActivity();
}

function getTitleScenarioSnapshot(limit = 12) {
  return (titleScenarioActivity?.messages || []).slice(-limit).map((message) => ({
    role: message.role === "user" ? "user" : "agent",
    text: message.text,
    createdAt: message.createdAt
  }));
}

async function requestTitleScenarioAI(action, extra = {}) {
  if (typeof window.requestTitleScenarioTurn !== "function") {
    throw new Error("Title scenario AI client is unavailable.");
  }

  return window.requestTitleScenarioTurn({
    action,
    student: getStudentSnapshot(),
    book: {
      id: selectedBook.id,
      title: selectedBook.title,
      author: selectedBook.author,
      description: selectedBook.description
    },
    answers: { ...titleScenarioActivity.answers },
    scenarioText: titleScenarioActivity.scenario || "",
    conversation: getTitleScenarioSnapshot(20),
    ...extra
  });
}

async function createTitleScenarioDraft() {
  setTitleScenarioBusy(true);

  try {
    const result = await requestTitleScenarioAI("draft");
    const scenarioText = String(result?.scenarioText || "").trim();
    if (!scenarioText) throw new Error(AI_UNAVAILABLE_MESSAGE);
    titleScenarioActivity.scenario = scenarioText;
    appendTitleScenarioMessage("guide", result?.guideText || "좋아. 네가 상상한 세 가지를 살려서 짧은 가상 줄거리로 만들어 봤어.");
    appendTitleScenarioMessage("guide", titleScenarioActivity.scenario);
    titleScenarioActivity.stage = "review";
    appendTitleScenarioMessage("guide", "이 이야기를 어떻게 바꿔볼까? 아래 보기에서 고르거나, 직접 바꾸고 싶은 점을 써 줘.");
  } catch (error) {
    titleScenarioActivity.stage = "event";
    appendTitleScenarioMessage("guide", formatApiError(error, "가상 시나리오 만들기"));
  } finally {
    titleScenarioActivity.busy = false;
    renderTitleScenarioActivity();
  }
}

async function handleTitleScenarioAnswer(answer) {
  const cleanAnswer = answer.trim();
  if (!cleanAnswer) {
    showScenarioError("생각을 한 문장으로 적어 주세요.");
    return;
  }

  if (isHelpRequest(cleanAnswer)) {
    appendTitleScenarioMessage("guide", getTitleScenarioHint(titleScenarioActivity.stage));
    scenarioStepInput.value = "";
    renderTitleScenarioActivity();
    return;
  }

  appendTitleScenarioMessage("user", cleanAnswer);

  if (titleScenarioActivity.stage === "character") {
    titleScenarioActivity.answers.character = cleanAnswer;
    titleScenarioActivity.stage = "setting";
    appendTitleScenarioMessage("guide", getTitleScenarioQuestion("setting"));
  } else if (titleScenarioActivity.stage === "setting") {
    titleScenarioActivity.answers.setting = cleanAnswer;
    titleScenarioActivity.stage = "event";
    appendTitleScenarioMessage("guide", getTitleScenarioQuestion("event"));
  } else if (titleScenarioActivity.stage === "event") {
    titleScenarioActivity.answers.event = cleanAnswer;
    scenarioStepInput.value = "";
    appendTitleScenarioMessage("guide", "좋아. 이제 네 생각을 바탕으로 AI 사서가 가상 시나리오를 써 볼게.");
    renderTitleScenarioActivity();
    await createTitleScenarioDraft();
    return;
  }

  scenarioStepInput.value = "";
  renderTitleScenarioActivity();
}

async function reviseTitleScenario(revisionId, customRequest = "") {
  const choice = titleScenarioRevisionChoices.find((item) => item.id === revisionId);
  const label = choice?.label || customRequest;

  if (!label) {
    showScenarioError("바꾸고 싶은 방향을 골라 주세요.");
    return;
  }

  titleScenarioActivity.revisionCount += 1;
  titleScenarioActivity.lastRevisionId = revisionId || "custom";
  titleScenarioActivity.lastRevisionLabel = label;
  appendTitleScenarioMessage("user", label);
  scenarioStepInput.value = "";
  setTitleScenarioBusy(true);

  try {
    const result = await requestTitleScenarioAI("revise", {
      revisionId: revisionId || "custom",
      revisionLabel: label,
      customRequest
    });
    const scenarioText = String(result?.scenarioText || "").trim();
    if (!scenarioText) throw new Error(AI_UNAVAILABLE_MESSAGE);
    titleScenarioActivity.scenario = scenarioText;
    appendTitleScenarioMessage("guide", result?.guideText || "좋아. 그 방향으로 다시 고쳐 쓴 시나리오야.");
    appendTitleScenarioMessage("guide", titleScenarioActivity.scenario);
    appendTitleScenarioMessage("guide", "마음에 들면 확정하고, 더 바꾸고 싶으면 다시 골라 줘.");
  } catch (error) {
    appendTitleScenarioMessage("guide", formatApiError(error, "시나리오 고치기"));
  } finally {
    titleScenarioActivity.busy = false;
    renderTitleScenarioActivity();
  }
}

function normalizeNanoBananaPrompt(prompt) {
  if (!prompt || typeof prompt !== "object") return null;

  return {
    mood: String(prompt.mood || ""),
    scene: String(prompt.scene || ""),
    colors: String(prompt.colors || ""),
    ko: String(prompt.ko || ""),
    en: String(prompt.en || "")
  };
}

async function createNanoBananaPromptWithAI() {
  setTitleScenarioBusy(true);

  try {
    const result = await requestTitleScenarioAI("prompt", {
      revisionId: titleScenarioActivity.lastRevisionId || "",
      revisionLabel: titleScenarioActivity.lastRevisionLabel || ""
    });
    const prompt = normalizeNanoBananaPrompt(result?.nanoBananaPrompt);
    if (!prompt?.ko || !prompt?.en) throw new Error(AI_UNAVAILABLE_MESSAGE);
    titleScenarioActivity.prompt = prompt;

    if (result?.scenarioText) {
      titleScenarioActivity.scenario = String(result.scenarioText).trim();
    }

    if (result?.guideText) {
      appendTitleScenarioMessage("guide", result.guideText);
    }
    return true;
  } catch (error) {
    titleScenarioActivity.prompt = null;
    appendTitleScenarioMessage("guide", formatApiError(error, "이미지 생성 프롬프트 만들기"));
    return false;
  } finally {
    titleScenarioActivity.busy = false;
    renderTitleScenarioActivity();
  }
}

function saveTitleScenarioSubmissionLocally(payload) {
  const saved = readJsonStorage(TITLE_SCENARIO_SUBMISSIONS_KEY, []);
  const submissions = Array.isArray(saved) ? saved : [];
  const nextItem = {
    id: `title-scenario-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    savedAt: new Date().toISOString(),
    ...payload
  };
  submissions.push(nextItem);
  writeJsonStorage(TITLE_SCENARIO_SUBMISSIONS_KEY, submissions.slice(-120));
  return nextItem;
}

function buildTitleScenarioSubmissionPayload() {
  return {
    activityId: "title-scenario",
    student: getStudentSnapshot(),
    book: {
      id: selectedBook.id,
      title: selectedBook.title,
      author: selectedBook.author
    },
    answers: { ...titleScenarioActivity.answers },
    scenarioText: titleScenarioActivity.scenario,
    nanoBananaPrompt: titleScenarioActivity.prompt,
    promptKo: titleScenarioActivity.prompt?.ko || "",
    promptEn: titleScenarioActivity.prompt?.en || "",
    conversation: titleScenarioActivity.messages.slice(-30),
    revisionCount: titleScenarioActivity.revisionCount,
    createdAt: new Date().toISOString()
  };
}

async function submitTitleScenarioForTeacher(statusElement, button) {
  const payload = buildTitleScenarioSubmissionPayload();
  button.disabled = true;
  statusElement.textContent = "제출하는 중이에요.";

  try {
    const result = typeof window.submitTitleScenarioToTeacher === "function"
      ? await window.submitTitleScenarioToTeacher(payload)
      : { ...saveTitleScenarioSubmissionLocally(payload), storage: "browser-local-storage", localSaved: true };

    if (result?.saved && result.storage === "cosmos-db") {
      statusElement.textContent = "제출 완료. 선생님용 데이터 저장소에 기록됐어요.";
    } else if (result?.localSaved || result?.storage === "browser-local-storage") {
      statusElement.textContent = "서버 저장소가 아직 연결되지 않아 이 기기 브라우저에 임시 저장했어요.";
    } else {
      statusElement.textContent = "서버가 받았지만 저장소 설정이 비어 있어요. 관리자 설정을 확인해 주세요.";
    }
  } catch (error) {
    saveTitleScenarioSubmissionLocally(payload);
    statusElement.textContent = "서버 연결이 불안정해서 이 기기 브라우저에 임시 저장했어요.";
  } finally {
    button.disabled = false;
  }
}

async function renderTitleScenarioResult() {
  if (titleScenarioActivity.stage !== "final") {
    appendTitleScenarioMessage(
      "guide",
      `멋진 상상 이야기가 완성됐어. 이제 「${selectedBook.title}」 표지 그림 프롬프트를 결과 화면에서 확인해 보자.`
    );
  }

  if (!titleScenarioActivity.prompt?.ko || !titleScenarioActivity.prompt?.en) {
    appendTitleScenarioMessage("guide", "AI 사서가 표지 그림 프롬프트를 마지막으로 다듬는 중이야.");
    renderTitleScenarioActivity();
    const created = await createNanoBananaPromptWithAI();
    if (!created || !titleScenarioActivity.prompt?.ko || !titleScenarioActivity.prompt?.en) {
      titleScenarioActivity.stage = "review";
      appendTitleScenarioMessage("guide", "프롬프트가 아직 완성되지 않았어요. 아래의 ‘이거 좋아! 확정하기’를 다시 누르면 같은 내용으로 재시도할 수 있어요.");
      renderTitleScenarioActivity();
      return false;
    }
  }

  titleScenarioActivity.stage = "final";
  resultOriginScreenId = "scenarioScreen";
  resultPanel.innerHTML = "";

  const card = document.createElement("article");
  card.className = "scenario-result-card";

  const content = document.createElement("div");
  content.className = "scenario-result-content";

  const header = document.createElement("header");
  header.className = "scenario-result-header";
  header.append(
    createTextElement("p", "section-label", "활동 1 결과"),
    createTextElement("h3", "", `${getStudentLabel()}의 표지 상상 결과`),
    createTextElement("p", "scenario-result-book", `책 제목: ${selectedBook.title}`)
  );

  const scenarioBox = document.createElement("section");
  scenarioBox.className = "scenario-result-box";
  scenarioBox.append(
    createTextElement("strong", "", "확정한 가상 시나리오"),
    createTextElement("p", "", titleScenarioActivity.scenario)
  );

  const promptGrid = document.createElement("section");
  promptGrid.className = "scenario-prompt-grid";

  const koPrompt = document.createElement("div");
  koPrompt.className = "scenario-prompt-box";
  koPrompt.append(createTextElement("strong", "", "나노바나나 프롬프트"), createTextElement("pre", "", titleScenarioActivity.prompt.ko));

  const enPrompt = document.createElement("div");
  enPrompt.className = "scenario-prompt-box";
  enPrompt.append(createTextElement("strong", "", "English Prompt"), createTextElement("pre", "", titleScenarioActivity.prompt.en));

  promptGrid.append(koPrompt, enPrompt);

  const submitRow = document.createElement("div");
  submitRow.className = "scenario-submit-row";

  const submitButton = document.createElement("button");
  submitButton.type = "button";
  submitButton.className = "scenario-submit-button";
  submitButton.textContent = "선생님께 제출";

  const status = createTextElement("p", "scenario-submit-status", "아직 제출하지 않았어요.");
  submitButton.addEventListener("click", () => submitTitleScenarioForTeacher(status, submitButton));

  submitRow.append(submitButton, status);
  content.append(header, scenarioBox, promptGrid, submitRow);

  const librarian = document.createElement("div");
  librarian.className = "scenario-result-librarian";
  librarian.setAttribute("aria-label", "토끼 사서 캐릭터");

  const librarianFrame = document.createElement("div");
  librarianFrame.className = "scenario-result-librarian-frame";
  librarian.appendChild(librarianFrame);

  card.append(content, librarian);
  resultPanel.appendChild(card);
  goToResult();
  return true;
}

async function handleTitleScenarioFormSubmit(event) {
  event.preventDefault();
  if (!titleScenarioActivity) startTitleScenarioActivity();
  if (titleScenarioActivity.busy) return;

  const answer = scenarioStepInput.value.trim();
  if (titleScenarioActivity.stage === "review") {
    await reviseTitleScenario("custom", answer);
    return;
  }

  await handleTitleScenarioAnswer(answer);
}

async function handleTitleScenarioChoiceClick(event) {
  const button = event.target.closest("[data-scenario-action]");
  if (!button) return;
  if (titleScenarioActivity?.busy) return;

  const action = button.dataset.scenarioAction;
  if (action === "finalize") {
    await renderTitleScenarioResult();
    return;
  }

  if (action === "showResult") {
    await renderTitleScenarioResult();
    return;
  }

  if (action === "restart") {
    startTitleScenarioActivity({ restart: true });
    scenarioStepInput.focus();
    return;
  }

  if (action === "revise") {
    await reviseTitleScenario(button.dataset.revisionId);
  }
}

function getMajorCharacters(book) {
  return majorCharactersByBook[book.id] || ["주요 인물", "상대 인물", "조력자"];
}

function getCharacterProfiles(book) {
  const names = getMajorCharacters(book);
  const roles = characterRoleByBook[book.id] || [];
  const profileImages = profileImageByBook[book.id] || [];
  const standingImages = standingImageByBook[book.id] || [];

  return names.map((name, index) => ({
    id: `${book.id}-character-${index + 1}`,
    name,
    role: roles[index] || "주요 인물",
    profileImage: profileImages[index] ? `./assets/characters/${profileImages[index]}` : `./assets/characters/profiles/${book.id}-${index + 1}.png`,
    sceneImage: standingImages[index] ? `./assets/characters/${standingImages[index]}` : ""
  }));
}

function getCharacterChatRules(book, character) {
  const bookRules = characterChatRulesByBook[book.id] || {};
  const exactRules = bookRules[character.name] || {};

  return {
    speechStyle: exactRules.speechStyle || `${character.name}의 역할에 맞게 자연스럽고 짧게 말한다. 초등학생이 이해하기 쉬운 한국어를 쓴다.`,
    perspective: exactRules.perspective || `「${book.title}」 속 ${character.role || "주요 인물"}의 입장에서, 자신이 직접 겪거나 느꼈을 법한 범위 안에서 말한다.`,
    boundaries: exactRules.boundaries || [
      "작품 전체 결말이나 정답을 먼저 단정하지 않는다.",
      "책에 없는 사건을 새로 만들어 사실처럼 말하지 않는다.",
      "학생이 더 생각할 수 있도록 마지막에는 짧은 질문을 하나 남긴다."
    ],
    starter: exactRules.starter || `${character.name}입니다. 나에게 궁금한 장면이나 마음을 물어봐 주세요.`
  };
}

function createCharacterChatState(book = selectedBook) {
  return {
    bookId: book.id,
    bookTitle: book.title,
    selectedCharacter: null,
    messages: [],
    busy: false,
    forceScrollToBottom: true
  };
}

function showCharacterChatError(message) {
  characterChatError.textContent = message;
  characterChatError.classList.toggle("is-hidden", !message);
}

function appendCharacterChatMessage(role, text, character = characterChatActivity?.selectedCharacter) {
  if (!characterChatActivity) return;
  const entry = {
    role,
    text: String(text || ""),
    characterName: role === "character" ? character?.name || "" : "",
    createdAt: new Date().toISOString()
  };
  characterChatActivity.messages.push(entry);
  characterChatActivity.messages = characterChatActivity.messages.slice(-40);
  renderCharacterChatLog();
}

function getCharacterChatSnapshot(limit = 12) {
  return (characterChatActivity?.messages || []).slice(-limit).map((message) => ({
    role: message.role === "student" ? "user" : "character",
    text: message.text,
    characterName: message.characterName || characterChatActivity?.selectedCharacter?.name || "",
    createdAt: message.createdAt
  }));
}

function renderCharacterChatProfiles() {
  characterChatProfileGrid.innerHTML = "";
  getCharacterProfiles(selectedBook).forEach((character, index) => {
    const button = document.createElement("button");
    button.className = "profile-button character-chat-profile";
    button.type = "button";
    button.dataset.characterChatIndex = String(index);
    button.classList.toggle("is-selected", characterChatActivity?.selectedCharacter?.id === character.id);

    const avatar = document.createElement("span");
    avatar.className = "profile-image";

    const image = document.createElement("img");
    image.src = character.profileImage;
    image.alt = `${character.name} 프로필`;
    image.loading = "lazy";
    image.addEventListener("load", () => avatar.classList.add("has-image"));
    image.addEventListener("error", () => avatar.classList.remove("has-image"));

    const placeholder = document.createElement("span");
    placeholder.className = "profile-placeholder";
    placeholder.setAttribute("aria-hidden", "true");

    const name = document.createElement("span");
    name.className = "profile-name";
    name.textContent = character.name;

    const role = document.createElement("span");
    role.className = "profile-role";
    role.textContent = character.role;

    avatar.append(image, placeholder);
    button.append(avatar, name, role);
    characterChatProfileGrid.appendChild(button);
  });
}

function renderCharacterChatLog() {
  const distanceFromBottom = characterChatLog.scrollHeight - characterChatLog.scrollTop - characterChatLog.clientHeight;
  const shouldStickToBottom = Boolean(characterChatActivity?.forceScrollToBottom) || distanceFromBottom <= 64;
  const previousScrollTop = characterChatLog.scrollTop;
  characterChatLog.innerHTML = "";
  const messages = characterChatActivity?.messages || [];

  if (!messages.length) {
    const empty = document.createElement("p");
    empty.className = "character-chat-empty";
    empty.textContent = "아직 대화가 없습니다. 인물을 고르고 첫 질문을 건네 보세요.";
    characterChatLog.appendChild(empty);
    characterChatActivity.forceScrollToBottom = false;
    return;
  }

  messages.forEach((message) => {
    const item = document.createElement("div");
    item.className = `character-chat-message is-${message.role}`;
    const label = document.createElement("strong");
    label.textContent = message.role === "student" ? "나" : message.characterName || characterChatActivity?.selectedCharacter?.name || "인물";
    const body = document.createElement("p");
    body.textContent = message.text;
    item.append(label, body);
    characterChatLog.appendChild(item);
  });

  if (shouldStickToBottom) {
    const behavior = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    characterChatLog.scrollTo({ top: characterChatLog.scrollHeight, behavior });
  } else {
    characterChatLog.scrollTop = previousScrollTop;
  }
  characterChatActivity.forceScrollToBottom = false;
}

function renderCharacterChatActivity() {
  if (!characterChatActivity) return;
  characterChatBookTitle.textContent = selectedBook.title;
  characterChatIntro.textContent = `「${selectedBook.title}」의 주요 인물 중 한 명을 골라 직접 대화해 보세요.`;
  renderCharacterChatProfiles();
  renderCharacterChatLog();
  updateCharacterChatControls();
}

function updateCharacterChatControls() {
  if (!characterChatActivity) return;
  characterChatInput.disabled = !characterChatActivity.selectedCharacter || characterChatActivity.busy;
  characterChatSubmitButton.disabled = !characterChatActivity.selectedCharacter || characterChatActivity.busy;
  characterChatSubmitButton.textContent = characterChatActivity.busy ? "듣는 중" : "말 걸기";
  characterChatInput.placeholder = characterChatActivity.selectedCharacter
    ? `${characterChatActivity.selectedCharacter.name}에게 묻고 싶은 말`
    : "먼저 왼쪽에서 인물을 고르세요.";
}

function selectCharacterChatCharacter(index) {
  const character = getCharacterProfiles(selectedBook)[index];
  if (!characterChatActivity || !character) return;

  characterChatActivity.selectedCharacter = character;
  characterChatActivity.messages = [];
  characterChatActivity.forceScrollToBottom = true;
  const rules = getCharacterChatRules(selectedBook, character);
  appendCharacterChatMessage("character", rules.starter, character);
  showCharacterChatError("");
  renderCharacterChatActivity();
  window.setTimeout(() => characterChatInput.focus(), 80);
}

async function requestCharacterChatReply(payload) {
  if (typeof window.talkToBookCharacter === "function") {
    return window.talkToBookCharacter(payload);
  }

  throw new Error(AI_UNAVAILABLE_MESSAGE);
}

async function submitCharacterChatMessage(text) {
  const message = text.trim();
  const character = characterChatActivity?.selectedCharacter;
  if (!message) {
    showCharacterChatError("인물에게 건넬 말을 써 주세요.");
    return;
  }

  if (!character) {
    showCharacterChatError("먼저 대화할 인물을 골라 주세요.");
    return;
  }

  const rules = getCharacterChatRules(selectedBook, character);
  const previousConversation = getCharacterChatSnapshot(16);
  appendCharacterChatMessage("student", message, character);
  characterChatInput.value = "";
  characterChatActivity.busy = true;
  updateCharacterChatControls();

  const payload = {
    activityId: "character-chat",
    student: getStudentSnapshot(),
    book: {
      id: selectedBook.id,
      title: selectedBook.title,
      author: selectedBook.author,
      description: selectedBook.description
    },
    character,
    characterRules: rules,
    message,
    conversation: previousConversation
  };

  try {
    const result = await requestCharacterChatReply(payload);
    const reply = String(result?.reply || result?.answer || "").trim();
    if (!reply) throw new Error(AI_UNAVAILABLE_MESSAGE);
    appendCharacterChatMessage("character", reply, character);
  } catch (error) {
    appendCharacterChatMessage("character", formatApiError(error, "인물의 답변 만들기"), character);
  } finally {
    characterChatActivity.busy = false;
    updateCharacterChatControls();
    characterChatInput.focus();
  }
}

function startCharacterChatActivity({ restart = false } = {}) {
  if (!characterChatActivity || characterChatActivity.bookId !== selectedBook.id || restart) {
    characterChatActivity = createCharacterChatState(selectedBook);
  }

  showCharacterChatError("");
  renderCharacterChatActivity();
}

function getBookLocations(book) {
  return locationsByBook[book.id] || [
    {
      name: "중요한 장면의 장소",
      summary: "책에서 사건이 크게 움직이는 곳",
      clue: "인물의 말, 행동, 분위기를 함께 살펴볼 수 있는 곳"
    }
  ];
}

function formatDetailQuestion(question, category) {
  if (category.id !== "mind") return question;

  const characterName = activeCharacter?.name || "인물";
  return question.replace(/\{인물명\}/g, characterName);
}

function setSceneCharacter(character) {
  characterPortrait.classList.remove("is-place-hidden");
  const isGuideCharacter = !character;
  const nextImage = isGuideCharacter ? GUIDE_CHARACTER_IMAGE : character?.sceneImage;
  characterPortrait.classList.toggle("is-guide-character", isGuideCharacter);

  if (!nextImage) {
    characterImage.removeAttribute("src");
    characterPortrait.classList.remove("has-image");
    return;
  }

  characterPortrait.classList.remove("has-image");
  characterImage.onload = () => characterPortrait.classList.add("has-image");
  characterImage.onerror = () => characterPortrait.classList.remove("has-image");
  characterImage.src = nextImage;
  if (characterImage.complete && characterImage.naturalWidth > 0) {
    characterPortrait.classList.add("has-image");
  }
}

function setScenePlace(place) {
  if (!place?.image) {
    adventureBackdrop.style.removeProperty("--place-image");
    adventureBackdrop.classList.remove("has-place-image");
    characterPortrait.classList.remove("is-place-hidden");
    return;
  }

  adventureBackdrop.style.setProperty("--place-image", `url("${place.image}")`);
  adventureBackdrop.classList.add("has-place-image");
  characterPortrait.classList.add("is-place-hidden");
}

function normalizeAnswerText(text) {
  return text.replace(/\s/g, "").toLowerCase();
}

function getFinalAnswerRule(book) {
  const firstCharacter = getMajorCharacters(book)[0] || book.title;

  return finalAnswerRulesByBook[book.id] || {
    question: `「${book.title}」에서 끝까지 풀어야 할 숨은 질문은 무엇일까?`,
    answer: `${firstCharacter}이/가 이 책의 핵심 인물입니다.`,
    keywords: [firstCharacter]
  };
}

function getMysteryQuestion(book) {
  return getFinalAnswerRule(book).question;
}

function resetAdventureProgress() {
  adventureProgress = {
    chancesLeft: 10,
    cluesFound: 0,
    solved: false
  };
}

function updateAnswerGuessButton() {
  answerGuessButton.disabled = adventureProgress.solved;
  answerGuessButton.classList.toggle("is-solved", adventureProgress.solved);
  answerGuessButton.textContent = adventureProgress.solved ? "정답 완료" : "정답 맞추기";
}

function updateReadingStatus() {
  const characters = getMajorCharacters(selectedBook).join(", ");
  statusSummary.replaceChildren();
  [
    { className: "status-student", text: `학생: ${getStudentLabel()}` },
    { className: "status-chances", text: `기회: ${adventureProgress.chancesLeft}/10` },
    { className: "status-clues", text: `발견한 단서: ${adventureProgress.cluesFound}` },
    { className: "status-characters", text: `주요 인물: ${characters}` }
  ].forEach((line) => {
    const item = document.createElement("span");
    item.className = line.className;
    item.textContent = line.text;
    statusSummary.appendChild(item);
  });
  updateAnswerGuessButton();
}

function setDialogue(text, speaker = "AI 독서 파트너") {
  speakerName.textContent = speaker;
  dialogueText.textContent = text;
}

function syncAdventureBook() {
  adventureBookTitle.textContent = selectedBook.title;
  adventureBookAuthor.textContent = selectedBook.author;
  hudBookTitle.textContent = selectedBook.title;
  hudBookAuthor.textContent = selectedBook.author;
  hudQuestionText.textContent = getMysteryQuestion(selectedBook);
  adventureScreen.style.setProperty("--scene-a", selectedBook.coverA);
  adventureScreen.style.setProperty("--scene-b", selectedBook.coverB);
  characterPortrait.style.setProperty("--scene-a", selectedBook.coverA);
  characterPortrait.style.setProperty("--scene-b", selectedBook.coverB);
  if (activePlace) {
    setScenePlace(activePlace);
  } else {
    setScenePlace(null);
    setSceneCharacter(activeCharacter);
  }
  updateReadingStatus();
}

function clearQuestionPanel() {
  questionPanel.innerHTML = "";
}

function toggleCustomQuestion(shouldShow) {
  customQuestionForm.classList.toggle("is-hidden", !shouldShow);
  if (!shouldShow) {
    customQuestionInput.value = "";
  }
}

function setCustomQuestionButtonText(text) {
  customQuestionButton.textContent = text;
}

function toggleNextQuestionButton(shouldShow) {
  nextQuestionButton.classList.toggle("is-hidden", !shouldShow);
}

function appendChatMessage(text, role = "agent", options = {}) {
  const message = document.createElement("p");
  message.className = `chat-message is-${role}`;
  message.textContent = text;
  chatLog.appendChild(message);
  chatLog.scrollTop = chatLog.scrollHeight;

  if (role === "agent" || role === "guide") {
    setDialogue(text, "AI 독서 파트너");
  } else if (role === "user") {
    setDialogue(text, "나");
  }

  if (options.record !== false) {
    recordConversationMessage(text, role);
  }
}

function showChoiceOverlay() {
  const isCompactAnswerMode = customInputMode === "answer";
  readingChat.classList.remove("is-hidden");
  dialogueBox.classList.add("is-question-mode");
  dialogueBox.classList.remove("is-answer-mode");
  dialogueBox.classList.toggle("is-compact-answer-mode", isCompactAnswerMode);
  adventureScreen.classList.toggle("is-answer-guess-mode", isCompactAnswerMode);
  toggleNextQuestionButton(false);
}

function hideChoiceOverlay() {
  readingChat.classList.add("is-hidden");
  dialogueBox.classList.remove("is-question-mode");
  dialogueBox.classList.add("is-answer-mode");
  dialogueBox.classList.remove("is-compact-answer-mode");
  adventureScreen.classList.remove("is-answer-guess-mode");
}

function renderCategoryChoices(options = {}) {
  const shouldUpdateDialogue = options.updateDialogue !== false;

  activeCategory = null;
  activeCharacter = null;
  activePlace = null;
  customInputMode = "question";
  setScenePlace(null);
  setSceneCharacter(null);
  chatTitle.textContent = getMysteryQuestion(selectedBook);
  clearQuestionPanel();
  toggleCustomQuestion(false);
  setCustomQuestionButtonText("묻기");
  updateReadingStatus();
  showChoiceOverlay();

  if (shouldUpdateDialogue) {
    setDialogue("이 질문을 풀기 위해 어디서 단서를 찾을까? ① 인물의 마음, ② 장소 돌아보기 중에서 골라줘.", "AI 독서 파트너");
  }

  questionCategories.forEach((category) => {
    const button = document.createElement("button");
    button.className = "choice-button";
    button.type = "button";
    button.dataset.categoryId = category.id;
    button.innerHTML = `<strong>${category.number} ${category.title}</strong><span>${category.summary}</span>`;
    questionPanel.appendChild(button);
  });
}

function renderCharacterChoices(categoryId) {
  const category = questionCategories.find((item) => item.id === categoryId);
  if (!category) return;

  activeCategory = category;
  activeCharacter = null;
  activePlace = null;
  customInputMode = "question";
  setScenePlace(null);
  chatTitle.textContent = "Q. 누구의 마음?";
  clearQuestionPanel();
  toggleCustomQuestion(false);
  setCustomQuestionButtonText("묻기");
  updateReadingStatus();
  showChoiceOverlay();
  setDialogue("마음을 살펴볼 인물을 먼저 골라줘. 인물을 고르면 바로 세부 질문으로 이어갈게.", "AI 독서 파트너");

  const profileGrid = document.createElement("div");
  profileGrid.className = "profile-grid";

  getCharacterProfiles(selectedBook).forEach((character, index) => {
    const button = document.createElement("button");
    button.className = "profile-button";
    button.type = "button";
    button.dataset.characterIndex = String(index);

    const avatar = document.createElement("span");
    avatar.className = "profile-image";

    const image = document.createElement("img");
    image.src = character.profileImage;
    image.alt = `${character.name} 프로필`;
    image.loading = "lazy";
    image.addEventListener("load", () => avatar.classList.add("has-image"));
    image.addEventListener("error", () => avatar.classList.remove("has-image"));

    const placeholder = document.createElement("span");
    placeholder.className = "profile-placeholder";
    placeholder.setAttribute("aria-hidden", "true");

    const name = document.createElement("span");
    name.className = "profile-name";
    name.textContent = character.name;

    const role = document.createElement("span");
    role.className = "profile-role";
    role.textContent = character.role;

    avatar.append(image, placeholder);
    button.append(avatar, name, role);
    profileGrid.appendChild(button);
  });

  questionPanel.appendChild(profileGrid);
}

function renderPlaceChoices(categoryId) {
  const category = questionCategories.find((item) => item.id === categoryId);
  if (!category) return;

  activeCategory = category;
  activeCharacter = null;
  activePlace = null;
  customInputMode = "question";
  setScenePlace(null);
  chatTitle.textContent = "Q. 어느 장소를 돌아볼까?";
  clearQuestionPanel();
  toggleCustomQuestion(false);
  setCustomQuestionButtonText("묻기");
  updateReadingStatus();
  showChoiceOverlay();
  setDialogue("이번에는 장소를 살펴보자. 장소를 고르면 그곳에 숨어 있는 분위기와 단서를 함께 찾아볼게.", "AI 독서 파트너");

  const placeGrid = document.createElement("div");
  placeGrid.className = "place-grid";

  getBookLocations(selectedBook).forEach((place, index) => {
    const button = document.createElement("button");
    button.className = "place-button";
    button.type = "button";
    button.dataset.placeIndex = String(index);

    const name = document.createElement("strong");
    name.textContent = place.name;

    const summary = document.createElement("span");
    summary.textContent = place.summary;

    const clue = document.createElement("small");
    clue.textContent = place.clue;

    button.append(name, summary, clue);
    placeGrid.appendChild(button);
  });

  questionPanel.appendChild(placeGrid);
}

function renderDetailQuestions(categoryId) {
  const category = questionCategories.find((item) => item.id === categoryId);
  if (!category) return;

  if (category.id === "mind" && !activeCharacter) {
    renderCharacterChoices(categoryId);
    return;
  }

  if (category.id === "place" && !activePlace) {
    renderPlaceChoices(categoryId);
    return;
  }

  activeCategory = category;
  customInputMode = "question";
  const targetTitle = activeCharacter && category.id === "mind"
    ? `${activeCharacter.name}의 마음`
    : activePlace && category.id === "place"
      ? `${activePlace.name} 돌아보기`
      : category.title;
  chatTitle.textContent = `${category.number} ${targetTitle}`;
  clearQuestionPanel();
  toggleCustomQuestion(true);
  setCustomQuestionButtonText("묻기");
  updateReadingStatus();
  showChoiceOverlay();
  setDialogue(`${targetTitle}에 대해 더 구체적으로 물어보자. 기본 질문을 고르거나 직접 질문을 써도 좋아.`, "AI 독서 파트너");

  category.questions.forEach((questionTemplate) => {
    const question = formatDetailQuestion(questionTemplate, category);
    const button = document.createElement("button");
    button.className = "detail-button";
    button.type = "button";
    button.dataset.questionText = question;
    button.textContent = question;
    questionPanel.appendChild(button);
  });

  customQuestionInput.placeholder = `${targetTitle} 질문 직접 입력`;
  customQuestionInput.focus();
}

function openAdventureScreen() {
  if (activeAdventureBookId !== selectedBook.id) {
    chatLog.innerHTML = "";
    activeCategory = null;
    activeCharacter = null;
    activePlace = null;
    activeAdventureBookId = selectedBook.id;
    resetConversationLog();
    resetAdventureProgress();
  }

  syncAdventureBook();
  resultPanel.innerHTML = "";
  chatStarted = true;
  updateReadingStatus();

  if (!chatLog.children.length) {
    appendChatMessage(`${studentProfile?.nickname || "친구"}, 「${selectedBook.title}」 속으로 들어왔어. 오늘 풀 질문은 “${getMysteryQuestion(selectedBook)}”야.`, "guide");
  }

  renderCategoryChoices();
  goToAdventure();
}

function returnToBookShelf() {
  goToBooks();
}

async function moveToNextScreen() {
  if (activeScreenId === "heroScreen") {
    goToStudentProfile();
    return;
  }

  if (activeScreenId === "profileScreen") {
    await saveStudentProfileAndGoToBooks();
    return;
  }

  if (activeScreenId === "bookScreen") {
    goToActivityMenu();
    return;
  }

  if (activeScreenId === "adventureScreen" && hasResultScreenContent()) {
    goToResult();
  }
}

function moveToPreviousScreen() {
  if (activeScreenId === "profileScreen") {
    goToHero();
    return;
  }

  if (activeScreenId === "bookScreen") {
    goToStudentProfile();
    return;
  }

  if (activeScreenId === "activityMenuScreen") {
    goToBooks();
    return;
  }

  if (activeScreenId === "scenarioScreen") {
    goToActivityMenu();
    return;
  }

  if (activeScreenId === "adventureScreen") {
    goToActivityMenu();
    return;
  }

  if (activeScreenId === "characterChatScreen") {
    goToActivityMenu();
    return;
  }

  if (activeScreenId === "resultScreen") {
    if (resultOriginScreenId === "scenarioScreen") {
      goToScenario();
    } else {
      goToAdventure();
    }
  }
}

async function requestAgentAnswer(payload) {
  if (typeof window.sendReadingQuestionToAgent === "function") {
    return window.sendReadingQuestionToAgent(payload);
  }

  throw new Error(AI_UNAVAILABLE_MESSAGE);
}

async function requestAnswerCheck(payload) {
  if (typeof window.checkReadingAnswerWithAgent === "function") {
    return window.checkReadingAnswerWithAgent(payload);
  }

  throw new Error(AI_UNAVAILABLE_MESSAGE);
}

async function requestConversationAssessment(payload) {
  if (typeof window.assessAdventureConversation === "function") {
    return window.assessAdventureConversation(payload);
  }

  throw new Error(AI_UNAVAILABLE_MESSAGE);
}

function normalizeAnswerCheckResult(result) {
  if (result && typeof result === "object") {
    return {
      correct: Boolean(result.correct),
      message: String(result.message || "")
    };
  }

  return {
    correct: false,
    message: String(result || AI_UNAVAILABLE_MESSAGE)
  };
}

function normalizeAssessmentResult(result) {
  const scores = Array.isArray(result?.scores) ? result.scores : [];

  return {
    totalScore: Number(result?.totalScore || scores.reduce((sum, item) => sum + Number(item.score || 0), 0)),
    maxScore: Number(result?.maxScore || Math.max(15, scores.length * 5)),
    scores: scores.map((item) => ({
      id: String(item.id || ""),
      label: String(item.label || "평가 항목"),
      score: Math.max(0, Math.min(5, Number(item.score || 0))),
      comment: String(item.comment || "")
    })),
    summary: String(result?.summary || "독서 모험 결과를 정리했어요."),
    nextStep: String(result?.nextStep || "다음에는 더 많은 단서를 근거로 말해 보세요.")
  };
}

function renderAssessmentResult(assessment) {
  clearQuestionPanel();
  toggleCustomQuestion(false);
  toggleNextQuestionButton(false);
  chatTitle.textContent = "나의 독서 모험 결과";
  hideChoiceOverlay();
  resultOriginScreenId = "adventureScreen";
  resultPanel.innerHTML = "";

  const card = document.createElement("article");
  card.className = "assessment-card";

  const librarian = document.createElement("div");
  librarian.className = "assessment-librarian";
  librarian.setAttribute("aria-label", "AI 사서 캐릭터 자리");

  const librarianFrame = document.createElement("div");
  librarianFrame.className = "assessment-librarian-frame";
  librarianFrame.setAttribute("aria-hidden", "true");

  const librarianPlaceholder = document.createElement("div");
  librarianPlaceholder.className = "assessment-librarian-placeholder";
  librarianPlaceholder.textContent = "AI 사서";

  const librarianNote = document.createElement("p");
  librarianNote.textContent = "캐릭터 이미지 준비 중";
  librarianFrame.appendChild(librarianPlaceholder);
  librarian.append(librarianFrame, librarianNote);

  const guide = document.createElement("div");
  guide.className = "assessment-guide";

  const header = document.createElement("header");
  header.className = "assessment-header";

  const title = document.createElement("h3");
  title.textContent = `${getStudentLabel()}의 독서 모험 결과`;

  const total = document.createElement("p");
  total.className = "assessment-total";
  total.textContent = `${assessment.totalScore}/${assessment.maxScore}점`;

  header.append(title, total);

  const speech = document.createElement("section");
  speech.className = "assessment-speech";
  speech.setAttribute("aria-live", "polite");

  const speechLabel = document.createElement("strong");
  speechLabel.className = "assessment-speech-label";

  const speechText = document.createElement("p");
  speechText.className = "assessment-speech-text";

  const speechScore = document.createElement("div");
  speechScore.className = "assessment-speech-score";

  const speechScoreText = document.createElement("span");
  const speechTrack = document.createElement("span");
  speechTrack.className = "score-track";

  const speechBar = document.createElement("span");
  speechBar.className = "score-bar";

  speechTrack.appendChild(speechBar);
  speechScore.append(speechScoreText, speechTrack);
  speech.append(speechLabel, speechText, speechScore);

  const controls = document.createElement("div");
  controls.className = "assessment-controls";

  const prevButton = document.createElement("button");
  prevButton.type = "button";
  prevButton.textContent = "이전";

  const pageCounter = document.createElement("span");
  pageCounter.className = "assessment-page-counter";

  const nextButton = document.createElement("button");
  nextButton.type = "button";
  nextButton.textContent = "다음";

  controls.append(prevButton, pageCounter, nextButton);

  const board = document.createElement("div");
  board.className = "assessment-board";

  const boardTitle = document.createElement("p");
  boardTitle.className = "assessment-board-title";
  boardTitle.textContent = "항목별 그래프";

  const scoreList = document.createElement("div");
  scoreList.className = "assessment-score-list";

  const scoreRows = assessment.scores.map((item) => {
    const row = document.createElement("div");
    row.className = "assessment-score";

    const label = document.createElement("strong");
    label.textContent = `${item.label} ${item.score}/5`;

    const track = document.createElement("span");
    track.className = "score-track";

    const bar = document.createElement("span");
    bar.className = "score-bar";
    bar.style.width = `${Math.max(0, Math.min(100, (item.score / 5) * 100))}%`;

    const comment = document.createElement("small");
    comment.textContent = item.comment;

    track.appendChild(bar);
    row.append(label, track, comment);
    scoreList.appendChild(row);

    return row;
  });

  const nextStep = document.createElement("p");
  nextStep.className = "assessment-next";
  nextStep.textContent = `다음 목표: ${assessment.nextStep}`;

  board.append(boardTitle, scoreList);
  guide.append(header, speech, controls, board, nextStep);
  card.append(librarian, guide);
  resultPanel.appendChild(card);

  const pages = [
    {
      label: "전체 결과",
      text: assessment.summary,
      score: assessment.totalScore,
      maxScore: assessment.maxScore,
      scoreText: `총점 ${assessment.totalScore}/${assessment.maxScore}점`,
      scoreIndex: -1
    },
    ...assessment.scores.map((item, index) => ({
      label: item.label,
      text: item.comment,
      score: item.score,
      maxScore: 5,
      scoreText: `${item.score}/5점`,
      scoreIndex: index
    })),
    {
      label: "다음 목표",
      text: assessment.nextStep,
      score: 0,
      maxScore: 1,
      scoreText: "다음 모험 준비",
      scoreIndex: -1
    }
  ];

  let currentPage = 0;

  function updateAssessmentPage(nextIndex) {
    currentPage = Math.max(0, Math.min(pages.length - 1, nextIndex));
    const page = pages[currentPage];
    const percent = page.maxScore > 1
      ? Math.max(0, Math.min(100, (page.score / page.maxScore) * 100))
      : 100;

    speechLabel.textContent = page.label;
    speechText.textContent = page.text;
    speechScoreText.textContent = page.scoreText;
    speechBar.style.width = `${percent}%`;
    pageCounter.textContent = `${currentPage + 1} / ${pages.length}`;
    prevButton.disabled = currentPage === 0;
    nextButton.disabled = currentPage === pages.length - 1;

    scoreRows.forEach((row, index) => {
      row.classList.toggle("is-active", index === page.scoreIndex);
    });
  }

  prevButton.addEventListener("click", () => updateAssessmentPage(currentPage - 1));
  nextButton.addEventListener("click", () => updateAssessmentPage(currentPage + 1));
  updateAssessmentPage(0);
  goToResult();

  setDialogue("좋아, 오늘의 독서 모험 결과를 정리했어. 점수보다 중요한 건 어떤 단서를 어떻게 이어 봤는지야.", "AI 독서 파트너");
}

async function runConversationAssessment(answer) {
  chatTitle.textContent = "결과 정리 중";
  setDialogue("이제 오늘의 질문과 답변을 살펴보고 결과를 정리해 볼게.", "AI 독서 파트너");

  const payload = {
    student: getStudentSnapshot(),
    book: {
      id: selectedBook.id,
      title: selectedBook.title,
      author: selectedBook.author,
      description: selectedBook.description
    },
    answer,
    progress: getProgressSnapshot(),
    conversation: getConversationSnapshot(20)
  };

  const assessment = normalizeAssessmentResult(await requestConversationAssessment(payload));
  renderAssessmentResult(assessment);
}

function renderAnswerGuess() {
  if (adventureProgress.solved) {
    hideChoiceOverlay();
    toggleNextQuestionButton(false);
    setDialogue("이미 정답을 맞췄어요. 이제 모은 단서를 바탕으로 작품을 정리해 볼 수 있어요.", "AI 독서 파트너");
    return;
  }

  activeCategory = null;
  activeCharacter = null;
  customInputMode = "answer";
  chatTitle.textContent = "정답 맞추기";
  clearQuestionPanel();
  toggleCustomQuestion(true);
  setCustomQuestionButtonText("제출");
  updateReadingStatus();
  showChoiceOverlay();

  const note = document.createElement("p");
  note.className = "answer-guess-note";
  note.textContent = "지금까지 찾은 단서를 바탕으로 최종 정답과 그렇게 생각한 이유를 한 문장으로 함께 써 보세요.";
  questionPanel.appendChild(note);

  customQuestionInput.placeholder = "예: 동이는 허 생원의 아들인 것 같아요. 왜냐하면 ...";
  customQuestionInput.focus();
  setDialogue("좋아, 이제 정답을 맞춰볼 차례야. 단서들을 떠올리면서 조심스럽게 적어봐.", "AI 독서 파트너");
}

async function submitReadingQuestion(question) {
  if (!activeCategory || !question.trim()) return;

  if (activeCategory.id === "mind" && !activeCharacter) {
    renderCharacterChoices(activeCategory.id);
    return;
  }

  if (activeCategory.id === "place" && !activePlace) {
    renderPlaceChoices(activeCategory.id);
    return;
  }

  const cleanQuestion = question.trim();
  const selectedCharacter = activeCategory.id === "mind" ? activeCharacter : null;
  const selectedPlace = activeCategory.id === "place" ? activePlace : null;
  const questionText = selectedCharacter
    ? cleanQuestion.includes(selectedCharacter.name)
      ? cleanQuestion
      : `${selectedCharacter.name}의 마음: ${cleanQuestion}`
    : selectedPlace
      ? `${selectedPlace.name} 돌아보기: ${cleanQuestion}`
      : cleanQuestion;

  const payload = {
    student: getStudentSnapshot(),
    book: {
      id: selectedBook.id,
      title: selectedBook.title,
      author: selectedBook.author,
      description: selectedBook.description
    },
    category: {
      id: activeCategory.id,
      title: activeCategory.title
    },
    character: selectedCharacter ? {
      id: selectedCharacter.id,
      name: selectedCharacter.name,
      role: selectedCharacter.role,
      image: selectedCharacter.profileImage,
      profileImage: selectedCharacter.profileImage,
      sceneImage: selectedCharacter.sceneImage
    } : null,
    place: selectedPlace ? {
      name: selectedPlace.name,
      summary: selectedPlace.summary,
      clue: selectedPlace.clue
    } : null,
    rawQuestion: cleanQuestion,
    question: questionText,
    progress: getProgressSnapshot(),
    conversation: getConversationSnapshot()
  };

  appendChatMessage(payload.question, "user");
  clearQuestionPanel();
  toggleCustomQuestion(false);
  hideChoiceOverlay();
  toggleNextQuestionButton(false);
  chatTitle.textContent = "답변을 기다리는 중";
  adventureProgress.chancesLeft = Math.max(0, adventureProgress.chancesLeft - 1);
  payload.progress = getProgressSnapshot();
  payload.conversation = getConversationSnapshot();
  updateReadingStatus();
  setDialogue("좋아, 작품 속 장면과 인물의 단서를 잠깐 정리해 볼게.", "AI 독서 파트너");

  try {
    const answer = await requestAgentAnswer(payload);
    const answerText = String(answer || "").trim();
    if (!answerText) throw new Error(AI_UNAVAILABLE_MESSAGE);
    adventureProgress.cluesFound += 1;
    updateReadingStatus();
    appendChatMessage(answerText, "agent");
    toggleNextQuestionButton(true);
  } catch (error) {
    appendChatMessage(AI_UNAVAILABLE_MESSAGE, "agent");
    toggleNextQuestionButton(true);
  }
}

async function submitFinalAnswer(answer) {
  if (!answer.trim() || adventureProgress.solved) return;

  const cleanAnswer = answer.trim();
  const payload = {
    student: getStudentSnapshot(),
    book: {
      id: selectedBook.id,
      title: selectedBook.title,
      author: selectedBook.author,
      description: selectedBook.description
    },
    answer: cleanAnswer,
    cluesFound: adventureProgress.cluesFound,
    majorCharacters: getMajorCharacters(selectedBook),
    progress: getProgressSnapshot(),
    conversation: getConversationSnapshot()
  };

  appendChatMessage(`정답 시도: ${cleanAnswer}`, "user");
  clearQuestionPanel();
  toggleCustomQuestion(false);
  hideChoiceOverlay();
  toggleNextQuestionButton(false);
  chatTitle.textContent = "정답 확인 중";
  adventureProgress.chancesLeft = Math.max(0, adventureProgress.chancesLeft - 1);
  payload.progress = getProgressSnapshot();
  payload.conversation = getConversationSnapshot();
  updateReadingStatus();
  setDialogue("정답인지 확인해 볼게. 단서와 잘 맞는지 살펴보는 중이야.", "AI 독서 파트너");

  try {
    const result = normalizeAnswerCheckResult(await requestAnswerCheck(payload));
    adventureProgress.solved = result.correct;
    updateReadingStatus();
    appendChatMessage(result.message, "agent");

    if (!result.correct) {
      toggleNextQuestionButton(true);
    } else {
      toggleNextQuestionButton(false);
      await runConversationAssessment(cleanAnswer);
    }
  } catch (error) {
    if (adventureProgress.solved) {
      adventureProgress.solved = false;
      updateReadingStatus();
    }
    appendChatMessage(AI_UNAVAILABLE_MESSAGE, "agent");
    toggleNextQuestionButton(true);
  }
}

function buildShelf() {
  shelfRow.innerHTML = "";

  books.forEach((book, index) => {
    const spine = document.createElement("button");
    spine.className = "book-spine";
    spine.type = "button";
    spine.dataset.bookId = book.id;
    spine.style.setProperty("--book-a", book.coverA);
    spine.style.setProperty("--book-b", book.coverB);
    spine.style.setProperty("--spine-width", `${book.spineWidth}px`);
    spine.style.setProperty("--spine-height", `${book.spineHeight}px`);
    spine.setAttribute("aria-label", `${book.title}, ${book.author}`);

    const title = document.createElement("span");
    title.className = "spine-title";
    title.textContent = book.title;

    const author = document.createElement("span");
    author.className = "spine-author";
    author.textContent = book.author;

    spine.append(title, author);

    shelfRow.appendChild(spine);

    if (index === 0) {
      spine.classList.add("is-selected");
    }
  });
}

function selectBook(bookId) {
  const nextBook = books.find((book) => book.id === bookId);
  if (!nextBook) return;

  selectedBook = nextBook;
  selectedTitle.textContent = nextBook.title;
  selectedAuthor.textContent = nextBook.author;
  selectedDescription.textContent = nextBook.description;
  scenarioBookTitle.textContent = nextBook.title;
  updateReadingStatus();
  if (activeAdventureBookId === nextBook.id) {
    syncAdventureBook();
  }
  coverTitle.textContent = nextBook.title;
  coverAuthor.textContent = nextBook.author;
  selectedCover.style.setProperty("--book-a", nextBook.coverA);
  selectedCover.style.setProperty("--book-b", nextBook.coverB);
  selectedCover.style.background = `linear-gradient(135deg, ${nextBook.coverA}, ${nextBook.coverB})`;

  if (nextBook.cover) {
    const image = new Image();
    image.onload = () => {
      if (selectedBook.id !== nextBook.id) return;
      selectedCover.style.background = `linear-gradient(rgba(20, 10, 6, 0.12), rgba(20, 10, 6, 0.38)), url("${nextBook.cover}") center / cover no-repeat, linear-gradient(135deg, ${nextBook.coverA}, ${nextBook.coverB})`;
    };
    image.onerror = () => {
      if (selectedBook.id !== nextBook.id) return;
      selectedCover.style.background = `linear-gradient(135deg, ${nextBook.coverA}, ${nextBook.coverB})`;
    };
    image.src = nextBook.cover;
  }

  selectedCover.setAttribute("aria-label", `${nextBook.title} cover`);

  document.querySelectorAll(".book-spine").forEach((spine) => {
    spine.classList.toggle("is-selected", spine.dataset.bookId === bookId);
  });
}

function normalizeBook(book) {
  if (!book || typeof book !== "object") return null;
  const id = String(book.id || "").trim();
  const title = String(book.title || "").trim();
  const author = String(book.author || "").trim();
  if (!id || !title || !author) return null;

  return {
    id,
    title,
    author,
    description: String(book.description || "책 설명이 아직 준비되지 않았습니다."),
    cover: String(book.cover || BOOK_DISPLAY_DEFAULTS.cover),
    coverA: String(book.coverA || BOOK_DISPLAY_DEFAULTS.coverA),
    coverB: String(book.coverB || BOOK_DISPLAY_DEFAULTS.coverB),
    spineWidth: Number(book.spineWidth || BOOK_DISPLAY_DEFAULTS.spineWidth),
    spineHeight: Number(book.spineHeight || BOOK_DISPLAY_DEFAULTS.spineHeight)
  };
}

async function loadBooks() {
  startButton.disabled = true;
  retryBooksButton.classList.add("is-hidden");
  bookLoadStatus.classList.remove("is-error");
  bookLoadStatus.querySelector("span").textContent = "책 목록을 불러오는 중입니다.";

  try {
    const response = await fetch("./books.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`books.json HTTP ${response.status}`);
    }

    const loadedBooks = await response.json();
    if (!Array.isArray(loadedBooks) || loadedBooks.length === 0) {
      throw new Error("books.json is empty");
    }

    books = loadedBooks.map(normalizeBook).filter(Boolean);
    if (!books.length) throw new Error("books.json has no valid book records");
  } catch (error) {
    books = [];
    selectedBook = null;
    shelfRow.innerHTML = "";
    bookLoadStatus.classList.add("is-error");
    bookLoadStatus.querySelector("span").textContent = "책 목록을 불러오지 못했어요. 로컬에서는 웹 서버로 실행했는지 확인하고 다시 시도해 주세요.";
    retryBooksButton.classList.remove("is-hidden");
    return false;
  }

  selectedBook = books[0];
  buildShelf();
  selectBook(selectedBook.id);
  startButton.disabled = false;
  bookLoadStatus.querySelector("span").textContent = `${books.length}권의 책을 불러왔습니다.`;
  return true;
}

function handleHeroPointerDown(event) {
  heroDragStartY = event.clientY;
}

function handleHeroPointerUp(event) {
  if (heroDragStartY === null) return;

  const distance = event.clientY - heroDragStartY;
  heroDragStartY = null;

  if (distance < -40 || Math.abs(distance) > 80) {
    goToStudentProfile();
  }
}

async function saveStudentProfileAndGoToBooks() {
  const profile = readStudentProfileForm();

  if (!profile.className || !profile.number || !profile.nickname) {
    showProfileError("반, 번호, 닉네임을 모두 입력해 주세요.");
    return false;
  }

  if (typeof window.startBookAdventureParticipation === "function") {
    window.startBookAdventureParticipation();
  }
  persistStudentProfile(profile);
  showProfileError("");
  updateReadingStatus();
  await recordStudentSessionStart();
  goToBooks();
  return true;
}

async function handleStudentProfileSubmit(event) {
  event.preventDefault();
  await saveStudentProfileAndGoToBooks();
}

function handleShelfPointerDown(event) {
  const spine = event.target.closest(".book-spine");
  pendingSpineId = spine ? spine.dataset.bookId : null;
  shelfPointerDown = true;
  didShelfDrag = false;
  shelfDragStartX = event.clientX;
  shelfScrollStart = shelfWindow.scrollLeft;
  shelfWindow.classList.add("is-dragging");
  shelfWindow.setPointerCapture(event.pointerId);
}

function handleShelfPointerMove(event) {
  if (!shelfPointerDown) return;

  const distance = event.clientX - shelfDragStartX;
  if (Math.abs(distance) > 6) {
    didShelfDrag = true;
  }

  shelfWindow.scrollLeft = shelfScrollStart - distance;
}

function handleShelfPointerUp(event) {
  const shouldSelect = !didShelfDrag && pendingSpineId;
  const bookId = pendingSpineId;

  shelfPointerDown = false;
  pendingSpineId = null;
  shelfWindow.classList.remove("is-dragging");

  if (shelfWindow.hasPointerCapture(event.pointerId)) {
    shelfWindow.releasePointerCapture(event.pointerId);
  }

  if (shouldSelect) {
    selectBook(bookId);
  }

  window.setTimeout(() => {
    didShelfDrag = false;
  }, 0);
}

screenPrevButton.addEventListener("click", moveToPreviousScreen);
screenNextButton.addEventListener("click", moveToNextScreen);
enterControl.addEventListener("click", goToStudentProfile);
studentProfileForm.addEventListener("submit", handleStudentProfileSubmit);
shelfWindow.addEventListener("pointerdown", handleShelfPointerDown);
shelfWindow.addEventListener("pointermove", handleShelfPointerMove);
shelfWindow.addEventListener("pointerup", handleShelfPointerUp);
shelfWindow.addEventListener("pointercancel", handleShelfPointerUp);
shelfRow.addEventListener("click", (event) => {
  const spine = event.target.closest(".book-spine");
  if (spine) selectBook(spine.dataset.bookId);
});
questionPanel.addEventListener("click", (event) => {
  const categoryButton = event.target.closest(".choice-button");
  if (categoryButton) {
    renderDetailQuestions(categoryButton.dataset.categoryId);
    return;
  }

  const profileButton = event.target.closest(".profile-button");
  if (profileButton) {
    const profiles = getCharacterProfiles(selectedBook);
    activeCharacter = profiles[Number(profileButton.dataset.characterIndex)] || null;
    if (activeCharacter) {
      setSceneCharacter(activeCharacter);
      renderDetailQuestions("mind");
    }
    return;
  }

  const placeButton = event.target.closest(".place-button");
  if (placeButton) {
    const places = getBookLocations(selectedBook);
    activePlace = places[Number(placeButton.dataset.placeIndex)] || null;
    if (activePlace) {
      setScenePlace(activePlace);
      renderDetailQuestions("place");
    }
    return;
  }

  const detailButton = event.target.closest(".detail-button");
  if (detailButton) {
    submitReadingQuestion(detailButton.dataset.questionText);
  }
});
customQuestionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (customInputMode === "answer") {
    submitFinalAnswer(customQuestionInput.value);
    return;
  }

  submitReadingQuestion(customQuestionInput.value);
});
backToBooks.addEventListener("click", returnToBookShelf);
resultBackToBooks.addEventListener("click", returnToBookShelf);
answerGuessButton.addEventListener("click", renderAnswerGuess);
nextQuestionButton.addEventListener("click", () => renderCategoryChoices({ updateDialogue: false }));
startButton.addEventListener("click", goToActivityMenu);
retryBooksButton.addEventListener("click", loadBooks);
startScenarioButton.addEventListener("click", goToScenario);
startAdventureActivityButton.addEventListener("click", openAdventureScreen);
startCharacterChatButton.addEventListener("click", goToCharacterChat);
openTeacherGateButton.addEventListener("click", goToTeacherGate);
characterChatBackButton.addEventListener("click", goToActivityMenu);
characterChatProfileGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-character-chat-index]");
  if (!button) return;
  selectCharacterChatCharacter(Number(button.dataset.characterChatIndex));
});
characterChatForm.addEventListener("submit", (event) => {
  event.preventDefault();
  submitCharacterChatMessage(characterChatInput.value);
});
teacherGateBackButton.addEventListener("click", goToStudentProfile);
teacherDashboardBackButton.addEventListener("click", goToStudentProfile);
teacherGateForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const code = teacherGateCodeInput.value.trim();
  if (!code) {
    setTeacherGateStatus("교사용 코드를 입력해 주세요.", true);
    teacherGateCodeInput.focus();
    return;
  }

  loadTeacherResultsFromCode(code, { animateDoor: true });
});
teacherRefreshButton.addEventListener("click", () => {
  if (!teacherState.accessCode) {
    goToTeacherGate();
    return;
  }

  loadTeacherResultsFromCode(teacherState.accessCode);
});
teacherStudentSearchInput.addEventListener("input", () => {
  renderTeacherStudentList();
  renderTeacherStudentDetail();
});
teacherStudentList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-student-key]");
  if (!button) return;
  teacherState.selectedStudentKey = button.dataset.studentKey;
  const student = teacherState.students.find((item) => item.studentKey === teacherState.selectedStudentKey);
  teacherState.selectedActivityTab = student ? getPreferredTeacherActivityTab(student) : "";
  renderTeacherStudentList();
  renderTeacherStudentDetail();
});
teacherStudentViewTab.addEventListener("click", () => setTeacherView("students"));
teacherPromptViewTab.addEventListener("click", () => setTeacherView("prompts"));
teacherPromptDateFilter.addEventListener("change", () => {
  teacherState.promptDate = teacherPromptDateFilter.value;
  renderTeacherPromptView();
});
teacherPromptClearDateButton.addEventListener("click", () => {
  teacherState.promptDate = "";
  teacherPromptDateFilter.value = "";
  renderTeacherPromptView();
});
teacherPromptSelectAllButton.addEventListener("click", () => {
  getVisibleTeacherPromptItems().forEach((item) => teacherState.selectedPromptIds.add(item.id));
  renderTeacherPromptView();
});
teacherPromptClearSelectionButton.addEventListener("click", () => {
  teacherState.selectedPromptIds.clear();
  renderTeacherPromptView();
});
teacherPromptCopyButton.addEventListener("click", copySelectedTeacherPrompts);
teacherPromptExportButton.addEventListener("click", exportSelectedTeacherPrompts);
teacherPromptList.addEventListener("change", (event) => {
  const checkbox = event.target.closest("[data-prompt-id]");
  if (!checkbox) return;
  if (checkbox.checked) teacherState.selectedPromptIds.add(checkbox.dataset.promptId);
  else teacherState.selectedPromptIds.delete(checkbox.dataset.promptId);
  renderTeacherPromptView();
});
scenarioStepForm.addEventListener("submit", handleTitleScenarioFormSubmit);
scenarioChoicePanel.addEventListener("click", handleTitleScenarioChoiceClick);
window.addEventListener("resize", requestViewportSync);
window.addEventListener("orientationchange", requestViewportSync);
window.visualViewport?.addEventListener("resize", requestViewportSync);
window.visualViewport?.addEventListener("scroll", requestViewportSync);

syncViewportMetrics();
hydrateStudentProfileForm();
renderTeacherDashboard();
setActiveScreen(activeScreenId);
loadBooks();
