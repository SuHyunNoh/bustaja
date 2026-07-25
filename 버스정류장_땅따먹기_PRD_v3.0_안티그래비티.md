# 버스정류장 땅따먹기 — PRD v3.0 · Antigravity 빌드 스펙 (정본)

> 목적: **안티그래비티(Antigravity)로 전부 개발**하기 위한 실행 스펙. 모듈별로 프롬프트에 넣어 순서대로 빌드·검증.
> 스택: 반응형 웹 · Firebase(Hosting/Firestore/Functions) · TAGO API · Kakao 공유 · (후행) 앱인토스
> 이전 v0.1~v2.1 결정 통합 + 신규(난이도 3단계 / 카톡 공유 / 난이도별 랭킹 / 랭킹1위 고스트).

---

## 1. 제품 요약 (1장)
- **무엇:** 서울 시내버스 노선의 정류장을 리빌 방식으로 가장 빨리 입력해 완주 → (노선×난이도)별 1위 = 점령. 뺏김·고스트·공유로 경쟁/바이럴.
- **디자인:** 도트(픽셀) 아트 + 노선 타입별 컬러(간선 파랑/지선 초록/광역 빨강/순환 노랑). **타이핑 대상 글자만 가독 산세리프.**
- **인증:** 하이브리드(익명 즉시 시작 + 닉네임+코드 저장/복원).
- **수익:** 웹=재도전 전면광고+정류장 직접 스폰서 / 앱인토스=IAA 리워드(후행, 최고 RPM).

---

## 2. 기술 스택 & 프로젝트 구조 (Antigravity 스캐폴딩)
```
/ (반응형 웹, Firebase Hosting)
  index.html
  /src
    /screens   home / auth / routeSearch / routeDetail / difficulty / game / result / share
    /game      revealEngine.js (리빌·타이머·splits) / ghost.js (고스트 재생)
    /lib       firebase.js / auth.js(익명+코드) / api.js(Firestore 읽기) / kakao.js(공유)
    /ui        pixel components (도트 프레임/버튼/버스/정류장/깃발), theme.js(타입컬러)
  /functions   (Firebase Functions)
    tagoSync.js        // TAGO→Firestore 캐싱
    authCode.js        // 닉네임+코드 검증→Custom Token
    submitScore.js     // best/splits+점령+challengerCount (난이도별)
    createChallenge.js // 공유 도전장 생성
```
- 상태: 클라 React 또는 바닐라(안티그래비티 판단), CSS 변수 하나로 타입컬러 테마 전환.

---

## 3. 준비물 (환경 변수·키)
- [ ] TAGO 서비스키 (data.go.kr/15098529)
- [ ] Firebase 프로젝트: Hosting·Firestore + **Functions=Blaze 플랜(카드 등록)**
- [ ] **Kakao Developers 앱 → JavaScript 키**(카톡 공유용)
- [ ] (선택) 애드센스 승인 / 커스텀 도메인
- `.env`: TAGO_KEY, KAKAO_JS_KEY, FIREBASE_CONFIG…

---

## 4. 데이터 모델 (Firestore) — 난이도 차원 포함
```
routes/{routeId}                       // 정적(TAGO 캐시)
  routeNo, routeType(→테마색), cityCode, cityName, startNode, endNode
  stops:[{seq,name}], stopCount

boards/{routeId}__{diff}               // 동적, diff ∈ easy|mid|full
  routeId, difficulty, playCount(=정류장수), 
  occupantUid, occupantNick, bestMs, bestSplits[], occupiedSince,
  challengerCount

boards/{routeId}__{diff}/scores/{uid}
  nickname, bestMs, bestSplits[], updatedAt

users/{uid}   nickname(유일), codeHash, homeRouteId?, createdAt
nicknames/{nickname} -> uid            // 유일성

challenges/{challengeId}               // 카톡 공유 도전장
  routeId, difficulty, fromNick, splits[], totalMs, createdAt
```
- **핵심:** 랭킹·참여자·점령이 모두 **(노선 × 난이도)** 단위 = `boards/{routeId}__{diff}`.

---

