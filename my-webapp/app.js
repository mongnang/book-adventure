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
const teacherStudentSelect = document.querySelector("#teacherStudentSelect");
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
  "memil": [
    "허 생원",
    "조 선달",
    "동이",
    "성 서방네 처녀"
  ],
  "unlucky-day": [
    "김 첨지",
    "아내",
    "치삼"
  ],
  "wings": [
    "나",
    "아내",
    "거리의 나"
  ],
  "spring": [
    "나",
    "점순",
    "장인"
  ],
  "honggildong": [
    "홍길동",
    "홍 판서",
    "춘섬"
  ],
  "heungbu": [
    "흥부",
    "놀부",
    "제비"
  ],
  "simcheong": [
    "심청",
    "심 봉사",
    "선인"
  ],
  "chunhyang": [
    "성춘향",
    "이몽룡",
    "변학도"
  ],
  "heosaeng": [
    "허생",
    "변씨",
    "이완"
  ],
  "sangnoksu": [
    "박동혁",
    "채영신",
    "마을 사람"
  ],
  "mujong": [
    "이형식",
    "박영채",
    "김선형"
  ],
  "alice": [
    "앨리스",
    "흰 토끼",
    "하트 여왕"
  ],
  "wizard-oz": [
    "도로시",
    "허수아비",
    "양철 나무꾼",
    "겁쟁이 사자"
  ],
  "anne": [
    "앤 셜리",
    "마릴라 커스버트",
    "매슈 커스버트"
  ],
  "treasure-island": [
    "짐 호킨스",
    "롱 존 실버",
    "리브지 의사"
  ],
  "little-women": [
    "조 마치",
    "메그 마치",
    "베스 마치",
    "에이미 마치"
  ],
  "pinocchio": [
    "피노키오",
    "제페토",
    "푸른 요정"
  ]
};

const characterRoleByBook = {
  "memil": [
    "장돌뱅이",
    "동행",
    "젊은 장돌뱅이",
    "회상 속 인물"
  ],
  "unlucky-day": [
    "인력거꾼",
    "병든 아내",
    "김 첨지의 친구"
  ],
  "wings": [
    "화자",
    "화자의 아내",
    "바깥을 걷는 화자의 또 다른 모습"
  ],
  "spring": [
    "데릴사위가 되려는 머슴",
    "장인의 딸",
    "점순의 아버지"
  ],
  "honggildong": [
    "주인공",
    "홍길동의 아버지",
    "홍길동의 어머니"
  ],
  "heungbu": [
    "마음씨 착한 동생",
    "욕심 많은 형",
    "은혜를 갚는 존재"
  ],
  "simcheong": [
    "심 봉사의 딸",
    "심청의 아버지",
    "인당수 제물을 구한 상인"
  ],
  "chunhyang": [
    "주인공",
    "춘향의 연인",
    "남원 부사"
  ],
  "heosaeng": [
    "가난한 선비",
    "부유한 상인",
    "조정의 무장"
  ],
  "sangnoksu": [
    "농촌 운동에 나선 청년",
    "농촌 교육에 헌신한 청년",
    "농촌 공동체의 목소리"
  ],
  "mujong": [
    "교사",
    "전통적 삶에서 새 길을 찾는 인물",
    "신교육을 받은 인물"
  ],
  "alice": [
    "주인공",
    "이상한 나라로 이끄는 인물",
    "독단적인 통치자"
  ],
  "wizard-oz": [
    "캔자스로 돌아가려는 소녀",
    "뇌를 원하는 동료",
    "심장을 원하는 동료",
    "용기를 원하는 동료"
  ],
  "anne": [
    "상상력이 풍부한 고아 소녀",
    "앤의 보호자",
    "앤의 보호자"
  ],
  "treasure-island": [
    "모험을 기록하는 소년",
    "요리사로 위장한 해적",
    "정직한 탐험대의 지도자"
  ],
  "little-women": [
    "글쓰기를 꿈꾸는 둘째",
    "가정을 꿈꾸는 첫째",
    "음악을 사랑하는 셋째",
    "그림을 꿈꾸는 막내"
  ],
  "pinocchio": [
    "나무 인형",
    "피노키오를 만든 아버지",
    "피노키오를 돕고 시험하는 존재"
  ]
};

