# 저장소 파일 정리 조사

작성일: 2026-07-22
조사 브랜치: `ai-speed-test`

## 배포 기준

GitHub Actions는 `my-webapp`을 임시 `swa-static-app`으로 복사한 뒤 `swa-static-app/api`를 제거합니다. 정적 앱은 이 임시 폴더, Azure Functions는 `my-webapp/api`에서 배포됩니다. 따라서 저장소 루트의 예전 정적 앱과 루트 `assets`는 배포 산출물에 포함되지 않습니다.

## 삭제 가능

다음 텍스트 파일은 `my-webapp`의 현재 파일과 중복되거나, 잘못된 위치에 남은 과거 Azure Function 복사본이어서 제거했습니다.

- 루트 `index.html`, `app.js`, `agent-client.js`, `style.css`, `books.json`, `staticwebapp.config.json`
- 루트 `docs/azure-beginner-roadmap.md`
- `my-webapp/adventure-turn.js`, `my-webapp/health.js`, `my-webapp/openai.js`
- `my-webapp/api/test/browser-fixture-server.js` 임시 브라우저 시험 서버

루트 `assets`의 PNG 14개도 모두 `my-webapp/assets`의 대응 파일과 SHA-256이 같고 앱·문서·배포 설정에서 참조되지 않는 배포 제외 복사본이었습니다. 이후 사용자가 루트 중복 파일 정리를 요청해 루트 `assets`만 제거했습니다. `my-webapp/assets`의 실제 앱 에셋은 수정하거나 제거하지 않았습니다.

루트 `docs`는 이전 중복 문서 제거 뒤 비어 있던 폴더이므로 함께 제거했습니다.

## 현재 사용 중

- `.github/workflows/azure-static-web-apps-calm-beach-0aaa31800.yml`: 실제 Azure Static Web Apps 배포 흐름
- `my-webapp/index.html`, `style.css`, `app.js`, `agent-client.js`, `books.json`, `staticwebapp.config.json`: 정적 앱
- `my-webapp/assets/**`: HTML, CSS, JavaScript, `books.json`이 참조하는 에셋
- `my-webapp/api/src/**`, `host.json`, `package.json`, `package-lock.json`: Azure Functions API
- `my-webapp/api/test/*.test.js`: 자동 회귀 시험. `.funcignore`로 운영 배포에서는 제외
- `my-webapp/docs/**`: 실행·교사 결과판 운영 문서와 확인용 샘플
- `bookadventureproject/**`: 원 요구사항과 활동별 기획 원본
- `NEXT_CHAT_HANDOFF.md`: 과거 인수인계 기록

## 판단 보류

- 루트 `.agents`, `.codex`: 현재 비어 있지만 작업 도구가 사용하는 예약 폴더일 수 있어 유지
- `my-webapp/teacher-review.html`: 현재는 `index.html`로 이동시키는 호환용 주소이며 외부 북마크 사용 여부를 저장소만으로 확인할 수 없어 유지
- `my-webapp/docs/teacher-review-sample.json`: 코드에서 읽지는 않지만 교사용 결과 형식 확인 자료로 문서에서 요구하는 실제 산출물일 수 있어 유지
- `NEXT_CHAT_HANDOFF.md`: 내용 일부가 오래됐지만 작업 이력 보존 문서이므로 유지

이번 정리는 저장소 루트의 완전 중복 PNG에만 한정했습니다. `my-webapp/assets`의 표지·인물·장소 이미지와 해당 경로는 모두 유지합니다.

## `file://` 지원 판단

`books.json`이 책 데이터의 단일 원본이 되었으므로 `file://` 직접 실행은 지원하지 않습니다. 브라우저 보안 정책상 로컬 JSON `fetch`가 실패할 수 있고, 전체 책 복사본을 JavaScript에 다시 넣는 것은 단일 원본 원칙을 깨뜨립니다. 로컬에서도 HTTP 서버 또는 Static Web Apps CLI로 실행합니다.