## 5. 난이도 3단계 (신규)
| 난이도 | 정류장 범위 | 계산 |
|--------|-------------|------|
| 초급 | **50%** | `playCount = ceil(stopCount * 0.5)` |
| 중급 | **80%** | `ceil(stopCount * 0.8)` |
| 고급 | **100%** | `stopCount` |
- 플레이 = 기점부터 `stops[0 … playCount-1]` 순서대로.
- 각 난이도는 **독립된 board**(랭킹·참여자·점령·고스트 분리).
- 부수효과: 초급=짧아 피로↓·진입↑, 고급=완주 도전. 노선 1개가 점령지 3개.

---

## 6. 화면 & 플로우
```
[홈(픽셀)] → 시작하기
   → [인증] (신규 닉네임+코드 / 기존 로그인 / 게스트 익명)
   → [노선 검색] 번호 입력 → 후보(기점/종점/타입)
   → [노선 상세] 난이도 탭(초/중/고)마다: 점령자·N일점령·Top10·참여자수
   → [난이도 선택] + [고스트 모드: 랭킹1위 / 내최고 / 친구]
   → [게임(리빌+고스트)] 
   → [결과] 점령 갱신 → [카톡 공유][재도전(전면광고)][나가기]
```

---

## 7. 기능별 스펙 + 수용 기준(Acceptance)

### F-A 인증 (하이브리드)
- 익명 진입 즉시 플레이. 닉네임+코드(특수문자+영대소문자+숫자, 8자+) 생성/로그인.
- 코드=해시 저장, 로그인=닉네임+코드, 검증 Function→Custom Token→안정 uid.
- ✅ 다른 기기에서 코드로 동일 닉네임 복원.

### F-B 노선 검색
- 번호 입력 → `routes` where routeNo == 입력 → 후보(기점/종점/타입색) → 선택.
- ✅ 6642 입력 시 해당 노선 상세 진입.

### F-C 노선 상세 (난이도별)
- 난이도 탭 3개. 각 탭 = 해당 board: 점령자 닉네임·기록, **2일↑ 점령 시 "N일째 점령 중"**, Top10, **총 참여자수**.
- ✅ 초/중/고 탭마다 랭킹·참여자가 다르게 표시.

### F-D 게임 (리빌 + 고스트)
- `stops[0..playCount-1]` 리빌: 버스 이동+정류장 등장, 정확 입력 시 자동 진행(엔터 불필요), 정류장별 splits 기록.
- **고스트 모드 선택:**
  - **랭킹 1위**: `boards/{routeId}__{diff}.bestSplits` 재생 (챔피언과 대결) ← 기본
  - 내 최고 / 친구(공유 링크 `challenges.splits`)
  - 연한 버스로 재생 + 앞섬/뒤처짐 실시간.
- ✅ 고스트 모드 시 1위 입력이 고스트로 나타남.

### F-E 결과 · 점령 (submitScore Function)
- 입력: uid, routeId, diff, totalMs, splits.
- scores 갱신(최고 시) → board 1위 재계산: `totalMs < board.bestMs`면 점령자/bestMs/bestSplits 교체, **점령자 변경 시 occupiedSince=now**. 신규 도전자면 challengerCount+1.
- ✅ 1위 갱신 시 점령 표시, N일 계산 정확.

### F-F 카톡 공유 (신규)
- 완주 결과 → 공유하기 → `createChallenge`로 도전장 저장(routeId,diff,fromNick,splits,totalMs) → **Kakao JS SDK 공유(sendDefault, feed 템플릿)**.
  - **썸네일:** 도전장 픽셀 카드(버스+깃발+"도전장"+노선/난이도). MVP=브랜드 정적 이미지, MVP+1=기록 박은 동적 OG 이미지.
  - **제목:** 예 `[6642 · 고급] 도전장 도착 🚌`
  - **설명(도전 유발):** 예 `내 기록 42.31초. 이 노선의 주인, 이길 수 있어?`
  - **버튼/링크:** `https://도메인/?c={challengeId}` → 진입 시 그 난이도·발신자 고스트로 시작.
- 정확한 API는 Kakao Developers "메시지/공유(카카오톡 공유)" 문서 기준(안티그래비티 구현).
- ✅ 카톡으로 썸네일+도전 문구+링크가 전송되고, 링크 진입 시 해당 난이도 고스트 대결 시작.

