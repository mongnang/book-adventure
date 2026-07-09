const fallbackBooks = [
  {
    "id": "memil",
    "title": "메밀꽃 필 무렵",
    "author": "이효석",
    "description": "달빛 아래 길 위에서 이어지는 만남과 기억을 따라가는 한국 단편소설입니다.",
    "cover": "./assets/covers/memil.png",
    "coverA": "#7b3225",
    "coverB": "#24100c",
    "spineWidth": 76,
    "spineHeight": 370
  },
  {
    "id": "sonagi",
    "title": "소나기",
    "author": "황순원",
    "description": "짧은 만남과 맑은 감정을 통해 성장과 기억을 생각하게 하는 이야기입니다.",
    "cover": "./assets/covers/sonagi.jpg",
    "coverA": "#31546b",
    "coverB": "#10212d",
    "spineWidth": 70,
    "spineHeight": 340
  },
  {
    "id": "unlucky-day",
    "title": "운수 좋은 날",
    "author": "현진건",
    "description": "하루의 아이러니를 통해 삶의 무게와 시대의 현실을 보여 주는 작품입니다.",
    "cover": "./assets/covers/unlucky-day.jpg",
    "coverA": "#6d3d1e",
    "coverB": "#211207",
    "spineWidth": 72,
    "spineHeight": 355
  },
  {
    "id": "wings",
    "title": "날개",
    "author": "이상",
    "description": "인물의 내면과 낯선 감각을 따라가며 관점 읽기를 연습하기 좋은 작품입니다.",
    "cover": "./assets/covers/wings.jpg",
    "coverA": "#5c5b63",
    "coverB": "#17171b",
    "spineWidth": 64,
    "spineHeight": 326
  },
  {
    "id": "spring",
    "title": "봄봄",
    "author": "김유정",
    "description": "인물 사이의 말과 행동을 살피며 해학과 갈등을 읽을 수 있는 작품입니다.",
    "cover": "./assets/covers/spring.jpg",
    "coverA": "#7a5124",
    "coverB": "#241709",
    "spineWidth": 68,
    "spineHeight": 345
  },
  {
    "id": "young-prince",
    "title": "어린 왕자",
    "author": "생텍쥐페리",
    "description": "질문과 만남을 통해 관계, 책임, 상상력을 생각하게 하는 이야기입니다.",
    "cover": "./assets/covers/young-prince.jpg",
    "coverA": "#253f73",
    "coverB": "#09152f",
    "spineWidth": 78,
    "spineHeight": 382
  },
  {
    "id": "honggildong",
    "title": "홍길동전",
    "author": "허균",
    "description": "부당한 세상에 맞서는 인물을 통해 정의와 사회를 생각해 볼 수 있습니다.",
    "cover": "./assets/covers/honggildong.jpg",
    "coverA": "#793b31",
    "coverB": "#1e0c09",
    "spineWidth": 74,
    "spineHeight": 362
  },
  {
    "id": "heungbu",
    "title": "흥부전",
    "author": "작자 미상",
    "description": "형제의 갈등과 선택을 통해 욕심, 나눔, 보상을 생각해 볼 수 있는 고전소설입니다.",
    "cover": "./assets/covers/heungbu.jpg",
    "coverA": "#5f3a20",
    "coverB": "#20110a",
    "spineWidth": 71,
    "spineHeight": 351
  },
  {
    "id": "simcheong",
    "title": "심청전",
    "author": "작자 미상",
    "description": "효와 희생, 선택의 의미를 인물의 마음으로 읽어 볼 수 있는 고전소설입니다.",
    "cover": "./assets/covers/simcheong.jpg",
    "coverA": "#1f5b5b",
    "coverB": "#0b2425",
    "spineWidth": 73,
    "spineHeight": 366
  },
  {
    "id": "chunhyang",
    "title": "춘향전",
    "author": "작자 미상",
    "description": "사랑, 약속, 권력에 맞서는 태도를 중심으로 읽을 수 있는 고전소설입니다.",
    "cover": "./assets/covers/chunhyang.jpg",
    "coverA": "#7b263f",
    "coverB": "#240915",
    "spineWidth": 77,
    "spineHeight": 374
  },
  {
    "id": "heosaeng",
    "title": "허생전",
    "author": "박지원",
    "description": "인물의 행동을 통해 사회 현실과 비판적 사고를 함께 살펴볼 수 있는 작품입니다.",
    "cover": "./assets/covers/heosaeng.jpg",
    "coverA": "#41492a",
    "coverB": "#121609",
    "spineWidth": 66,
    "spineHeight": 333
  },
  {
    "id": "sangnoksu",
    "title": "상록수",
    "author": "심훈",
    "description": "농촌 계몽과 청년들의 의지를 따라가며 시대와 삶의 목표를 생각하는 장편소설입니다.",
    "cover": "./assets/covers/sangnoksu.jpg",
    "coverA": "#2f5b31",
    "coverB": "#0c1c0e",
    "spineWidth": 80,
    "spineHeight": 392
  },
  {
    "id": "munjangganghwa",
    "title": "문장강화",
    "author": "이태준",
    "description": "표현과 문장을 살피는 참고용 책으로, 독서 후 글쓰기 활동과 연결하기 좋습니다.",
    "cover": "./assets/covers/munjangganghwa.jpg",
    "coverA": "#4b3d63",
    "coverB": "#181224",
    "spineWidth": 69,
    "spineHeight": 350
  },
  {
    "id": "nami-janggun",
    "title": "남이 장군",
    "author": "작자 미상",
    "description": "인물의 용기와 비극을 통해 역사 속 이야기의 긴장감을 느낄 수 있습니다.",
    "cover": "./assets/covers/nami-janggun.jpg",
    "coverA": "#6b2020",
    "coverB": "#190707",
    "spineWidth": 67,
    "spineHeight": 331
  },
  {
    "id": "mujong",
    "title": "무정",
    "author": "이광수",
    "description": "인물 관계와 시대 변화를 중심으로 근대소설의 특징을 살펴볼 수 있습니다.",
    "cover": "./assets/covers/mujong.jpg",
    "coverA": "#634329",
    "coverB": "#1c1209",
    "spineWidth": 82,
    "spineHeight": 398
  },
  {
    "id": "old-man-sea",
    "title": "노인과 바다",
    "author": "어니스트 헤밍웨이",
    "description": "한 인물의 도전과 버팀을 따라가며 용기와 존엄을 생각하게 하는 소설입니다.",
    "cover": "./assets/covers/old-man-sea.jpg",
    "coverA": "#1d4f78",
    "coverB": "#071827",
    "spineWidth": 75,
    "spineHeight": 360
  },
  {
    "id": "alice",
    "title": "이상한 나라의 앨리스",
    "author": "루이스 캐럴",
    "description": "낯선 세계와 말놀이를 따라가며 상상력과 질문하는 힘을 키울 수 있는 이야기입니다.",
    "cover": "./assets/covers/alice.jpg",
    "coverA": "#7b4b78",
    "coverB": "#241024",
    "spineWidth": 81,
    "spineHeight": 386
  },
  {
    "id": "wizard-oz",
    "title": "오즈의 마법사",
    "author": "라이먼 프랭크 바움",
    "description": "동료와 함께 떠나는 여정을 통해 용기, 지혜, 마음의 의미를 생각하게 합니다.",
    "cover": "./assets/covers/wizard-oz.jpg",
    "coverA": "#245f45",
    "coverB": "#091d13",
    "spineWidth": 79,
    "spineHeight": 381
  },
  {
    "id": "anne",
    "title": "빨간 머리 앤",
    "author": "루시 모드 몽고메리",
    "description": "상상력이 풍부한 인물의 성장과 관계 맺기를 따라가는 따뜻한 이야기입니다.",
    "cover": "./assets/covers/anne.jpg",
    "coverA": "#8a3527",
    "coverB": "#2c0e0a",
    "spineWidth": 78,
    "spineHeight": 376
  },
  {
    "id": "treasure-island",
    "title": "보물섬",
    "author": "로버트 루이스 스티븐슨",
    "description": "모험과 선택의 순간을 따라가며 인물의 판단과 변화를 읽을 수 있습니다.",
    "cover": "./assets/covers/treasure-island.jpg",
    "coverA": "#5f5221",
    "coverB": "#191608",
    "spineWidth": 83,
    "spineHeight": 402
  },
  {
    "id": "little-women",
    "title": "작은 아씨들",
    "author": "루이자 메이 올컷",
    "description": "가족과 자매들의 성장 이야기를 통해 꿈, 책임, 관계를 생각해 볼 수 있습니다.",
    "cover": "./assets/covers/little-women.jpg",
    "coverA": "#6f324f",
    "coverB": "#210d17",
    "spineWidth": 84,
    "spineHeight": 405
  },
  {
    "id": "pinocchio",
    "title": "피노키오",
    "author": "카를로 콜로디",
    "description": "거짓말과 성장, 선택의 결과를 인물의 모험 속에서 읽을 수 있는 이야기입니다.",
    "cover": "./assets/covers/pinocchio.jpg",
    "coverA": "#8a5a24",
    "coverB": "#2a1808",
    "spineWidth": 70,
    "spineHeight": 342
  },
  {
    "id": "momo",
    "title": "모모",
    "author": "미하엘 엔데",
    "description": "시간과 삶의 속도를 생각하며 인물의 귀 기울임과 용기를 따라가는 이야기입니다.",
    "cover": "./assets/covers/momo.jpg",
    "coverA": "#30515e",
    "coverB": "#0d1b20",
    "spineWidth": 68,
    "spineHeight": 337
  }
];
let books = [...fallbackBooks];

