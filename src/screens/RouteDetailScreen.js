// ==========================================================================
// 버스타자 — 노선 상세 & 난이도 3단계 선택 (RouteDetailScreen.js)
// 버스 성격별(간선:파랑, 지선:초록, 광역:빨강, 순환:노랑) 색상 구분 적용
// ==========================================================================

import { getRouteById, getBoardByRouteAndDiff, getBoardByRouteAndDiffAsync, getBusBadgeInfo } from "../lib/api.js";

export function renderRouteDetailScreen(container, { routeId, onStartGame, onBack }) {
  const route = getRouteById(routeId);
  if (!route) return;

  let currentDiff = "easy";
  let currentGhostMode = "rank1";

  function updateView() {
    const board = getBoardByRouteAndDiff(routeId, currentDiff);
    const badgeInfo = getBusBadgeInfo(route.routeNo, route.routeType);
    const bestSecStr = board.bestMs ? (board.bestMs / 1000).toFixed(2) + "초" : "기록 없음";

    container.innerHTML = `
      <div class="screen-container">
        <!-- 상단 헤더 -->
        <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px;">
          <button id="btn-detail-back" class="pixel-btn btn-ghost" style="padding: 6px 12px; font-size: 12px;">
            ← 노선 목록
          </button>
          <span class="bus-badge ${badgeInfo.badgeClass}">${route.routeNo}번 (${badgeInfo.label})</span>
        </div>

        <div style="text-align: center; margin-bottom: 14px;">
          <h2 style="font-size: 24px; color: #fff;">${route.routeNo}번 땅따먹기</h2>
          <div style="font-size: 12px; color: var(--text-muted); margin-top: 4px;">
            ${route.startNode} ↔ ${route.endNode} (총 ${route.stopCount}개 정류장)
          </div>
        </div>

        <!-- 버스타자 픽셀 배너 구좌 -->
        <div class="pixel-banner-slot">
          <div class="banner-content">
            <span style="font-size: 16px;">🚌⚡</span>
            <span>오늘도 안전운행! <strong>${route.routeNo}번</strong> 정류장을 정확하게 타격하고 첫 영주가 되어보세요! 🚩</span>
          </div>
        </div>

        <!-- 난이도 3단계 탭 -->
        <div class="difficulty-tabs">
          <button class="diff-tab ${currentDiff === 'easy' ? 'active' : ''}" data-diff="easy">
            🌱 초급 (50%)<br><span style="font-size: 10px; font-weight: normal;">${Math.ceil(route.stopCount * 0.5)}개 정류장</span>
          </button>
          <button class="diff-tab ${currentDiff === 'mid' ? 'active' : ''}" data-diff="mid">
            ⚡ 중급 (80%)<br><span style="font-size: 10px; font-weight: normal;">${Math.ceil(route.stopCount * 0.8)}개 정류장</span>
          </button>
          <button class="diff-tab ${currentDiff === 'hard' ? 'active' : ''}" data-diff="hard">
            🔥 고급 (100%)<br><span style="font-size: 10px; font-weight: normal;">${route.stopCount}개 완주</span>
          </button>
        </div>

        <!-- 현재 난이도 점령자 카드 -->
        <div class="occupant-banner">
          <div class="occupant-title">👑 이 난이도의 영주 (현재 점령자)</div>
          <div id="detail-occupant-name" class="occupant-name">${board.occupantNick}</div>
          <div class="occupant-meta">
            <span id="detail-best-sec">⏱️ 1위 기록: <strong>${bestSecStr}</strong></span>
            ${board.occupiedDays > 0 ? `<span class="days-occupied-badge">${board.occupiedDays}일째 점령 중</span>` : ''}
          </div>
        </div>

        <!-- 고스트 대결 선택 -->
        <div class="pixel-box ghost-select-box">
          <div style="font-size: 12px; color: var(--pixel-yellow); margin-bottom: 8px;">
            👻 고스트 모드 선택 (실시간 대결)
          </div>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <label style="font-size: 13px; display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="radio" name="ghost-mode" value="rank1" ${currentGhostMode === 'rank1' ? 'checked' : ''}>
              <span>🥇 1위 고스트 (${board.occupantNick}와 대결)</span>
            </label>
            <label style="font-size: 13px; display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="radio" name="ghost-mode" value="mybest" ${currentGhostMode === 'mybest' ? 'checked' : ''}>
              <span>👤 내 최고 기록 고스트</span>
            </label>
            <label style="font-size: 13px; display: flex; align-items: center; gap: 8px; cursor: pointer;">
              <input type="radio" name="ghost-mode" value="friend" ${currentGhostMode === 'friend' ? 'checked' : ''}>
              <span>⚔️ 친구 도전장 고스트</span>
            </label>
          </div>
        </div>

        <!-- Top 10 랭킹 -->
        <div class="pixel-box" style="margin-bottom: 12px;">
          <div style="font-size: 12px; color: var(--pixel-yellow); margin-bottom: 10px; display: flex; justify-content: space-between;">
            <span>🏆 Top 10 랭킹</span>
            <span id="detail-challenger-count">도전자 ${board.challengerCount || 0}명</span>
          </div>

          <div id="detail-leaderboard-list" class="leaderboard-scrollbox">
            ${(board.scores && board.scores.length > 0) ? board.scores.map(s => `
              <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; border-bottom: 1px dashed var(--border-pixel-highlight);">
                <span style="color: ${s.rank === 1 ? 'var(--pixel-yellow)' : '#fff'}; font-weight: ${s.rank === 1 ? 'bold' : 'normal'};">
                  ${s.rank === 1 ? '🥇' : s.rank === 2 ? '🥈' : s.rank === 3 ? '🥉' : s.rank + '.'} ${s.nickname}
                </span>
                <span style="color: var(--pixel-mint); font-family: monospace;">${(s.bestMs / 1000).toFixed(2)}s</span>
              </div>
            `).join('') : '<div style="font-size: 12px; color: var(--text-muted); text-align: center; padding: 12px 0;">아직 등록된 기록이 없습니다. 첫 점령자가 되어보세요!</div>'}
          </div>
        </div>

        <!-- 하단 스티키 고정 시작 버튼 -->
        <div class="sticky-action-footer">
          <button id="btn-start-game" class="pixel-btn btn-accent" style="width: 100%; font-size: 18px; padding: 14px;">
            🚌 점령전 출발하기 (${board.diffSpec.label})
          </button>
        </div>
      </div>
    `;

    // DB에서 최신 점령자 및 랭킹 데이터 비동기(async) 직통 수신 및 3초 실시간 자동 싱크
    const refreshLiveBoard = () => {
      getBoardByRouteAndDiffAsync(routeId, currentDiff).then(liveBoard => {
        if (liveBoard) {
          const occNameEl = container.querySelector("#detail-occupant-name");
          if (occNameEl) occNameEl.textContent = liveBoard.occupantNick;

          const bestSecEl = container.querySelector("#detail-best-sec");
          if (bestSecEl) {
            const liveSecStr = liveBoard.bestMs ? (liveBoard.bestMs / 1000).toFixed(2) + "초" : "기록 없음";
            bestSecEl.innerHTML = `⏱️ 1위 기록: <strong>${liveSecStr}</strong>`;
          }

          const countEl = container.querySelector("#detail-challenger-count");
          if (countEl) countEl.textContent = `도전자 ${liveBoard.challengerCount || 0}명`;

          const listEl = container.querySelector("#detail-leaderboard-list");
          if (listEl) {
            listEl.innerHTML = (liveBoard.scores && liveBoard.scores.length > 0) ? liveBoard.scores.map(s => `
              <div style="display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; border-bottom: 1px dashed var(--border-pixel-highlight);">
                <span style="color: ${s.rank === 1 ? 'var(--pixel-yellow)' : '#fff'}; font-weight: ${s.rank === 1 ? 'bold' : 'normal'};">
                  ${s.rank === 1 ? '🥇' : s.rank === 2 ? '🥈' : s.rank === 3 ? '🥉' : s.rank + '.'} ${s.nickname}
                </span>
                <span style="color: var(--pixel-mint); font-family: monospace;">${(s.bestMs / 1000).toFixed(2)}s</span>
              </div>
            `).join('') : '<div style="font-size: 12px; color: var(--text-muted); text-align: center; padding: 12px 0;">아직 등록된 기록이 없습니다. 첫 점령자가 되어보세요!</div>';
          }
        }
      });
    };

    refreshLiveBoard();
    const liveTimer = setInterval(refreshLiveBoard, 3000);

    // 이벤트 바인딩 시 타이머 해제
    container.querySelector("#btn-detail-back").addEventListener("click", () => {
      clearInterval(liveTimer);
      onBack();
    });

    container.querySelectorAll(".diff-tab").forEach(tab => {
      tab.addEventListener("click", (e) => {
        clearInterval(liveTimer);
        currentDiff = tab.dataset.diff;
        updateView();
      });
    });

    container.querySelectorAll("input[name='ghost-mode']").forEach(radio => {
      radio.addEventListener("change", (e) => {
        currentGhostMode = e.target.value;
      });
    });

    container.querySelector("#btn-start-game").addEventListener("click", () => {
      clearInterval(liveTimer);
      onStartGame({
        routeId,
        difficulty: currentDiff,
        ghostMode: currentGhostMode,
        board
      });
    });
  }

  updateView();
}
