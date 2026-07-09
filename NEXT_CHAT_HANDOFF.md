# 다음 채팅 인수인계

작성일: 2026년 7월 9일  
프로젝트: `book-adventure`  
브랜치: `main`  
원격 저장소: `https://github.com/mongnang/book-adventure.git`

## 현재 상태

- 로컬 저장소는 `origin/main`보다 앞서 있음.
- 이미 만든 로컬 커밋:
  - `df53130 Add title scenario activity flow`
- 이전에 GitHub push를 시도했지만, Codex 사용량 한도 때문에 승인 단계에서 막혔음.
- 이번 파일은 진행상황을 남기기 위해 추가한 인수인계 문서임.

## 지금까지 구현한 주요 내용

### 화면 흐름

- 첫 화면: 입장 화면
- 두 번째 화면: 학생 정보 입력
  - 반
  - 번호
  - 닉네임
- 세 번째 화면: 책장
- 네 번째 화면: 활동 선택 메뉴
  - 활동 1: 책 제목만 보고 가상 시나리오 작성하기
  - 활동 2: 질문과 단서로 숨은 인연 추리하기
- 결과 화면은 별도 화면으로 분리됨.

### 활동 1: 책 제목만 보고 상상하기

사용자가 준 활동 1 지침을 반영해 다음 흐름으로 구현함.

1. 책 제목만 보여줌.
2. 원전 줄거리는 미리 알려주지 않음.
3. 학생에게 한 번에 하나씩 질문함.
   - 등장인물: 누가 나올 것 같아?
   - 배경: 어디서, 언제 일어나는 이야기일까?
   - 무슨 일: 어떤 일이 벌어질 것 같아?
4. 학생 답변 3개를 바탕으로 5~7문장짜리 가상 시나리오를 생성함.
5. 수정 선택지 3개를 제공함.
   - 더 신나고 모험 가득하게
   - 더 따뜻하고 감동적으로
   - 깜짝 반전을 넣어서
6. 학생이 직접 수정 요청도 쓸 수 있음.
7. 학생이 확정하면 결과 화면으로 이동함.
8. 결과 화면에는 다음이 표시됨.
   - 확정한 가상 시나리오
   - 나노바나나용 한국어 프롬프트
   - 나노바나나용 영어 프롬프트
   - 선생님께 제출 버튼

### 활동 2: 질문과 단서로 추리하기

- 기존 추리 활동은 활동 선택 메뉴의 활동 2로 이동함.
- 책장 화면에서 바로 활동 2로 들어가지 않고, 활동 선택 화면을 거치도록 수정함.
- 마지막 정답 입력 안내를 보완함.
  - 기존: 정답만 입력
  - 변경: 정답과 그렇게 생각한 이유를 한 문장으로 함께 입력

### 결과 화면

- 토끼 사서 캐릭터 이미지를 사용하는 결과 화면 구조가 유지됨.
- 결과 화면에서 캐릭터는 오른쪽, 말풍선과 내용은 왼쪽에 배치하는 방향으로 정리됨.
- 활동 1 결과와 활동 2 평가 결과가 같은 결과 화면을 사용하되, 들어오는 활동에 따라 내용이 다르게 렌더링됨.

## 데이터 저장 구조

### 학생 정보

- 브라우저 로컬 저장소에 저장됨.
- 키: `book-adventure-student-profile`

### 활동 2 대화 기록

- 브라우저 로컬 저장소에 최근 대화가 저장됨.
- 키: `book-adventure-conversation-log`
- Azure Function API 호출 payload에도 학생 정보, 진행 상태, 최근 대화 흐름이 함께 들어감.

### 활동 1 제출 데이터

활동 1 결과에서 `선생님께 제출` 버튼을 누르면 다음 데이터가 저장 대상으로 전송됨.

- 학생 정보
- 책 정보
- 학생이 입력한 3가지 상상 요소
  - 등장인물
  - 배경
  - 무슨 일
- 확정한 가상 시나리오
- 나노바나나 한국어 프롬프트
- 나노바나나 영어 프롬프트
- 활동 1 대화 로그
- 수정 횟수

서버 저장이 가능하면 Azure Cosmos DB에 저장됨.

- API route: `/api/adventure/title-scenario`
- 저장 type: `titleScenarioSubmission`
- DB 이름: Azure Function 설정값 `COSMOS_DATABASE_NAME`
- 컨테이너 이름: Azure Function 설정값 `COSMOS_CONTAINER_NAME`

서버 저장이 불가능하면 브라우저 로컬 저장소에 임시 저장됨.

- 키: `book-adventure-title-scenario-submissions`

## AI 평가 기준 변경

기존에는 평가 항목이 많았음.

- 단서 찾기
- 근거 연결
- 질문 태도
- 추리 결론

사용자 의견에 따라 활동 2 평가는 다음 두 항목 중심으로 줄임.

- 질문 태도
- 추리 결론

각 항목은 0~5점이고, 총점은 10점 기준임.