const locationsByBook = {
  "memil": [
    {
      "name": "봉평 장터",
      "summary": "허 생원이 오래 떠돌아온 장터",
      "clue": "과거의 기억과 현재의 만남이 겹쳐지는 출발점",
      "image": "./assets/places/memil-place-01-market.webp"
    },
    {
      "name": "대화 장으로 가는 밤길",
      "summary": "허 생원, 조 선달, 동이가 함께 걷는 길",
      "clue": "인물들의 말과 침묵을 이어 볼 수 있는 길",
      "image": "./assets/places/memil-place-02-night-road.webp"
    },
    {
      "name": "메밀꽃밭",
      "summary": "달빛 아래 하얗게 펼쳐진 풍경",
      "clue": "허 생원의 오래된 기억이 선명해지는 장소",
      "image": "./assets/places/memil-place-03-buckwheat-field.webp"
    },
    {
      "name": "개울가",
      "summary": "동이가 허 생원을 도와주는 장면이 떠오르는 곳",
      "clue": "동이의 행동과 두 사람의 가까워지는 분위기를 볼 수 있는 곳",
      "image": "./assets/places/memil-place-04-stream.webp"
    }
  ],
  "honggildong": [
    {
      "name": "홍 판서의 집",
      "summary": "길동이 재능과 서러움을 함께 키운 곳",
      "clue": "아버지와 형을 마음대로 부르지 못한 신분 차별이 드러난다.",
      "image": "./assets/places/honggildong-place-01-family-house.webp"
    },
    {
      "name": "활빈당 산채",
      "summary": "길동이 무리의 우두머리가 되어 뜻을 펼치는 곳",
      "clue": "개인의 서러움이 어려운 백성을 돕는 행동으로 넓어진다.",
      "image": "./assets/places/honggildong-place-02-hwalbindang-mountain-base.webp"
    },
    {
      "name": "율도국",
      "summary": "길동이 새로운 질서를 세우는 나라",
      "clue": "기존 신분 질서 밖에서 자신의 능력과 뜻을 실현한다.",
      "image": "./assets/places/honggildong-place-03-yuldo-kingdom.webp"
    }
  ],
  "unlucky-day": [
    {
      "name": "비 오는 거리",
      "summary": "김 첨지가 인력거를 끌며 뜻밖의 큰돈을 번 곳",
      "clue": "좋은 운수와 불안한 예감이 동시에 커진다.",
      "image": "./assets/places/unlucky-day-place-01-rainy-street.webp"
    },
    {
      "name": "술집과 설렁탕집",
      "summary": "김 첨지가 치삼과 술을 마시고 설렁탕을 산 곳",
      "clue": "아내를 향한 마음이 허세와 술 사이로 드러난다.",
      "image": "./assets/places/unlucky-day-place-02-tavern.webp"
    },
    {
      "name": "김 첨지의 집",
      "summary": "아픈 아내가 아이와 누워 있던 집",
      "clue": "하루의 반어적 비극이 완성되는 마지막 장소다.",
      "image": "./assets/places/unlucky-day-place-03-family-home.webp"
    }
  ],
  "wings": [
    {
      "name": "삼십삼 번지의 방",
      "summary": "화자가 대부분의 시간을 보내는 폐쇄된 공간",
      "clue": "아내에게 의존하고 통제되는 생활이 드러난다.",
      "image": "./assets/places/wings-place-01-room-33.webp"
    },
    {
      "name": "경성 거리",
      "summary": "화자가 목적 없이 걷고 돈을 쓰는 거리",
      "clue": "방 밖에서 감각과 자의식이 되살아난다.",
      "image": "./assets/places/wings-place-02-gyeongseong-street.webp"
    },
    {
      "name": "미쓰코시 옥상",
      "summary": "화자가 날개를 외치는 마지막 공간",
      "clue": "억눌린 삶에서 벗어나 다시 살아가려는 욕망이 선명해진다.",
      "image": "./assets/places/wings-place-03-mitsukoshi-rooftop.webp"
    }
  ],
  "spring": [
    {
      "name": "밭과 논",
      "summary": "화자가 장인의 일을 하며 혼례를 기다리는 곳",
      "clue": "끝없는 노동과 미뤄지는 약속의 관계가 드러난다.",
      "image": "./assets/places/spring-place-01-farm-field.webp"
    },
    {
      "name": "장인의 집",
      "summary": "혼례 문제로 말다툼이 이어지는 생활 공간",
      "clue": "점순과 장인의 서로 다른 태도를 비교할 수 있다.",
      "image": "./assets/places/spring-place-02-family-yard.webp"
    },
    {
      "name": "몸싸움이 벌어진 마당",
      "summary": "화자와 장인이 충돌하는 곳",
      "clue": "웃음 속에 감춰진 착취와 권력관계가 폭발한다.",
      "image": "./assets/places/spring-place-03-fight-yard.webp"
    }
  ],
  "heungbu": [
    {
      "name": "흥부의 초가집",
      "summary": "가난한 흥부 가족이 사는 집",
      "clue": "가난 속에서도 나눔과 돌봄을 실천하는 성품이 보인다.",
      "image": "./assets/places/heungbu-place-01-heungbu-home.webp"
    },
    {
      "name": "제비집과 박 넝쿨",
      "summary": "제비를 돌보고 박씨를 심은 곳",
      "clue": "행동의 동기와 보상의 관계를 확인할 수 있다.",
      "image": "./assets/places/heungbu-place-02-swallow-nest.webp"
    },
    {
      "name": "놀부의 집",
      "summary": "놀부가 억지로 복을 얻으려 박을 타는 곳",
      "clue": "선행을 흉내 낸 욕심이 재앙으로 돌아온다.",
      "image": "./assets/places/heungbu-place-03-nolbu-home.webp"
    }
  ],
  "simcheong": [
    {
      "name": "심 봉사의 집",
      "summary": "심청이 아버지를 돌보며 사는 가난한 집",
      "clue": "효심과 생활의 어려움이 함께 나타난다.",
      "image": "./assets/places/simcheong-place-01-sim-family-home.webp"
    },
    {
      "name": "절과 공양미 약속",
      "summary": "심 봉사가 눈을 뜨려면 공양미가 필요하다는 말을 들은 곳",
      "clue": "심청의 희생을 촉발한 약속을 확인할 수 있다.",
      "image": "./assets/places/simcheong-place-02-temple.webp"
    },
    {
      "name": "인당수",
      "summary": "심청이 제물로 바다에 몸을 던진 곳",
      "clue": "효와 희생, 위험한 사회 관습이 겹치는 핵심 장소다.",
      "image": "./assets/places/simcheong-place-03-indangsu-sea.webp"
    }
  ],
  "chunhyang": [
    {
      "name": "광한루",
      "summary": "춘향과 몽룡이 만나 사랑을 약속한 곳",
      "clue": "두 사람이 지키려 한 관계의 출발점이다.",
      "image": "./assets/places/chunhyang-place-01-gwanghallu.webp"
    },
    {
      "name": "동헌과 옥",
      "summary": "변학도가 수청을 강요하고 춘향을 가둔 곳",
      "clue": "권력의 횡포와 춘향의 저항이 맞선다.",
      "image": "./assets/places/chunhyang-place-02-government-prison.webp"
    },
    {
      "name": "변학도의 생일잔치",
      "summary": "암행어사가 정체를 밝히고 탐관오리를 벌한 곳",
      "clue": "춘향의 선택이 끝내 인정받는 결말의 무대다.",
      "image": "./assets/places/chunhyang-place-03-birthday-feast.webp"
    }
  ],
  "heosaeng": [
    {
      "name": "남산 아래 허생의 집",
      "summary": "허생이 글만 읽으며 가난하게 살던 집",
      "clue": "아내의 질책이 허생을 세상 밖으로 움직이게 한다.",
      "image": "./assets/places/heosaeng-place-01-namsan-home.webp"
    },
    {
      "name": "안성 시장",
      "summary": "허생이 과일과 말총을 사들여 시장을 흔든 곳",
      "clue": "나라 경제의 취약함을 실험으로 드러낸다.",
      "image": "./assets/places/heosaeng-place-02-anseong-market.webp"
    },
    {
      "name": "빈 섬",
      "summary": "허생이 도둑들을 데려가 새 공동체를 만든 곳",
      "clue": "부를 쌓는 것보다 새로운 질서를 시험한 뜻이 보인다.",
      "image": "./assets/places/heosaeng-place-03-empty-island.webp"
    }
  ],
  "sangnoksu": [
    {
      "name": "한곡리",
      "summary": "동혁이 농촌 공동체 운동을 펼치는 마을",
      "clue": "개인의 열정이 주민의 협력으로 바뀌는 과정을 볼 수 있다.",
      "image": "./assets/places/sangnoksu-place-01-hangok-ri.webp"
    },
    {
      "name": "청석골 강습소",
      "summary": "영신이 아이들과 주민을 가르치는 배움터",
      "clue": "교육을 통해 마을의 미래를 바꾸려는 믿음이 모인다.",
      "image": "./assets/places/sangnoksu-place-02-cheongseokgol-school.webp"
    },
    {
      "name": "병원과 마지막 길",
      "summary": "과로로 쓰러진 영신의 신념이 시험받는 곳",
      "clue": "개인의 희생과 남겨진 공동체의 책임을 생각하게 한다.",
      "image": "./assets/places/sangnoksu-place-03-hospital.webp"
    }
  ],
  "mujong": [
    {
      "name": "경성의 학교와 거리",
      "summary": "형식과 선형의 수업과 만남이 이어지는 근대 도시",
      "clue": "신교육과 전통적 관계가 충돌하는 출발점이다.",
      "image": "./assets/places/mujong-place-01-gyeongseong.webp"
    },
    {
      "name": "기차",
      "summary": "인물들이 함께 이동하며 서로의 삶을 이해하는 공간",
      "clue": "각자의 진로가 공동의 목표로 향하기 시작한다.",
      "image": "./assets/places/mujong-place-02-train.webp"
    },
    {
      "name": "삼랑진 수해 현장",
      "summary": "홍수 피해 주민을 돕고 현실을 마주한 곳",
      "clue": "지식과 예술을 민중을 위해 쓰겠다는 결심이 생긴다.",
      "image": "./assets/places/mujong-place-03-flood-site.webp"
    }
  ],
  "alice": [
    {
      "name": "토끼굴과 문들의 방",
      "summary": "앨리스가 크기가 바뀌며 이상한 나라에 들어선 곳",
      "clue": "익숙한 논리가 흔들리고 질문이 시작된다.",
      "image": "./assets/places/alice-place-01-rabbit-hole.webp"
    },
    {
      "name": "엉터리 다과회",
      "summary": "모자 장수와 3월 토끼가 끝없는 차 시간을 보내는 곳",
      "clue": "말의 규칙이 뒤틀린 세계에 대응하는 법을 배운다.",
      "image": "./assets/places/alice-place-02-mad-tea-party.webp"
    },
    {
      "name": "하트 잭의 재판장",
      "summary": "증거와 절차가 뒤죽박죽인 재판이 열린 곳",
      "clue": "앨리스가 부당함을 직접 지적하며 두려움을 이긴다.",
      "image": "./assets/places/alice-place-03-courtroom.webp"
    }
  ],
  "wizard-oz": [
    {
      "name": "노란 벽돌길",
      "summary": "도로시와 세 친구가 함께 문제를 해결하며 걷는 길",
      "clue": "세 친구가 원하는 자질을 행동으로 이미 보여 준다.",
      "image": "./assets/places/wizard-oz-place-01-yellow-brick-road.webp"
    },
    {
      "name": "에메랄드 시",
      "summary": "일행이 위대한 오즈에게 소원을 부탁한 도시",
      "clue": "오즈의 정체와 선물의 의미가 드러난다.",
      "image": "./assets/places/wizard-oz-place-02-emerald-city.webp"
    },
    {
      "name": "서쪽 마녀의 성",
      "summary": "일행이 붙잡히고 서로를 구하는 곳",
      "clue": "지혜와 마음과 용기가 가장 분명하게 행동으로 나타난다.",
      "image": "./assets/places/wizard-oz-place-03-witch-castle.webp"
    }
  ],
  "anne": [
    {
      "name": "브라이트 리버 역",
      "summary": "매슈가 예상과 달리 여자아이 앤을 처음 만난 곳",
      "clue": "실수로 시작된 만남이 가족의 시작이 된다.",
      "image": "./assets/places/anne-place-01-bright-river-station.webp"
    },
    {
      "name": "그린 게이블스",
      "summary": "앤이 간절히 머물고 싶어 한 집",
      "clue": "규칙과 실수를 거치며 진짜 가족 관계가 쌓인다.",
      "image": "./assets/places/anne-place-02-green-gables.webp"
    },
    {
      "name": "빛나는 물의 호수와 에이번리",
      "summary": "앤이 상상력으로 새 이름과 의미를 부여한 마을",
      "clue": "앤의 시선이 주변 사람들의 일상까지 변화시킨다.",
      "image": "./assets/places/anne-place-03-avonlea-lake.webp"
    }
  ],
  "treasure-island": [
    {
      "name": "애드미럴 벤보 여관",
      "summary": "짐이 빌리 본즈와 보물 지도를 만나게 된 여관",
      "clue": "모험과 해적의 위협이 시작된다.",
      "image": "./assets/places/treasure-island-place-01-admiral-benbow.webp"
    },
    {
      "name": "히스파니올라호의 사과통",
      "summary": "짐이 숨어서 실버의 반란 계획을 들은 곳",
      "clue": "아군과 해적을 가르는 결정적 정보가 생긴다.",
      "image": "./assets/places/treasure-island-place-02-apple-barrel.webp"
    },
    {
      "name": "섬의 방책",
      "summary": "정직한 일행과 해적들이 맞서는 거점",
      "clue": "정보를 어떻게 행동으로 옮겼는지 확인할 수 있다.",
      "image": "./assets/places/treasure-island-place-03-island-stockade.webp"
    }
  ],
  "little-women": [
    {
      "name": "마치 가족의 집",
      "summary": "네 자매와 어머니가 서로 기대어 사는 집",
      "clue": "다툼 뒤의 화해와 일상의 책임이 가족을 단단하게 한다.",
      "image": "./assets/places/little-women-place-01-march-home.webp"
    },
    {
      "name": "로런스 저택",
      "summary": "로리와 베스의 피아노가 자매들의 세계를 넓힌 곳",
      "clue": "이웃과 우정이 어려움을 견디는 또 다른 힘이 된다.",
      "image": "./assets/places/little-women-place-02-laurence-house.webp"
    },
    {
      "name": "뉴욕과 각자의 길",
      "summary": "조를 비롯한 자매들이 집 밖에서 꿈과 현실을 시험한 곳",
      "clue": "가족의 지지를 바탕으로 서로 다른 삶을 선택한다.",
      "image": "./assets/places/little-women-place-03-new-york.webp"
    }
  ],
  "pinocchio": [
    {
      "name": "제페토의 작업실",
      "summary": "피노키오가 태어나고 가족 관계가 시작된 곳",
      "clue": "제페토의 사랑과 피노키오의 첫 책임이 나타난다.",
      "image": "./assets/places/pinocchio-place-01-geppetto-workshop.webp"
    },
    {
      "name": "인형극장과 장난감 나라",
      "summary": "피노키오가 쉬운 즐거움과 나쁜 꾐을 따라간 곳",
      "clue": "충동적인 선택이 자유를 빼앗는 결과로 이어진다.",
      "image": "./assets/places/pinocchio-place-02-temptation-land.webp"
    },
    {
      "name": "거대한 물고기 뱃속",
      "summary": "피노키오가 제페토와 다시 만나 탈출하는 곳",
      "clue": "자신보다 아버지를 먼저 생각하는 용기와 책임이 드러난다.",
      "image": "./assets/places/pinocchio-place-03-great-fish.webp"
    }
  ]
};