### F-G 수익화
- 재도전 = **전면광고**(X/닫기와 "다시 도전" 분리, 2~3회당 1회, 오버레이 금지) / 배너(선택) / 정류장 패널(하우스→직접 스폰서). 리워드는 앱인토스 후행.
- 가드레일: 실수 클릭 유도 배치 금지(무효 클릭=정지).

---

## 8. 데이터 파이프라인 (tagoSync Function)
- 도시코드→노선번호목록→노선별경유정류소목록→노선정보(타입) 수집 → `routes` 캐싱.
- ⚠️ TAGO는 http → 반드시 Function에서 호출(클라 직접 금지), 클라는 Firestore(https) 읽기.
- ✅ 대상 도시 노선/정류소/타입 캐싱 확인.

---

## 9. 보안 규칙
- `routes` 읽기공개/쓰기Function. `boards`·`scores`·challengerCount 쓰기=submitScore Function만. `users` 본인만. `nicknames` 유일성 Function. `challenges` 인증유저 생성·읽기공개.
- 랭킹 조작 방지: 점수는 Function 경유 + 기본 sanity 체크(비정상 ms 컷).

---

## 10. 디자인 (도트 + 타입컬러)
- 홈: 귀여운 버스+정류장+**깃발 꽂은 사람**+시작하기(픽셀). 
- 게임: 다크 집중 톤 + 픽셀 버스/정류장/광고 패널, 타입컬러 테마. **정류장명·입력창만 가독 폰트.**
- 픽셀 폰트(예: Galmuri) = 타이틀·버튼·라벨.

---

## 11. 빌드 순서 (Antigravity · 모듈 단위, 각 ✅ 통과 후 진행)
0. **준비:** TAGO키·Firebase(Blaze)·Kakao키 발급
1. **tagoSync** → `routes` 캐싱 ✅
2. **게임 엔진(F-D)** 리빌+splits, 하드코딩 노선으로 ✅ → `routes` 연동
3. **난이도(F-5)** playCount 분기 + 난이도 선택 UI ✅
4. **인증(F-A)** 익명+코드 Function ✅
5. **submitScore(F-E)** board 난이도별 점령·참여자 ✅
6. **노선 상세(F-C)** 난이도 탭 랭킹/참여자/N일 ✅
7. **고스트(F-D)** 랭킹1위/내최고/친구 재생 ✅
8. **카톡 공유(F-F)** createChallenge + Kakao 공유 + 링크 진입 ✅
9. **수익화(F-G)** 재도전 전면광고 + 정류장 패널 ✅
10. **홈·도트 UI(§10)** + 온보딩·안내문구 ✅
11. **배포** Firebase Hosting(+도메인)
12. **(후행) 앱인토스 래핑** 로그인/리워드/푸시 스왑

---

## 12. 도메인 · 배포 (비개발자)
- 도메인: 가비아/Cloudflare 등 연 1~2만 원 → Firebase Hosting "맞춤 도메인" → DNS(A/TXT) 입력 → SSL 자동. 없으면 `프로젝트.web.app`로 선배포.
- 배포: 안티그래비티 빌드 → `firebase deploy`(Hosting+Functions) → 자동 게시. 수정 후 재배포 즉시 반영.
- 비용감(소규모): Hosting/Firestore/Functions 무료 한도, TAGO·Kakao 무료, 도메인만 소액.

---

## 13. 로드맵
- **MVP(웹):** §11의 1~11 — 난이도3·난이도별 랭킹/점령·고스트(1위)·카톡 공유·재도전 전면광고·도트 홈·배포.
- **MVP+1:** 뺏김 알림, 라이브 동시 도전자, 동적 OG 썸네일, 리그/시즌, 정류장 직접 스폰서.
- **Phase 2(TBD):** 세력(팩션) · 앱인토스 IAA 리워드·푸시.

---

## 14. 오픈 이슈
1. TAGO 지자체 커버리지·노선타입 코드 매핑 실호출 검증.
2. 난이도 초급 50%가 너무 짧은 초단거리 노선 처리(최소 정류장 하한 예: 5).
3. 카톡 동적 썸네일(OG 이미지) 시점(MVP 정적 → MVP+1 동적).
4. 전면광고 빈도 리텐션 A/B.
5. 치팅 방지 강도(기본 sanity → 추후 강화).