또한 반복되던 다음 목표 문장을 수정함.

- 고정 문장이 반복되지 않도록 함.
- 학생의 진행 상태, 대화 수, 단서 수, 정답 여부, 책 제목을 반영해 다음 목표가 달라지도록 수정함.
- Azure OpenAI 평가 프롬프트에도 `nextStep`을 매번 학생 기록에 맞춰 쓰라고 명시함.

## 수정한 주요 파일

- `my-webapp/index.html`
  - 활동 선택 화면 추가
  - 활동 1 화면 구조 추가
  - 캐시 버전 갱신
- `my-webapp/style.css`
  - 활동 선택 화면 스타일
  - 활동 1 대화형 화면 스타일
  - 활동 1 결과 화면 스타일
  - 반응형 스타일
- `my-webapp/app.js`
  - 화면 이동 흐름 수정
  - 활동 1 단계형 진행 로직 추가
  - 시나리오 생성/수정/확정 로직 추가
  - 나노바나나 프롬프트 생성 로직 추가
  - 활동 1 결과 화면 렌더링 추가
  - 활동 2 평가 fallback 개선
- `my-webapp/agent-client.js`
  - 활동 1 제출 API 호출 추가
  - 서버 실패 시 로컬 임시 저장 fallback 추가
  - 평가 fallback 개선
- `my-webapp/api/src/functions/title-scenario.js`
  - 활동 1 제출용 Azure Function 추가
- `my-webapp/api/src/functions/assessment.js`
  - 평가 점수 총점 계산을 10점 기준에 맞게 조정
- `my-webapp/api/src/shared/demo.js`
  - 서버 fallback 평가 기준 수정
- `my-webapp/api/src/shared/prompts.js`
  - Azure OpenAI 평가 프롬프트 수정
- `my-webapp/api/src/shared/store.js`
  - Cosmos DB 저장 성공 여부를 반환하도록 수정

## 확인한 것

다음 검사를 통과함.

- `node --check my-webapp/app.js`
- `node --check my-webapp/agent-client.js`
- `node --check my-webapp/api/src/functions/title-scenario.js`
- `node --check my-webapp/api/src/shared/demo.js`
- `node --check my-webapp/api/src/shared/store.js`
- `node --check my-webapp/api/src/shared/prompts.js`
- `node --check my-webapp/api/src/functions/assessment.js`
- `git diff --check`
- 주요 HTML id와 JS 연결 흐름 검사

브라우저 자동 클릭 검사는 하지 못함.

- 이유: 로컬 주소 `http://127.0.0.1:5173/` 접속이 브라우저 보안 정책으로 차단됨.
- 따라서 배포 후 실제 사이트에서 손으로 한 번 확인해야 함.

## 남은 주의점

- 로컬 커밋은 만들어졌지만, 이전에는 GitHub push가 사용량 한도 때문에 실패했음.
- GitHub Actions가 이전에 hosted runner 문제를 보인 적이 있음.
  - 오류 예시: `The job was not acquired by Runner of type hosted...`
  - 이 경우 코드 문제가 아니라 GitHub Actions 실행 인프라 문제일 수 있음.
- 배포 후 캐시 문제를 피하기 위해 `index.html`의 CSS/JS 버전은 이미 갱신해 둠.

## 사용량이 풀리면 바로 해야 할 단계

1. 프로젝트 폴더로 이동한다.

```powershell
cd C:\Users\User\Documents\Codex\2026-07-09\vmfh\work\book-adventure
```

2. 현재 상태를 확인한다.

```powershell
git status -sb
```

3. 이 문서가 아직 커밋되지 않았다면 커밋한다.

```powershell
git add NEXT_CHAT_HANDOFF.md
git commit -m "Add project handoff notes"
```

4. GitHub에 푸시한다.

```powershell
git push origin main
```

5. GitHub Actions 배포가 시작됐는지 확인한다.

```powershell
gh run list --limit 5
```

6. 배포가 실패하면 로그를 확인한다.

```powershell
gh run view --log
```

7. 배포가 성공하면 실제 사이트에서 손으로 확인한다.

- 책장 화면에서 `이 책으로 활동 고르기` 클릭
- 활동 선택 화면 표시 확인
- 활동 1 시작
- 등장인물, 배경, 무슨 일을 차례로 입력
- 시나리오 생성 확인
- 수정 선택지 3개 확인
- `이거 좋아! 확정하기` 클릭
- 결과 화면에서 나노바나나 프롬프트 확인
- `선생님께 제출` 클릭
- 서버 저장 또는 로컬 임시 저장 안내 문구 확인
- 활동 2 시작 버튼이 기존 추리 활동으로 연결되는지 확인

8. Azure Cosmos DB에 활동 1 제출물이 쌓였는지 확인한다.

- `type` 값이 `titleScenarioSubmission`인 항목을 찾는다.
- 저장 위치는 Azure Function 설정의 `COSMOS_DATABASE_NAME`, `COSMOS_CONTAINER_NAME` 값이다.