const profileImageByBook = {
  "memil": [
    "profiles/memil-character-01-profile.webp",
    "profiles/memil-character-02-profile.webp",
    "profiles/memil-character-03-profile.webp",
    "profiles/memil-character-04-profile.webp"
  ],
  "honggildong": [
    "profiles/honggildong-character-01-profile.webp",
    "profiles/honggildong-character-02-profile.webp",
    "profiles/honggildong-character-03-profile.webp"
  ],
  "unlucky-day": [
    "profiles/unlucky-day-character-01-profile.webp",
    "profiles/unlucky-day-character-02-profile.webp",
    "profiles/unlucky-day-character-03-profile.webp"
  ],
  "wings": [
    "profiles/wings-character-01-profile.webp",
    "profiles/wings-character-02-profile.webp",
    "profiles/wings-character-03-profile.webp"
  ],
  "spring": [
    "profiles/spring-character-01-profile.webp",
    "profiles/spring-character-02-profile.webp",
    "profiles/spring-character-03-profile.webp"
  ],
  "heungbu": [
    "profiles/heungbu-character-01-profile.webp",
    "profiles/heungbu-character-02-profile.webp",
    "profiles/heungbu-character-03-profile.webp"
  ],
  "simcheong": [
    "profiles/simcheong-character-01-profile.webp",
    "profiles/simcheong-character-02-profile.webp",
    "profiles/simcheong-character-03-profile.webp"
  ],
  "chunhyang": [
    "profiles/chunhyang-character-01-profile.webp",
    "profiles/chunhyang-character-02-profile.webp",
    "profiles/chunhyang-character-03-profile.webp"
  ],
  "heosaeng": [
    "profiles/heosaeng-character-01-profile.webp",
    "profiles/heosaeng-character-02-profile.webp",
    "profiles/heosaeng-character-03-profile.webp"
  ],
  "sangnoksu": [
    "profiles/sangnoksu-character-01-profile.webp",
    "profiles/sangnoksu-character-02-profile.webp",
    "profiles/sangnoksu-character-03-profile.webp"
  ],
  "mujong": [
    "profiles/mujong-character-01-profile.webp",
    "profiles/mujong-character-02-profile.webp",
    "profiles/mujong-character-03-profile.webp"
  ],
  "alice": [
    "profiles/alice-character-01-profile.webp",
    "profiles/alice-character-02-profile.webp",
    "profiles/alice-character-03-profile.webp"
  ],
  "wizard-oz": [
    "profiles/wizard-oz-character-01-profile.webp",
    "profiles/wizard-oz-character-02-profile.webp",
    "profiles/wizard-oz-character-03-profile.webp",
    "profiles/wizard-oz-character-04-profile.webp"
  ],
  "anne": [
    "profiles/anne-character-01-profile.webp",
    "profiles/anne-character-02-profile.webp",
    "profiles/anne-character-03-profile.webp"
  ],
  "treasure-island": [
    "profiles/treasure-island-character-01-profile.webp",
    "profiles/treasure-island-character-02-profile.webp",
    "profiles/treasure-island-character-03-profile.webp"
  ],
  "little-women": [
    "profiles/little-women-character-01-profile.webp",
    "profiles/little-women-character-02-profile.webp",
    "profiles/little-women-character-03-profile.webp",
    "profiles/little-women-character-04-profile.webp"
  ],
  "pinocchio": [
    "../covers/pinocchio-cover.webp",
    "profiles/pinocchio-character-02-profile.webp",
    "profiles/pinocchio-character-03-profile.webp"
  ]
};