const STUDENT_PROFILE_KEY = "book-adventure-student-profile";
const CONVERSATION_LOG_KEY = "book-adventure-conversation-log";

const heroScreen = document.querySelector("#heroScreen");
const profileScreen = document.querySelector("#profileScreen");
const bookScreen = document.querySelector("#bookScreen");
const adventureScreen = document.querySelector("#adventureScreen");
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
const answerGuessButton = document.querySelector("#answerGuessButton");
const statusSummary = document.querySelector("#statusSummary");
const hudBookTitle = document.querySelector("#hudBookTitle");
const hudBookAuthor = document.querySelector("#hudBookAuthor");
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
let viewportRaf = null;
let adventureProgress = {
  chancesLeft: 10,
  cluesFound: 0,
  solved: false
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

function keepActiveScreenAligned() {
  const activeScreen = document.getElementById(activeScreenId);
  if (!activeScreen) return;

  const rect = activeScreen.getBoundingClientRect();
  const height = window.visualViewport?.height || window.innerHeight;
  const screenIsCurrent = rect.top < height * 0.55 && rect.bottom > height * 0.45;

  if (screenIsCurrent && Math.abs(rect.top) > 2) {
    activeScreen.scrollIntoView({ behavior: "auto", block: "start" });
  }
}

function requestViewportSync() {
  window.cancelAnimationFrame(viewportRaf);
  viewportRaf = window.requestAnimationFrame(() => {
    syncViewportMetrics();
    keepActiveScreenAligned();
  });
}

function goToStudentProfile() {
  activeScreenId = "profileScreen";
  profileScreen.scrollIntoView({ behavior: "smooth", block: "start" });
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

  activeScreenId = "bookScreen";
  bookScreen.scrollIntoView({ behavior: "smooth", block: "start" });
}

function goToAdventure() {
  activeScreenId = "adventureScreen";
  adventureScreen.scrollIntoView({ behavior: "smooth", block: "start" });
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
  const nextCharacter = character || getCharacterProfiles(selectedBook)[0];

  if (!nextCharacter?.sceneImage) {
    characterImage.removeAttribute("src");
    characterPortrait.classList.remove("has-image");
    return;
  }

  characterImage.onload = () => characterPortrait.classList.add("has-image");
  characterImage.onerror = () => characterPortrait.classList.remove("has-image");
  characterImage.src = nextCharacter.sceneImage;
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
    `학생: ${getStudentLabel()}`,
    `기회: ${adventureProgress.chancesLeft}/10`,
    `발견한 단서: ${adventureProgress.cluesFound}`,
    `주요 인물: ${characters}`
  ].forEach((line) => {
    const item = document.createElement("span");
    item.textContent = line;
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
  readingChat.classList.remove("is-hidden");
  dialogueBox.classList.add("is-question-mode");
  dialogueBox.classList.remove("is-answer-mode");
  toggleNextQuestionButton(false);
}

function hideChoiceOverlay() {
  readingChat.classList.add("is-hidden");
  dialogueBox.classList.remove("is-question-mode");
  dialogueBox.classList.add("is-answer-mode");
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

function buildDemoAnswer({ question, category, book, character, place }) {
  const guideByCategory = {
    mind: "인물의 마음은 말로 직접 드러나기도 하지만, 망설임이나 행동 속에 숨어 있기도 해요.",
    place: "장소는 배경처럼 보이지만, 인물의 기억과 마음, 숨은 단서를 보여주는 중요한 장면이에요."
  };

  const guide = guideByCategory[category.id] || "작품 속 근거를 하나씩 짚어 보면 답을 더 단단하게 만들 수 있어요.";

  return [
    "좋은 질문이에요. 이 단서는 그냥 넘기기 아까워요.",
    [character ? `인물: ${character.name}` : "", place ? `장소: ${place.name}` : ""].filter(Boolean).join(" / "),
    guide,
    "그 장면에서 인물이 본 것, 들은 말, 한 행동 중 무엇이 가장 눈에 띄나요?"
  ].filter(Boolean).join("\n");
}

async function requestAgentAnswer(payload) {
  if (typeof window.sendReadingQuestionToAgent === "function") {
    return window.sendReadingQuestionToAgent(payload);
  }

  await new Promise((resolve) => window.setTimeout(resolve, 450));
  return buildDemoAnswer(payload);
}

function buildDemoAnswerCheck({ answer, book }) {
  const rule = getFinalAnswerRule(book);
  const normalizedAnswer = normalizeAnswerText(answer);
  const correct = rule.keywords.every((keyword) => normalizedAnswer.includes(normalizeAnswerText(keyword)));

  if (correct) {
    return {
      correct: true,
      message: `정답이에요! 핵심은 “${rule.answer}”라고 볼 수 있어요. 질문으로 모은 단서를 잘 이어 붙였어요.`
    };
  }

  return {
    correct: false,
    message: "아직 정답이라고 보기는 어려워요. 질문을 더 골라서 인물의 마음과 장소 단서를 조금 더 모아 보세요."
  };
}

async function requestAnswerCheck(payload) {
  if (typeof window.checkReadingAnswerWithAgent === "function") {
    return window.checkReadingAnswerWithAgent(payload);
  }

  await new Promise((resolve) => window.setTimeout(resolve, 450));
  return buildDemoAnswerCheck(payload);
}

async function requestConversationAssessment(payload) {
  if (typeof window.assessAdventureConversation === "function") {
    return window.assessAdventureConversation(payload);
  }

  await new Promise((resolve) => window.setTimeout(resolve, 450));
  return {
    totalScore: 16,
    maxScore: 20,
    scores: [
      { label: "단서 찾기", score: 4, comment: "중요한 단서를 여러 번 확인했어요." },
      { label: "근거 연결", score: 4, comment: "질문과 답을 연결하려는 흐름이 좋아요." },
      { label: "질문 태도", score: 4, comment: "스스로 질문하며 모험을 이어 갔어요." },
      { label: "추리 결론", score: 4, comment: "마지막 추리가 핵심에 가까웠어요." }
    ],
    summary: "오늘 독서 모험을 잘 마쳤어요.",
    nextStep: "다음에는 답의 근거가 되는 장면을 한 문장으로 덧붙여 보세요."
  };
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
    message: String(result || "답을 확인하지 못했어요. 다시 시도해 주세요.")
  };
}

function normalizeAssessmentResult(result) {
  const scores = Array.isArray(result?.scores) ? result.scores : [];

  return {
    totalScore: Number(result?.totalScore || scores.reduce((sum, item) => sum + Number(item.score || 0), 0)),
    maxScore: Number(result?.maxScore || 20),
    scores: scores.map((item) => ({
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
  showChoiceOverlay();

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
  questionPanel.appendChild(card);

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
  note.textContent = "지금까지 찾은 단서를 바탕으로 최종 정답을 입력해 보세요.";
  questionPanel.appendChild(note);

  customQuestionInput.placeholder = "내가 찾은 정답 입력";
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
    adventureProgress.cluesFound += 1;
    updateReadingStatus();
    appendChatMessage(String(answer || "답변을 받지 못했어요. 다시 질문해 주세요."), "agent");
    toggleNextQuestionButton(true);
  } catch (error) {
    appendChatMessage("지금은 AI 답변 연결이 원활하지 않아요. 잠시 후 다시 시도해 주세요.", "agent");
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
    appendChatMessage("지금은 정답 확인 연결이 원활하지 않아요. 잠시 후 다시 시도해 주세요.", "agent");
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

function normalizeBook(book, index) {
  const fallback = fallbackBooks[index % fallbackBooks.length];

  return {
    id: book.id || `book-${index + 1}`,
    title: book.title || fallback.title,
    author: book.author || fallback.author,
    description: book.description || fallback.description,
    cover: book.cover || fallback.cover || "",
    coverA: book.coverA || fallback.coverA,
    coverB: book.coverB || fallback.coverB,
    spineWidth: Number(book.spineWidth || fallback.spineWidth),
    spineHeight: Number(book.spineHeight || fallback.spineHeight)
  };
}

async function loadBooks() {
  try {
    const response = await fetch("./books.json", { cache: "no-store" });
    if (!response.ok) {
      throw new Error("Cannot load books.json");
    }

    const loadedBooks = await response.json();
    if (!Array.isArray(loadedBooks) || loadedBooks.length === 0) {
      throw new Error("books.json is empty");
    }

    books = loadedBooks.map(normalizeBook);
  } catch (error) {
    books = [...fallbackBooks];
  }

  selectedBook = books[0];
  buildShelf();
  selectBook(selectedBook.id);
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

async function handleStudentProfileSubmit(event) {
  event.preventDefault();
  const profile = readStudentProfileForm();

  if (!profile.className || !profile.number || !profile.nickname) {
    showProfileError("반, 번호, 닉네임을 모두 입력해 주세요.");
    return;
  }

  persistStudentProfile(profile);
  showProfileError("");
  updateReadingStatus();
  await recordStudentSessionStart();
  goToBooks();
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

enterControl.addEventListener("click", goToStudentProfile);
heroScreen.addEventListener("wheel", (event) => {
  if (event.deltaY > 12) goToStudentProfile();
}, { passive: true });
heroScreen.addEventListener("pointerdown", handleHeroPointerDown);
heroScreen.addEventListener("pointerup", handleHeroPointerUp);
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
answerGuessButton.addEventListener("click", renderAnswerGuess);
nextQuestionButton.addEventListener("click", () => renderCategoryChoices({ updateDialogue: false }));
startButton.addEventListener("click", openAdventureScreen);
window.addEventListener("resize", requestViewportSync);
window.addEventListener("orientationchange", requestViewportSync);
window.visualViewport?.addEventListener("resize", requestViewportSync);
window.visualViewport?.addEventListener("scroll", requestViewportSync);

syncViewportMetrics();
hydrateStudentProfileForm();
loadBooks();
