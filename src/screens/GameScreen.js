// ==========================================================================
// 버스정류장 땅따먹기 — 게임 화면 (GameScreen.js)
// 첫 타자 입력 시점부터 타이머 측정 (준비 시간 보장)
// ==========================================================================

import { getRouteById, getDifficultySpec } from "../lib/api.js";
import { RevealEngine } from "../game/revealEngine.js";
import { GhostPlayer } from "../game/ghost.js";
import { trackGAEvent } from "../lib/ga.js";

export function renderGameScreen(container, { routeId, difficulty, board, isChallengeMatch, challengeData, onGameComplete, onQuit }) {
  const route = getRouteById(routeId);
  const diffSpec = getDifficultySpec(route.stopCount, difficulty);
  
  const targetStops = route.stops.slice(0, diffSpec.playCount);
  
  const ghostSplits = isChallengeMatch && challengeData ? challengeData.splits : (board.bestSplits || []);
  const ghostName = isChallengeMatch && challengeData ? challengeData.fromNick : (board.occupantNick || "1위 고스트");
  const ghostPlayer = new GhostPlayer(ghostSplits, targetStops.length);

  trackGAEvent("game_start", {
    route_id: routeId,
    difficulty,
    is_challenge: !!isChallengeMatch
  });

  container.innerHTML = `
    <div class="screen-container" style="justify-content: space-between;">
      <!-- 게임 상단 HUD -->
      <div>
        <div class="game-hud">
          <div>
            <div style="font-size: 11px; color: var(--text-muted);">${route.routeNo}번 · ${diffSpec.label}</div>
            <div id="game-timer" class="timer-display" style="color: var(--kairo-yellow);">READY!</div>
          </div>
          <div id="ghost-delta-badge" class="ghost-delta-badge ahead">
            👻 ${ghostName} 고스트와 실시간 대결!
          </div>
        </div>

        <!-- 수평 프로그레스 트랙 -->
        <div class="race-track-container">
          <div style="display: flex; justify-content: space-between; font-size: 11px; color: var(--text-muted);">
            <span>기점: ${targetStops[0].name}</span>
            <span>종점: ${targetStops[targetStops.length - 1].name}</span>
          </div>

          <div class="track-line">
            <div id="track-progress" class="track-progress-bar"></div>
            <div id="player-bus-icon" class="player-bus-icon" style="left: 0%;">🚌</div>
            <div id="ghost-bus-icon" class="ghost-bus-icon" style="left: 0%;">👻</div>
          </div>

          <div style="display: flex; justify-content: space-between; font-size: 11px;">
            <span id="player-stop-count" style="color: var(--bus-blue);">내 진행: 0 / ${targetStops.length}</span>
            <span id="ghost-stop-count" style="color: var(--text-gold);">고스트(${ghostName}): 0 / ${targetStops.length}</span>
          </div>
        </div>

        <!-- 실제 버스 정류장 노선도 맵 UI (Bus Route Map Line) -->
        <div class="bus-route-map" id="bus-route-map-container">
          <div class="route-map-track">
            <div class="route-map-vertical-line"></div>
            <div class="route-map-progress-line" id="route-map-progress-line"></div>
            
            <div id="route-map-stops-list">
              ${targetStops.map((st, idx) => `
                <div class="route-stop-item ${idx === 0 ? 'active' : ''}" id="map-stop-item-${idx}">
                  <div class="stop-node-dot">${idx + 1}</div>
                  <span class="route-stop-label">${st.name}</span>
                  ${idx === 0 ? '<span class="active-stop-flag-tag">🚩 현재 정류장</span>' : ''}
                </div>
              `).join('')}
            </div>
          </div>
        </div>

        <!-- 현재 타깃 정류장 큰 카드리스트 -->
        <div class="stops-carousel">
          <div id="target-stop-no" class="target-stop-number">정류장 1 / ${targetStops.length}</div>
          <div id="target-stop-name" class="target-stop-name typing-target-font">
            ${targetStops[0].name}
          </div>
          <div id="next-stop-preview" style="font-size: 12px; color: var(--text-muted);">
            다음: ${targetStops[1] ? targetStops[1].name : '종점 도착'}
          </div>
        </div>
      </div>

      <!-- 하단 모바일 타이핑 입력 폼 (키보드 대응 모바일 인풋 최적화) -->
      <div id="mobile-input-section" style="margin-bottom: 12px; transition: transform 0.2s ease;">
        <div style="display: flex; gap: 8px;">
          <input 
            type="text" 
            id="game-typing-input" 
            class="typing-input-large" 
            placeholder="정류장 명칭 입력 후 Enter ↵" 
            autocomplete="off"
            autocorrect="off"
            autocapitalize="off"
            spellcheck="false"
            inputmode="text"
            enterkeyhint="send"
            autofocus
            style="flex: 1; font-size: 18px; height: 52px; font-weight: bold;"
          >
          <button id="btn-submit-stop" class="pixel-btn btn-primary" style="padding: 0 18px; font-size: 16px; height: 52px; min-width: 72px;">
            ↵ 제출
          </button>
        </div>
        
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 8px;">
          <button id="btn-game-quit" class="pixel-btn btn-ghost" style="padding: 6px 12px; font-size: 12px;">
            ✕ 기권하기
          </button>
          <span id="typing-guide-text" style="font-size: 11px; color: var(--kairo-mint); font-weight: bold;">
            📱 첫 글자 타이핑 시 타이머 시작 (한글 자동완성 방지 적용)
          </span>
        </div>
      </div>
    </div>
  `;

  const timerEl = container.querySelector("#game-timer");
  const ghostBadgeEl = container.querySelector("#ghost-delta-badge");
  const progressEl = container.querySelector("#track-progress");
  const mapProgressLineEl = container.querySelector("#route-map-progress-line");
  const playerBusEl = container.querySelector("#player-bus-icon");
  const ghostBusEl = container.querySelector("#ghost-bus-icon");
  const playerStopCountEl = container.querySelector("#player-stop-count");
  const ghostStopCountEl = container.querySelector("#ghost-stop-count");
  
  const targetStopNoEl = container.querySelector("#target-stop-no");
  const targetStopNameEl = container.querySelector("#target-stop-name");
  const nextStopPreviewEl = container.querySelector("#next-stop-preview");
  const inputEl = container.querySelector("#game-typing-input");
  const typingGuideEl = container.querySelector("#typing-guide-text");

  // 엔진 생성
  const engine = new RevealEngine(
    targetStops,
    (state) => {
      // 1. 타이머 업데이트 (시작 전/후 처리)
      if (!state.hasStarted) {
        timerEl.textContent = "READY!";
        timerEl.style.color = "var(--kairo-yellow)";
      } else {
        const totalSec = state.elapsedMs / 1000;
        const mins = Math.floor(totalSec / 60).toString().padStart(2, "0");
        const secs = (totalSec % 60).toFixed(2).padStart(5, "0");
        timerEl.textContent = `${mins}:${secs}`;
        timerEl.style.color = "var(--kairo-mint)";
      }

      // 2. 수평 트랙 & 수직 노선도 맵 위치
      progressEl.style.width = `${state.progressPercent}%`;
      mapProgressLineEl.style.height = `${state.progressPercent}%`;
      playerBusEl.style.left = `${state.progressPercent}%`;
      playerStopCountEl.textContent = `내 진행: ${state.currentIndex} / ${targetStops.length}`;

      // 노선도 맵 스크롤 및 노드 active/passed 처리 (진동 방지: currentIndex 변경 시에만 스크롤)
      targetStops.forEach((_, idx) => {
        const stopItemEl = container.querySelector(`#map-stop-item-${idx}`);
        if (stopItemEl) {
          if (idx < state.currentIndex) {
            stopItemEl.className = "route-stop-item passed";
            const tag = stopItemEl.querySelector(".active-stop-flag-tag");
            if (tag) tag.remove();
          } else if (idx === state.currentIndex) {
            stopItemEl.className = "route-stop-item active";
            if (!stopItemEl.querySelector(".active-stop-flag-tag")) {
              stopItemEl.insertAdjacentHTML("beforeend", '<span class="active-stop-flag-tag">🚩 현재 정류장</span>');
              // 정류장이 다음으로 넘어갔을 때만 1회 부드럽게 스크롤 (매 프레임 연속 호출로 인한 위아래 진동 원천 차단)
              stopItemEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
            }
          } else {
            stopItemEl.className = "route-stop-item";
            const tag = stopItemEl.querySelector(".active-stop-flag-tag");
            if (tag) tag.remove();
          }
        }
      });

      // 3. 고스트 상태 업데이트
      if (state.hasStarted) {
        const ghostStatus = ghostPlayer.getGhostStatus(state.elapsedMs);
        ghostBusEl.style.left = `${ghostStatus.ghostProgressPercent}%`;
        ghostStopCountEl.textContent = `고스트(${ghostName}): ${ghostStatus.ghostIndex} / ${targetStops.length}`;

        const delta = ghostPlayer.getDeltaTime(state.currentIndex, state.elapsedMs);
        if (delta.isAhead) {
          ghostBadgeEl.className = "ghost-delta-badge ahead";
          ghostBadgeEl.textContent = `⚡ 고스트(${ghostName})보다 -${delta.deltaSec}s 앞섬!`;
        } else {
          ghostBadgeEl.className = "ghost-delta-badge behind";
          ghostBadgeEl.textContent = `⚠️ 고스트(${ghostName})보다 +${delta.deltaSec}s 뒤처짐`;
        }
      }

      // 4. 다음 정류장 UI
      if (state.currentStop) {
        targetStopNoEl.textContent = `정류장 ${state.currentIndex + 1} / ${targetStops.length}`;
        targetStopNameEl.textContent = state.currentStop.name;
        nextStopPreviewEl.textContent = state.nextStop 
          ? `다음: ${state.nextStop.name}` 
          : "🚩 완주 직전!";
      }
    },
    (result) => {
      trackGAEvent("game_complete", {
        route_id: routeId,
        difficulty,
        total_ms: result.totalMs
      });
      onGameComplete(result);
    }
  );

  // 모바일 가상 키보드 등장 시 입력창 & 목표 카드 화면 중앙 자동 스크롤
  inputEl.addEventListener("focus", () => {
    setTimeout(() => {
      inputEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 300);
  });

  // 첫 입력(타이핑) 시 타이머 측정 스타트!
  inputEl.addEventListener("input", () => {
    if (!engine.hasStarted && inputEl.value.length > 0) {
      engine.startTimer();
      typingGuideEl.textContent = "📱 Enter 키 / 제출 터치 시 정답 확인";
      typingGuideEl.style.color = "var(--text-gold)";
    }
  });

  // 제출 처리 함수 (Enter 또는 버튼 클릭 시 모바일 최적 조치)
  function handleSubmission() {
    if (!engine.hasStarted) {
      engine.startTimer();
    }
    const val = inputEl.value;
    const res = engine.submitInput(val);
    
    if (res.matched) {
      inputEl.value = "";
      inputEl.classList.remove("input-wrong");
      inputEl.classList.add("input-correct");
      setTimeout(() => inputEl.classList.remove("input-correct"), 200);
    } else if (val.trim().length > 0) {
      inputEl.classList.remove("input-correct");
      inputEl.classList.add("input-wrong");
      
      // 모바일 편의성: 오타 시 텍스트 전체 선택(Quick Re-type)하여 백스페이스 필요 없이 바로 새로 타자 가능!
      inputEl.select();

      setTimeout(() => inputEl.classList.remove("input-wrong"), 300);
    }
  }

  // Enter 키 감지 (모바일 가상 키보드 완료/전송 키)
  inputEl.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSubmission();
    }
  });

  // 제출 버튼 감지
  container.querySelector("#btn-submit-stop").addEventListener("click", () => {
    handleSubmission();
    inputEl.focus();
  });

  container.querySelector("#btn-game-quit").addEventListener("click", () => {
    engine.stop();
    onQuit();
  });

  engine.ready();
  // 모바일 시작 시 자동 포커스
  setTimeout(() => {
    inputEl.focus();
  }, 100);
}