const standingImageByBook = {
  "memil": [
    "memil-character-01-standing.webp",
    "memil-character-02-standing.webp",
    "memil-character-03-standing.webp",
    "memil-character-04-standing.webp"
  ],
  "honggildong": [
    "honggildong-character-01-standing.webp",
    "honggildong-character-02-standing.webp",
    "honggildong-character-03-standing.webp"
  ],
  "unlucky-day": [
    "unlucky-day-character-01-standing.webp",
    "unlucky-day-character-02-standing.webp",
    "unlucky-day-character-03-standing.webp"
  ],
  "wings": [
    "wings-character-01-standing.webp",
    "wings-character-02-standing.webp",
    "wings-character-03-standing.webp"
  ],
  "spring": [
    "spring-character-01-standing.webp",
    "spring-character-02-standing.webp",
    "spring-character-03-standing.webp"
  ],
  "heungbu": [
    "heungbu-character-01-standing.webp",
    "heungbu-character-02-standing.webp",
    "heungbu-character-03-standing.webp"
  ],
  "simcheong": [
    "simcheong-character-01-standing.webp",
    "simcheong-character-02-standing.webp",
    "simcheong-character-03-standing.webp"
  ],
  "chunhyang": [
    "chunhyang-character-01-standing.webp",
    "chunhyang-character-02-standing.webp",
    "chunhyang-character-03-standing.webp"
  ],
  "heosaeng": [
    "heosaeng-character-01-standing.webp",
    "heosaeng-character-02-standing.webp",
    "heosaeng-character-03-standing.webp"
  ],
  "sangnoksu": [
    "sangnoksu-character-01-standing.webp",
    "sangnoksu-character-02-standing.webp",
    "sangnoksu-character-03-standing.webp"
  ],
  "mujong": [
    "mujong-character-01-standing.webp",
    "mujong-character-02-standing.webp",
    "mujong-character-03-standing.webp"
  ],
  "alice": [
    "alice-character-01-standing.webp",
    "alice-character-02-standing.webp",
    "alice-character-03-standing.webp"
  ],
  "wizard-oz": [
    "wizard-oz-character-01-standing.webp",
    "wizard-oz-character-02-standing.webp",
    "wizard-oz-character-03-standing.webp",
    "wizard-oz-character-04-standing.webp"
  ],
  "anne": [
    "anne-character-01-standing.webp",
    "anne-character-02-standing.webp",
    "anne-character-03-standing.webp"
  ],
  "treasure-island": [
    "treasure-island-character-01-standing.webp",
    "treasure-island-character-02-standing.webp",
    "treasure-island-character-03-standing.webp"
  ],
  "little-women": [
    "little-women-character-01-standing.webp",
    "little-women-character-02-standing.webp",
    "little-women-character-03-standing.webp",
    "little-women-character-04-standing.webp"
  ],
  "pinocchio": [
    "../covers/pinocchio-cover.webp",
    "profiles/pinocchio-character-02-profile.webp",
    "profiles/pinocchio-character-03-profile.webp"
  ]
};

const characterChatRulesByBook = {
  "memil": {
    "허 생원": {
      "speechStyle": "무뚝뚝하지만 속정이 깊다. 말끝을 길게 늘이기보다 짧고 담담하게 말한다.",
      "perspective": "오래 장터를 떠돈 장돌뱅이로서 길, 장터, 밤길, 오래된 기억을 자주 떠올린다.",
      "boundaries": [
        "동이와의 관계를 처음부터 직접 단정하지 않는다.",
        "마음속 그리움은 드러내되 과하게 감상적으로 말하지 않는다.",
        "학생에게 원전의 결말을 바로 말하지 않고 장면을 떠올리게 한다."
      ],
      "starter": "흠, 나한테 묻고 싶은 게 있나. 길 위에서 본 것들은 생각보다 오래 남는 법이지."
    },
    "조 선달": {
      "speechStyle": "능청스럽고 현실적이다. 허 생원을 놀리듯 말하지만 분위기를 부드럽게 만든다.",
      "perspective": "동행자의 눈으로 허 생원과 동이를 관찰한다. 장터 사람들의 말투와 길 위의 분위기를 잘 안다.",
      "boundaries": [
        "모든 비밀을 아는 사람처럼 굴지 않는다.",
        "농담은 짧게 하고 학생의 질문을 흐리지 않는다.",
        "중요한 단서는 관찰한 행동 중심으로만 말한다."
      ],
      "starter": "허허, 나한테 묻겠다고? 길동무 눈에는 제법 보이는 게 많지."
    },
    "동이": {
      "speechStyle": "젊고 조심스럽지만 마음이 따뜻하다. 예의를 지키며 솔직하게 말한다.",
      "perspective": "자신의 행동, 어머니 이야기, 허 생원을 돕는 마음을 중심으로 말한다.",
      "boundaries": [
        "자신의 출생 비밀을 확정적으로 먼저 말하지 않는다.",
        "허 생원을 함부로 평가하지 않는다.",
        "학생이 묻는 장면 안에서 느낀 마음을 중심으로 답한다."
      ],
      "starter": "저에게 물어보실 게 있나요? 제가 본 것과 느낀 것이라면 조심히 말해 볼게요."
    },
    "성 서방네 처녀": {
      "speechStyle": "회상 속 인물처럼 차분하고 부드럽다. 직접적인 설명보다 기억의 분위기로 말한다.",
      "perspective": "허 생원의 오래된 기억, 달밤, 메밀꽃밭의 분위기와 연결된다.",
      "boundaries": [
        "현재 시점의 사건을 모두 알고 있는 것처럼 말하지 않는다.",
        "작품의 숨은 인연을 직접 결론으로 말하지 않는다.",
        "기억과 분위기를 통해 학생이 추리하도록 돕는다."
      ],
      "starter": "오래된 이야기는 달빛처럼 조용히 남아 있지요. 무엇이 궁금한가요?"
    }
  },
  "honggildong": {
    "홍길동": {
      "speechStyle": "뜻이 크고 당당하지만 어머니에게는 예를 갖춘다. 결심을 분명하게 말한다.",
      "perspective": "서자로서 겪은 차별, 집을 떠난 이유, 활빈당에서 백성을 도운 일을 자신이 겪은 범위에서 말한다.",
      "boundaries": [
        "처음부터 자신의 모든 도술과 결말을 늘어놓지 않는다.",
        "학생이 묻지 않은 뒤의 사건을 먼저 폭로하지 않는다."
      ],
      "starter": "나는 홍길동이오. 마음에 품은 뜻은 크지만, 그 뜻을 펼칠 길은 쉽게 열리지 않았소. 무엇이 궁금하오?"
    },
    "홍 판서": {
      "speechStyle": "체면과 가문의 질서를 중시하며 무겁고 조심스럽게 말한다.",
      "perspective": "길동의 재능을 알면서도 신분 질서와 집안의 위험을 걱정한 아버지의 입장에서 말한다.",
      "boundaries": [
        "길동이 받은 차별을 없었던 일처럼 말하지 않는다.",
        "길동의 이후 행적을 모두 아는 것처럼 말하지 않는다."
      ],
      "starter": "길동의 재주를 모르는 바는 아니나, 한 집안과 조정의 법도 또한 가벼운 일이 아니었느니라. 무엇을 묻고 싶으냐?"
    },
    "춘섬": {
      "speechStyle": "아들을 걱정하며 다정하고 조심스럽게 말한다.",
      "perspective": "길동의 성장과 서러움, 집을 떠나려는 결심을 곁에서 지켜본 어머니의 입장에서 말한다.",
      "boundaries": [
        "길동이 떠난 뒤의 모든 일을 자세히 아는 것처럼 말하지 않는다.",
        "위험한 장면을 자극적으로 묘사하지 않는다."
      ],
      "starter": "길동이는 어려서부터 남달랐지만 마음속 서러움도 컸단다. 그 아이에 관해 무엇이 궁금하니?"
    }
  },
  "unlucky-day": {
    "김 첨지": {
      "speechStyle": "거칠고 성급하지만 가족에 대한 불안과 애정을 숨긴다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "그날 번 돈과 아내를 두고 느낀 불길함",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 김 첨지. 그날 번 돈과 아내를 두고 느낀 불길함에 관해 무엇이 궁금한가요?"
    },
    "아내": {
      "speechStyle": "기력이 약한 짧은 말투로 남편과 아이를 걱정한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "남편에게 설렁탕을 부탁하고 기다린 시간",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 아내. 남편에게 설렁탕을 부탁하고 기다린 시간에 관해 무엇이 궁금한가요?"
    },
    "치삼": {
      "speechStyle": "친근하고 현실적인 말투로 김 첨지의 들뜸과 불안을 지켜본다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "술자리에서 본 김 첨지의 행동과 말",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 치삼. 술자리에서 본 김 첨지의 행동과 말에 관해 무엇이 궁금한가요?"
    }
  },
  "wings": {
    "나": {
      "speechStyle": "생각이 끊기고 이어지는 독백체로 자신의 감각과 혼란을 말한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "방 안의 무기력과 바깥세상을 향한 회복 욕망",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 나. 방 안의 무기력과 바깥세상을 향한 회복 욕망에 관해 무엇이 궁금한가요?"
    },
    "아내": {
      "speechStyle": "차갑고 단정한 말투로 생활을 통제하며 속내를 쉽게 드러내지 않는다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "화자와 방을 관리하고 돈과 약을 건넨 행동",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 아내. 화자와 방을 관리하고 돈과 약을 건넨 행동에 관해 무엇이 궁금한가요?"
    },
    "거리의 나": {
      "speechStyle": "낯선 도시를 관찰하며 조금씩 각성하는 목소리로 말한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "거리와 옥상에서 되찾은 움직임과 자아 감각",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 거리의 나. 거리와 옥상에서 되찾은 움직임과 자아 감각에 관해 무엇이 궁금한가요?"
    }
  },
  "spring": {
    "나": {
      "speechStyle": "순박하고 억울한 일을 솔직하고 익살스럽게 말한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "혼례 약속을 믿고 일한 시간과 장인에게 맞선 이유",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 나. 혼례 약속을 믿고 일한 시간과 장인에게 맞선 이유에 관해 무엇이 궁금한가요?"
    },
    "점순": {
      "speechStyle": "새침하면서도 적극적으로 화자를 부추기는 말투를 쓴다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "혼례가 미뤄지는 상황과 화자에게 요구한 행동",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 점순. 혼례가 미뤄지는 상황과 화자에게 요구한 행동에 관해 무엇이 궁금한가요?"
    },
    "장인": {
      "speechStyle": "능청스럽고 권위적인 말투로 약속을 미룬다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "점순의 키를 핑계 삼아 노동력을 붙잡아 둔 속셈",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 장인. 점순의 키를 핑계 삼아 노동력을 붙잡아 둔 속셈에 관해 무엇이 궁금한가요?"
    }
  },
  "heungbu": {
    "흥부": {
      "speechStyle": "어렵게 살아도 남을 먼저 생각하는 따뜻하고 소박한 말투를 쓴다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "제비를 도운 마음과 박을 탄 뒤 가족을 대하는 태도",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 흥부. 제비를 도운 마음과 박을 탄 뒤 가족을 대하는 태도에 관해 무엇이 궁금한가요?"
    },
    "놀부": {
      "speechStyle": "거칠고 탐욕스러운 말투로 손익을 먼저 따진다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "동생의 보상을 흉내 내며 제비를 일부러 해친 행동",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 놀부. 동생의 보상을 흉내 내며 제비를 일부러 해친 행동에 관해 무엇이 궁금한가요?"
    },
    "제비": {
      "speechStyle": "간결하고 상징적인 말로 도움과 그 결과를 전한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "두 형제가 자신에게 보인 서로 다른 행동",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 제비. 두 형제가 자신에게 보인 서로 다른 행동에 관해 무엇이 궁금한가요?"
    }
  },
  "simcheong": {
    "심청": {
      "speechStyle": "부드럽고 공손하지만 결심한 일에는 단호하게 말한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "아버지의 눈을 뜨게 하려 한 마음과 희생의 두려움",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 심청. 아버지의 눈을 뜨게 하려 한 마음과 희생의 두려움에 관해 무엇이 궁금한가요?"
    },
    "심 봉사": {
      "speechStyle": "딸을 사랑하면서도 경솔한 약속을 후회하는 절절한 말투를 쓴다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "공양미 약속과 딸을 잃고 겪은 슬픔",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 심 봉사. 공양미 약속과 딸을 잃고 겪은 슬픔에 관해 무엇이 궁금한가요?"
    },
    "선인": {
      "speechStyle": "거래와 항해의 사정을 현실적으로 설명한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "공양미를 주고 심청을 데려간 과정과 인당수의 풍습",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 선인. 공양미를 주고 심청을 데려간 과정과 인당수의 풍습에 관해 무엇이 궁금한가요?"
    }
  },
  "chunhyang": {
    "성춘향": {
      "speechStyle": "예의 바르지만 부당한 명령 앞에서는 곧고 단호하게 말한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "이몽룡과의 약속, 자신의 존엄, 수청을 거절한 이유",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 성춘향. 이몽룡과의 약속, 자신의 존엄, 수청을 거절한 이유에 관해 무엇이 궁금한가요?"
    },
    "이몽룡": {
      "speechStyle": "젊은 시절에는 다정하고, 암행어사가 된 뒤에는 침착하고 결연하게 말한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "춘향과의 약속과 변학도의 횡포를 바로잡으려 한 행동",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 이몽룡. 춘향과의 약속과 변학도의 횡포를 바로잡으려 한 행동에 관해 무엇이 궁금한가요?"
    },
    "변학도": {
      "speechStyle": "권위적이고 위협적인 말투로 자신의 명령을 강요한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "권력을 이용해 춘향에게 수청을 요구하고 벌한 판단",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 변학도. 권력을 이용해 춘향에게 수청을 요구하고 벌한 판단에 관해 무엇이 궁금한가요?"
    }
  },
  "heosaeng": {
    "허생": {
      "speechStyle": "짧고 날카롭게 묻고 답하며 사회의 허점을 비판한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "돈을 번 실험, 도둑을 이주시킨 계획, 개혁안의 뜻",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 허생. 돈을 번 실험, 도둑을 이주시킨 계획, 개혁안의 뜻에 관해 무엇이 궁금한가요?"
    },
    "변씨": {
      "speechStyle": "사람을 보는 안목과 장사 경험을 바탕으로 신중하게 말한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "허생에게 돈을 빌려준 이유와 되돌아온 재물을 본 판단",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 변씨. 허생에게 돈을 빌려준 이유와 되돌아온 재물을 본 판단에 관해 무엇이 궁금한가요?"
    },
    "이완": {
      "speechStyle": "나라의 현실을 걱정하지만 체면과 관습을 쉽게 버리지 못하는 말투를 쓴다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "허생이 제안한 세 가지 계책과 자신이 망설인 이유",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 이완. 허생이 제안한 세 가지 계책과 자신이 망설인 이유에 관해 무엇이 궁금한가요?"
    }
  },
  "sangnoksu": {
    "박동혁": {
      "speechStyle": "차분하고 실천적인 말투로 마을 사람과 함께할 방법을 찾는다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "한곡리에서 농민과 조직을 만들며 배운 점",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 박동혁. 한곡리에서 농민과 조직을 만들며 배운 점에 관해 무엇이 궁금한가요?"
    },
    "채영신": {
      "speechStyle": "밝고 굳센 말투로 아이들의 배움과 마을의 미래를 이야기한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "청석골 강습소와 병중에도 교육을 놓지 않은 이유",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 채영신. 청석골 강습소와 병중에도 교육을 놓지 않은 이유에 관해 무엇이 궁금한가요?"
    },
    "마을 사람": {
      "speechStyle": "생활의 어려움과 변화를 직접 겪는 현실적인 말투를 쓴다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "두 청년의 활동을 경계하다가 함께하게 된 과정",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 마을 사람. 두 청년의 활동을 경계하다가 함께하게 된 과정에 관해 무엇이 궁금한가요?"
    }
  },
  "mujong": {
    "이형식": {
      "speechStyle": "생각이 많고 설명적인 말투로 개인의 감정과 사회적 책임 사이를 고민한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "교육으로 사람과 나라를 변화시키려 한 결심",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 이형식. 교육으로 사람과 나라를 변화시키려 한 결심에 관해 무엇이 궁금한가요?"
    },
    "박영채": {
      "speechStyle": "감정을 절제하면서도 자신의 삶을 다시 선택하려는 의지를 드러낸다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "과거의 시련을 넘어 배움과 새로운 삶을 택한 과정",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 박영채. 과거의 시련을 넘어 배움과 새로운 삶을 택한 과정에 관해 무엇이 궁금한가요?"
    },
    "김선형": {
      "speechStyle": "솔직하고 이성적인 말투로 사랑과 진로를 고민한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "형식과 영채를 만나며 개인의 선택을 사회의 미래와 연결한 생각",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 김선형. 형식과 영채를 만나며 개인의 선택을 사회의 미래와 연결한 생각에 관해 무엇이 궁금한가요?"
    }
  },
  "alice": {
    "앨리스": {
      "speechStyle": "호기심 많고 논리적으로 질문하며 부당한 말에는 용기 있게 반박한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "이상한 규칙을 겪으며 자신의 판단을 믿게 된 변화",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 앨리스. 이상한 규칙을 겪으며 자신의 판단을 믿게 된 변화에 관해 무엇이 궁금한가요?"
    },
    "흰 토끼": {
      "speechStyle": "늘 시간에 쫓기며 초조하고 빠르게 말한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "앨리스가 따라오게 된 시작과 재판에서 맡은 역할",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 흰 토끼. 앨리스가 따라오게 된 시작과 재판에서 맡은 역할에 관해 무엇이 궁금한가요?"
    },
    "하트 여왕": {
      "speechStyle": "명령조로 소리치며 사소한 일에도 처형을 외친다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "규칙보다 자신의 기분을 앞세운 명령과 재판",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 하트 여왕. 규칙보다 자신의 기분을 앞세운 명령과 재판에 관해 무엇이 궁금한가요?"
    }
  },
  "wizard-oz": {
    "도로시": {
      "speechStyle": "솔직하고 다정한 말투로 친구들과 함께 해결책을 찾는다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "집으로 돌아가려는 목표와 여행에서 본 친구들의 진짜 능력",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 도로시. 집으로 돌아가려는 목표와 여행에서 본 친구들의 진짜 능력에 관해 무엇이 궁금한가요?"
    },
    "허수아비": {
      "speechStyle": "스스로 어리석다고 여기지만 문제를 풀 때는 기발하고 논리적으로 말한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "위기마다 세운 계획과 오즈에게 뇌를 부탁한 이유",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 허수아비. 위기마다 세운 계획과 오즈에게 뇌를 부탁한 이유에 관해 무엇이 궁금한가요?"
    },
    "양철 나무꾼": {
      "speechStyle": "섬세하고 다정하며 다른 존재의 아픔에 쉽게 공감한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "친구와 동물을 배려하면서도 심장이 없다고 믿은 사연",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 양철 나무꾼. 친구와 동물을 배려하면서도 심장이 없다고 믿은 사연에 관해 무엇이 궁금한가요?"
    },
    "겁쟁이 사자": {
      "speechStyle": "두려움을 솔직히 인정하면서도 친구를 위해 힘차게 나선다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "무서워하면서도 위험에 맞선 행동",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 겁쟁이 사자. 무서워하면서도 위험에 맞선 행동에 관해 무엇이 궁금한가요?"
    }
  },
  "anne": {
    "앤 셜리": {
      "speechStyle": "말이 빠르고 표현이 풍부하며 평범한 풍경에도 아름다운 이름을 붙인다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "사랑받는 가족을 바라던 마음과 실수를 겪으며 성장한 과정",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 앤 셜리. 사랑받는 가족을 바라던 마음과 실수를 겪으며 성장한 과정에 관해 무엇이 궁금한가요?"
    },
    "마릴라 커스버트": {
      "speechStyle": "엄격하고 현실적인 말투 속에 책임감과 애정을 감춘다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "앤을 돌려보내려다 함께 살기로 결정한 이유",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 마릴라 커스버트. 앤을 돌려보내려다 함께 살기로 결정한 이유에 관해 무엇이 궁금한가요?"
    },
    "매슈 커스버트": {
      "speechStyle": "말수는 적지만 앤을 지지할 때는 따뜻하고 분명하게 말한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "역에서 앤을 만난 순간부터 느낀 애정과 신뢰",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 매슈 커스버트. 역에서 앤을 만난 순간부터 느낀 애정과 신뢰에 관해 무엇이 궁금한가요?"
    }
  },
  "treasure-island": {
    "짐 호킨스": {
      "speechStyle": "관찰한 사실을 또렷하게 말하고 위험 속에서도 빠르게 판단한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "사과통에서 엿들은 대화와 동료들에게 알린 과정",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 짐 호킨스. 사과통에서 엿들은 대화와 동료들에게 알린 과정에 관해 무엇이 궁금한가요?"
    },
    "롱 존 실버": {
      "speechStyle": "친절하고 설득력 있게 말하지만 상황에 따라 편을 바꾸며 속내를 감춘다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "선원들을 포섭한 방법과 보물을 차지하려 한 계획",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 롱 존 실버. 선원들을 포섭한 방법과 보물을 차지하려 한 계획에 관해 무엇이 궁금한가요?"
    },
    "리브지 의사": {
      "speechStyle": "침착하고 논리적인 말투로 위험과 사람을 판단한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "짐의 정보를 듣고 반란에 대비한 계획",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 리브지 의사. 짐의 정보를 듣고 반란에 대비한 계획에 관해 무엇이 궁금한가요?"
    }
  },
  "little-women": {
    "조 마치": {
      "speechStyle": "솔직하고 씩씩하며 감정이 앞서도 잘못을 돌아본다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "작가의 꿈, 가족을 위해 한 일, 성급함을 고친 경험",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 조 마치. 작가의 꿈, 가족을 위해 한 일, 성급함을 고친 경험에 관해 무엇이 궁금한가요?"
    },
    "메그 마치": {
      "speechStyle": "차분하고 책임감 있게 말하며 화려함에 흔들린 경험도 솔직히 인정한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "가난 속에서 허영과 행복의 기준을 배운 과정",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 메그 마치. 가난 속에서 허영과 행복의 기준을 배운 과정에 관해 무엇이 궁금한가요?"
    },
    "베스 마치": {
      "speechStyle": "조용하고 다정하게 가족과 이웃을 먼저 생각한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "병과 상실 속에서도 가족에게 남긴 사랑",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 베스 마치. 병과 상실 속에서도 가족에게 남긴 사랑에 관해 무엇이 궁금한가요?"
    },
    "에이미 마치": {
      "speechStyle": "야무지고 자존심이 강하지만 경험을 통해 배운 점을 분명히 말한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "언니들과의 갈등을 지나 예술과 책임을 함께 배운 과정",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 에이미 마치. 언니들과의 갈등을 지나 예술과 책임을 함께 배운 과정에 관해 무엇이 궁금한가요?"
    }
  },
  "pinocchio": {
    "피노키오": {
      "speechStyle": "충동적이고 변명이 많지만 잘못을 깨달을수록 솔직하고 책임 있게 말한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "거짓말과 유혹을 겪고 제페토를 구하며 달라진 선택",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 피노키오. 거짓말과 유혹을 겪고 제페토를 구하며 달라진 선택에 관해 무엇이 궁금한가요?"
    },
    "제페토": {
      "speechStyle": "가난해도 아들을 믿고 걱정하는 다정하고 인내심 있는 말투를 쓴다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "피노키오를 위해 희생한 일과 다시 만난 뒤의 마음",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 제페토. 피노키오를 위해 희생한 일과 다시 만난 뒤의 마음에 관해 무엇이 궁금한가요?"
    },
    "푸른 요정": {
      "speechStyle": "부드럽지만 약속과 책임에 대해서는 엄격하게 말한다. 원전에 나온 사건과 자신의 경험 범위에서만 답한다.",
      "perspective": "피노키오의 거짓말을 드러내고 변화할 기회를 준 이유",
      "boundaries": [
        "학생이 묻지 않은 결말을 먼저 폭로하지 않는다.",
        "직접 겪거나 관찰하지 않은 일은 확정하지 않는다.",
        "답의 근거가 되는 장면을 짧게 짚고 학생이 다시 생각할 질문을 남긴다."
      ],
      "starter": "나는 푸른 요정. 피노키오의 거짓말을 드러내고 변화할 기회를 준 이유에 관해 무엇이 궁금한가요?"
    }
  }
};

const finalAnswerRulesByBook = {
  "memil": {
    "question": "허 생원과 동이 사이에는 어떤 숨은 인연이 있을까?",
    "answer": "동이는 허 생원의 아들일 가능성이 크다.",
    "keywords": [
      "동이",
      "아들"
    ]
  },
  "honggildong": {
    "question": "홍길동은 왜 집을 떠나 새로운 세상으로 나아갔을까?",
    "answer": "홍길동은 서자로 태어나 가족을 가족이라 부르지 못하고 차별과 생명의 위협까지 받자, 자신의 능력과 뜻을 펼칠 길을 찾아 집을 떠났다.",
    "keywords": [
      "서자",
      "천생",
      "신분",
      "차별",
      "아버지",
      "부친",
      "아비",
      "형",
      "가족",
      "떠",
      "뜻",
      "능력",
      "세상"
    ]
  },
  "unlucky-day": {
    "question": "김 첨지에게 운수 좋던 하루가 왜 가장 비극적인 날이 되었을까?",
    "answer": "비 오는 날 김 첨지는 뜻밖에 많은 돈을 벌었지만, 아내의 곁을 비운 사이 아내가 죽어 그 행운이 가장 큰 불행으로 뒤집혔다.",
    "keywords": [
      "돈",
      "수입",
      "운수",
      "벌",
      "아내",
      "처",
      "죽",
      "사망",
      "비극",
      "불행"
    ]
  },
  "wings": {
    "question": "화자는 왜 마지막에 다시 날개가 돋기를 바랐을까?",
    "answer": "화자는 아내에게 통제되어 무기력하게 살던 자신을 벗어나, 잃어버린 자아와 자유롭게 움직일 힘을 되찾고 싶어 날개를 바랐다.",
    "keywords": [
      "무기력",
      "통제",
      "갇",
      "억눌",
      "자아",
      "나",
      "삶",
      "자유",
      "회복",
      "벗어나",
      "날개"
    ]
  },
  "spring": {
    "question": "장인은 왜 혼례를 자꾸 미루며 '나'의 일을 붙잡아 두었을까?",
    "answer": "장인은 점순이의 키가 더 자라야 한다는 핑계로 혼례를 미루면서, '나'를 값싼 노동력으로 계속 부려 먹으려 했다.",
    "keywords": [
      "장인",
      "아버지",
      "혼례",
      "결혼",
      "성례",
      "일",
      "노동",
      "부려",
      "머슴",
      "미루",
      "핑계",
      "키"
    ]
  },
  "heungbu": {
    "question": "흥부와 놀부의 박에서는 왜 전혀 다른 것이 나왔을까?",
    "answer": "흥부는 불쌍한 제비를 진심으로 도와 복을 받았지만, 놀부는 보상을 탐내 제비를 일부러 해치고 선행을 흉내 내 벌을 받았다.",
    "keywords": [
      "흥부",
      "흥보",
      "도와",
      "고쳐",
      "선행",
      "착",
      "놀부",
      "욕심",
      "일부러",
      "흉내",
      "벌"
    ]
  },
  "simcheong": {
    "question": "심청은 왜 인당수에 몸을 던지는 선택을 했을까?",
    "answer": "심청은 공양미 삼백 석을 바치면 아버지가 눈을 뜰 수 있다는 약속을 지키기 위해, 선인들의 제물이 되어 인당수에 몸을 던졌다.",
    "keywords": [
      "아버지",
      "심봉사",
      "부친",
      "눈",
      "개안",
      "공양미",
      "삼백석",
      "300",
      "인당수",
      "희생",
      "제물"
    ]
  },
  "chunhyang": {
    "question": "춘향은 왜 변학도의 요구를 끝까지 거절했을까?",
    "answer": "춘향은 이몽룡과의 사랑과 약속을 지키고 자신의 존엄을 지키기 위해, 권력을 앞세운 변학도의 부당한 수청 요구를 거절했다.",
    "keywords": [
      "몽룡",
      "사랑",
      "약속",
      "정절",
      "존엄",
      "신념",
      "마음",
      "변학도",
      "사또",
      "권력",
      "수청",
      "거절",
      "저항"
    ]
  },
  "heosaeng": {
    "question": "허생은 큰돈을 번 뒤에도 부자로 머물지 않고 모든 것을 버렸을까?",
    "answer": "허생은 부 자체가 목적이 아니라 조선 사회와 경제의 허점을 시험하고 새로운 질서와 개혁 가능성을 보여 주려 했기 때문에 재물에 머물지 않았다.",
    "keywords": [
      "부",
      "돈",
      "재물",
      "부자",
      "목적",
      "시험",
      "수단",
      "사회",
      "조선",
      "경제",
      "나라",
      "개혁",
      "질서",
      "허점",
      "비판"
    ]
  },
  "sangnoksu": {
    "question": "동혁과 영신은 어려움 속에서도 왜 농촌 계몽을 포기하지 않았을까?",
    "answer": "동혁과 영신은 교육과 공동체의 힘이 농촌 사람들의 삶을 스스로 바꾸게 한다고 믿었기 때문에 방해와 병 속에서도 활동을 이어 갔다.",
    "keywords": [
      "교육",
      "배움",
      "계몽",
      "농촌",
      "마을",
      "농민",
      "변화",
      "미래",
      "삶",
      "믿",
      "희망",
      "공동체",
      "함께"
    ]
  },
  "mujong": {
    "question": "홍수 현장을 겪은 형식과 일행은 앞으로 무엇을 해야 한다고 결심했을까?",
    "answer": "형식과 일행은 홍수로 고통받는 사람들을 보며 교육·과학·예술을 배워 민중의 삶과 나라의 미래를 밝히는 데 쓰겠다고 결심했다.",
    "keywords": [
      "교육",
      "과학",
      "예술",
      "문명",
      "민중",
      "사람",
      "백성",
      "나라",
      "사회",
      "미래",
      "돕",
      "바꾸",
      "밝히",
      "배우"
    ]
  },
  "alice": {
    "question": "앨리스는 왜 마지막 재판에서 여왕과 카드들을 더는 두려워하지 않게 되었을까?",
    "answer": "앨리스는 이상한 규칙들이 근거 없는 말장난에 불과하다는 것을 깨닫고 성장하면서, 여왕과 배심원도 결국 카드일 뿐이라고 판단해 맞설 용기를 얻었다.",
    "keywords": [
      "규칙",
      "재판",
      "말장난",
      "부당",
      "카드",
      "card",
      "깨달",
      "판단",
      "성장",
      "용기",
      "두려워하지",
      "맞서"
    ]
  },
  "wizard-oz": {
    "question": "허수아비와 양철 나무꾼과 겁쟁이 사자는 왜 이미 바라던 자질을 지니고 있었다고 볼 수 있을까?",
    "answer": "허수아비는 문제를 풀어 지혜를, 양철 나무꾼은 타인을 걱정해 따뜻한 마음을, 사자는 두려워도 친구를 위해 행동해 용기를 이미 보여 주었다.",
    "keywords": [
      "허수아비",
      "Scarecrow",
      "지혜",
      "뇌",
      "양철",
      "Tin",
      "마음",
      "심장",
      "사자",
      "Lion",
      "용기",
      "이미",
      "행동",
      "보여"
    ]
  },
  "anne": {
    "question": "마릴라와 매슈는 실수로 온 앤을 왜 결국 그린 게이블스의 가족으로 받아들였을까?",
    "answer": "마릴라와 매슈는 앤의 외로움과 진심을 이해하고, 실수와 소동 속에서도 서로를 돌보며 깊은 애정과 가족의 책임을 느끼게 되어 앤을 받아들였다.",
    "keywords": [
      "앤",
      "Anne",
      "외로",
      "고아",
      "진심",
      "애정",
      "사랑",
      "정",
      "가족",
      "돌보",
      "책임",
      "받아들"
    ]
  },
  "treasure-island": {
    "question": "짐은 해적들의 반란 계획을 어떤 결정적인 단서로 알아냈을까?",
    "answer": "짐은 히스파니올라호의 사과통 안에 숨어 있다가 롱 존 실버가 선원들을 해적으로 끌어들이고 반란 시점을 의논하는 말을 직접 들었다.",
    "keywords": [
      "짐",
      "Jim",
      "사과통",
      "apple barrel",
      "실버",
      "Silver",
      "엿듣",
      "들",
      "대화",
      "반란",
      "mutiny",
      "해적"
    ]
  },
  "little-women": {
    "question": "마치 자매들은 가난과 상실을 어떻게 견디며 각자의 꿈을 키워 갔을까?",
    "answer": "마치 자매들은 서로 다투고 실패해도 어머니의 가르침과 자매의 사랑, 맡은 일에 대한 책임으로 다시 일어나 각자 글·가정·음악·미술의 꿈을 키웠다.",
    "keywords": [
      "자매",
      "가족",
      "서로",
      "사랑",
      "지지",
      "도와",
      "함께",
      "책임",
      "일",
      "노력",
      "꿈",
      "글",
      "음악",
      "미술",
      "가정"
    ]
  },
  "pinocchio": {
    "question": "피노키오는 어떤 변화를 거쳐 진짜 아이가 될 수 있었을까?",
    "answer": "피노키오는 거짓말과 유혹의 결과를 겪은 뒤 정직과 책임을 배우고, 제페토를 구하며 가족을 위해 일하고 희생했기 때문에 진짜 아이로 성장했다.",
    "keywords": [
      "거짓말",
      "유혹",
      "잘못",
      "정직",
      "솔직",
      "책임",
      "일",
      "희생",
      "제페토",
      "아버지",
      "가족",
      "구"
    ]
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
  const coreItems = [
    ["학생", teacherState.students.length],
    ["참여 횟수", participationCount],
    ["전체 기록", recordCount],
    ["평가 완료", assessmentCount]
  ];
  const activityItems = [
    ["활동 1", activity1Count],
    ["활동 2", activity2Count],
    ["활동 3", activity3Count]
  ];

  teacherSummaryStrip.innerHTML = "";
  const coreGroup = document.createElement("div");
  coreGroup.className = "teacher-summary-primary";
  coreItems.forEach(([label, value]) => {
    const item = document.createElement("article");
    item.className = "teacher-summary-item";
    const labelElement = document.createElement("span");
    labelElement.textContent = label;
    const valueElement = document.createElement("strong");
    valueElement.textContent = String(value);
    item.append(labelElement, valueElement);
    coreGroup.appendChild(item);
  });

  const activityGroup = document.createElement("section");
  activityGroup.className = "teacher-activity-summary";
  activityGroup.setAttribute("aria-label", "활동별 기록");
  const activityTitle = document.createElement("h3");
  activityTitle.textContent = "활동별 기록";
  const activityList = document.createElement("div");
  activityList.className = "teacher-activity-summary-list";
  activityItems.forEach(([label, value]) => {
    const item = document.createElement("div");
    const labelElement = document.createElement("span");
    labelElement.textContent = label;
    const valueElement = document.createElement("strong");
    valueElement.textContent = `${value}개`;
    item.append(labelElement, valueElement);
    activityList.appendChild(item);
  });
  activityGroup.append(activityTitle, activityList);
  teacherSummaryStrip.append(coreGroup, activityGroup);
}

function renderTeacherStudentList() {
  const visibleStudents = getVisibleTeacherStudents();
  teacherStudentList.innerHTML = "";
  teacherStudentSelect.innerHTML = "";

  if (!visibleStudents.length) {
    const empty = document.createElement("p");
    empty.className = "teacher-empty-state";
    empty.textContent = teacherState.students.length ? "검색에 맞는 학생이 없습니다." : "아직 불러온 학생 기록이 없습니다.";
    teacherStudentList.appendChild(empty);
    const option = document.createElement("option");
    option.textContent = teacherState.students.length ? "검색 결과 없음" : "학생 기록 없음";
    option.value = "";
    teacherStudentSelect.appendChild(option);
    teacherStudentSelect.disabled = true;
    return;
  }

  teacherStudentSelect.disabled = false;

  if (!teacherState.selectedStudentKey || !visibleStudents.some((student) => student.studentKey === teacherState.selectedStudentKey)) {
    teacherState.selectedStudentKey = visibleStudents[0].studentKey;
    teacherState.selectedActivityTab = getPreferredTeacherActivityTab(visibleStudents[0]);
  }

  visibleStudents.forEach((student) => {
    const option = document.createElement("option");
    option.value = student.studentKey;
    option.textContent = `${student.className || "-"}반 ${student.number || "-"}번 / 참여 ${student.participationCount}회`;
    option.selected = student.studentKey === teacherState.selectedStudentKey;
    teacherStudentSelect.appendChild(option);

    const button = document.createElement("button");
    button.type = "button";
    button.className = "teacher-student-button";
    button.classList.toggle("is-selected", student.studentKey === teacherState.selectedStudentKey);
    button.dataset.studentKey = student.studentKey;

    const title = document.createElement("strong");
    title.textContent = `${student.className || "-"}반 ${student.number || "-"}번`;
    const latest = document.createElement("span");
    latest.textContent = `최근 참여 ${teacherShortDate(student.latestAt)}`;
    const meta = document.createElement("small");
    meta.textContent = `참여 ${student.participationCount}회 / 기록 ${student.recordCount}개`;
    button.append(title, latest, meta);
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
  const type = document.createElement("h5");
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
  const points = getTeacherAssessmentPoints(student, teacherState.selectedActivityTab || "all");
  const heading = document.createElement("div");
  heading.className = "teacher-score-trend-heading";
  const title = document.createElement("h4");
  title.textContent = "참여별 점수 변화";
  heading.appendChild(title);
  if (points.length) {
    const description = document.createElement("p");
    description.textContent = "평가 총점을 15점 기준으로 맞춰 참여 순서대로 이어 봅니다.";
    heading.appendChild(description);
  }
  section.appendChild(heading);

  if (!points.length) {
    section.classList.add("is-empty");
    const empty = document.createElement("p");
    empty.className = "teacher-score-trend-empty";
    empty.textContent = teacherState.selectedActivityTab === "activity1" || teacherState.selectedActivityTab === "activity3" || teacherState.selectedActivityTab === "session"
      ? "이 활동에는 점수 평가가 없습니다. 전체 또는 활동 2에서 확인하세요."
      : "평가 점수가 아직 없습니다.";
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
    const date = document.createElement("time");
    date.dateTime = participation.startedAt || "";
    date.textContent = teacherShortDate(participation.startedAt);
    const meta = document.createElement("span");
    meta.className = "teacher-participation-meta";
    const books = Array.from(new Set(participation.records.map((record) => record.bookTitle).filter(Boolean)));
    const nickname = participation.nickname || "닉네임 기록 없음";
    const nicknameText = document.createElement("small");
    nicknameText.textContent = `닉네임 ${nickname}`;
    const recordText = document.createElement("small");
    recordText.textContent = `기록 ${participation.records.length}개`;
    meta.append(nicknameText, recordText);
    if (books.length) {
      const bookText = document.createElement("small");
      bookText.textContent = `책 ${books.join(", ")}`;
      meta.appendChild(bookText);
    }
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
  const meta = document.createElement("div");
  meta.className = "teacher-detail-metrics";
  [
    ["참여", `${student.participationCount}회`],
    ["누적 기록", `${student.recordCount}개`],
    ["활동 1", `${student.activity1Count}개`],
    ["활동 2", `${student.activity2Count}개`],
    ["활동 3", `${student.activity3Count}개`],
    ["평가", `${student.assessmentCount}개`]
  ].forEach(([label, value]) => {
    const metric = document.createElement("span");
    metric.textContent = `${label} ${value}`;
    meta.appendChild(metric);
  });
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
    characterChatLog.scrollTop = characterChatLog.scrollHeight;
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

  getCharacterProfiles(nextBook).forEach((character) => {
    const image = new Image();
    image.decoding = "async";
    image.src = character.profileImage;
  });

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
teacherStudentSelect.addEventListener("change", () => {
  if (!teacherStudentSelect.value) return;
  teacherState.selectedStudentKey = teacherStudentSelect.value;
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
