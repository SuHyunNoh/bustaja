// ==========================================================================
// 버스타자 (BusTaja) — 홈 화면 (HomeScreen.js)
// 버스 성격별(간선:파랑, 지선:초록, 광역:빨강, 순환:노랑) 색상 구분 적용
// ==========================================================================

import { getLongestOccupantNews, getBoardByRouteAndDiff, getBusBadgeInfo, syncCloudBoardsToLocal } from "../lib/api.js";
import { fetchBoardDirectFromSupabase } from "../lib/supabase.js";
import { LOCAL_ROUTES } from "../data/routes.js";
import { showFaqModal } from "../ui/modal.js";
import { renderAuthModal } from "./AuthScreen.js";

export function renderHomeScreen(container, { onStartClick, onAuthClick, onSelectRoute, currentUser }) {
  const topNews = getLongestOccupantNews();

  // 1. 전체 노선 DB 중 정류장 20개 초과(stopCount > 20) 노선만 핫 노선 후보 추출
  const eligibleRoutes = LOCAL_ROUTES.filter(r => r.stopCount > 20);

  function getHotRoutes() {
    const routeStats = eligibleRoutes.map(route => {
      const board = getBoardByRouteAndDiff(route.routeId, "easy");
      const isOccupied = board && board.bestMs !== null;
      const challengers = board ? (board.challengerCount || 0) : 0;
      const badgeInfo = getBusBadgeInfo(route.routeNo, route.routeType);

      return {
        routeId: route.routeId,
        routeNo: route.routeNo,
        type: badgeInfo.label,
        badgeClass: badgeInfo.badgeClass,
        occupant: isOccupied ? board.occupantNick : "미점령 (첫 영주 도전!)",
        challengers,
        bestMs: isOccupied ? board.bestMs : 999999999,
        diffSec: isOccupied ? `${(board.bestMs / 1000).toFixed(2)}초 기록` : "첫 점령 기회",
        status: isOccupied ? "🔥 영주 사수 중" : "✨ 첫 영주 선점 가능!"
      };
    });

    routeStats.sort((a, b) => {
      if (b.challengers !== a.challengers) return b.challengers - a.challengers;
      return a.bestMs - b.bestMs;
    });

    return routeStats.slice(0, 5);
  }

  function renderHotRoutesHTML(routes) {
    return routes.map((r, idx) => `
      <div class="hot-route-item" data-route-id="${r.routeId}">
        <div class="hot-route-left">
          <span class="hot-rank-badge">${idx + 1}위</span>
          <div class="hot-route-info">
            <div class="hot-route-title">
              <span class="bus-badge ${r.badgeClass}" style="font-size: 11px; padding: 2px 6px;">${r.routeNo}번</span>
              <span>👑 ${r.occupant}</span>
            </div>
            <div class="hot-route-meta">
              도전자 ${r.challengers}명 참가 · ${r.diffSec}
            </div>
          </div>
        </div>
        <div class="hot-fight-status">
          ${r.status}
        </div>
      </div>
    `).join('');
  }

  const initialHotRoutes = getHotRoutes();

  container.innerHTML = `
    <div class="screen-container home-screen">
      <div class="hero-section">
        <!-- 버스타자 실시간 시내버스 속보 티커 -->
        <div class="pixel-news-ticker" style="width: 100%;">
          <span>📰</span>
          <span id="home-news-text" style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
            ${topNews.isDefault 
              ? '[시내버스 속보] 6642번 노선을 완주하고 첫 번째 영주가 되어보세요! ✨' 
              : `[시내버스 속보] ${topNews.routeNo}번 노선, '${topNews.occupantNick}' 님 ${topNews.occupiedDays}일째 장기 점령 중! ✨`}
          </span>
        </div>

        <!-- 버스 기사님 마스코트 말풍선 -->
        <div style="margin-bottom: 10px; width: 100%; text-align: left;">
          <div class="pixel-bubble">
            <span>🚌👨‍✈️ 버스 기사님: "버스타자! 타자로 정류장을 입력하고 노선의 주인이 되어보세요!"</span>
          </div>
        </div>
        
        <h1 class="game-title-lg">버스타자 🚌<br><span style="font-size: 18px; color: var(--pixel-mint);">— 정류장 땅따먹기 🚩</span></h1>
        <p class="game-subtitle">서울·경기 버스 노선을 타이핑하고 최고의 영주가 되어라!</p>

        <!-- 픽셀 스테이지 애니메이션 -->
        <div class="pixel-stage">
          <div class="pixel-cloud cloud-1"></div>
          <div class="pixel-cloud cloud-2"></div>

          <div class="pixel-stop-post">
            <div class="pixel-stop-sign">정류장</div>
            <div class="pixel-flag flag-wave">🚩</div>
          </div>
          <div class="stage-road">
            <div class="stage-road-line"></div>
            <div class="pixel-bus-animated bus-bounce">
              <div class="pixel-bus-window"></div>
              <div class="pixel-bus-wheel-1"></div>
              <div class="pixel-bus-wheel-2"></div>
            </div>
          </div>
        </div>

        <!-- 버스 노선 빠른 검색창 -->
        <div class="pixel-box" style="width: 100%; margin-bottom: 16px; text-align: left;">
          <div style="font-size: 12px; font-weight: bold; color: var(--pixel-yellow); margin-bottom: 8px;">
            🔍 내가 타는 버스 노선 검색하기
          </div>
          <div class="search-bar-wrapper" style="margin-bottom: 0;">
            <input id="home-quick-search-input" class="pixel-input" type="text" placeholder="버스 번호 입력 (예: 146, 6642, 6631, 7770)">
            <button id="btn-home-quick-search" class="pixel-btn btn-mint">검색</button>
          </div>
        </div>

        <!-- 🔥 동적 실시간 대표 인기 노선 점령 현황 -->
        <div class="hot-routes-box" style="width: 100%;">
          <div style="font-size: 13px; font-weight: bold; color: var(--pixel-yellow); margin-bottom: 10px; display: flex; justify-content: space-between; align-items: center;">
            <span>🔥 실시간 인기 점령 노선 TOP 5</span>
            <span style="font-size: 10px; color: var(--pixel-mint);">실시간 유저 참여 순위 반영 ⚡</span>
          </div>

          <div id="hot-routes-list-container" style="display: flex; flex-direction: column;">
            ${renderHotRoutesHTML(initialHotRoutes)}
          </div>
        </div>

        <!-- ❓ 자주 묻는 질문 FAQ 패널 -->
        <div class="pixel-box" style="width: 100%; margin-bottom: 16px; text-align: left; background: var(--pixel-bg-card-light);">
          <div style="font-size: 13px; font-weight: bold; color: var(--pixel-yellow); margin-bottom: 8px; display: flex; justify-content: space-between; align-items: center;">
            <span>❓ 자주 묻는 질문 (FAQ) & 게임 가이드</span>
            <button id="btn-open-faq-modal" style="background: none; border: none; color: var(--pixel-mint); font-size: 11px; cursor: pointer; text-decoration: underline;">
              전체 FAQ 모달 보기 ➔
            </button>
          </div>

          <div style="font-size: 12px; color: var(--text-muted); display: flex; flex-direction: column; gap: 8px; line-height: 1.4;">
            <div style="background: var(--pixel-bg-input); padding: 8px 10px; border-radius: 4px; border: 1px solid #110e17;">
              <strong style="color: #fff;">Q. 버스타자(BusTaja)는 무료인가요?</strong><br>
              A. 100% 무료 게임으로 로그인 없이 누구나 정류장을 타이핑하고 점령전에 참여하실 수 있습니다.
            </div>
            <div style="background: var(--pixel-bg-input); padding: 8px 10px; border-radius: 4px; border: 1px solid #110e17;">
              <strong style="color: #fff;">Q. 오타를 방지하려면 어떻게 하나요?</strong><br>
              A. 한글 입력 오타 방지를 위해 정류장 입력 후 <span style="color: var(--pixel-yellow); font-weight: bold;">Enter(엔터) 키</span>를 눌러 제출하도록 설계되어 있습니다.
            </div>
          </div>
        </div>
      </div>

      <!-- 하단 액션 버튼 -->
      <div style="width: 100%; display: flex; flex-direction: column; gap: 12px; margin-top: 10px;">
        <button id="btn-press-start" class="pixel-btn btn-accent" style="width: 100%; font-size: 18px; padding: 16px;">
          🎮 전체 버스 노선 둘러보기 / 검색
        </button>
        <button id="btn-auth-open" class="pixel-btn btn-ghost" style="width: 100%;">
          👤 계정 / 닉네임 설정 (${currentUser.nickname})
        </button>
      </div>
    </div>
  `;

  // 핫 노선 항목에 클라이어트 이벤트 연결 보조 함수
  function bindHotRouteEvents() {
    container.querySelectorAll(".hot-route-item").forEach(item => {
      item.addEventListener("click", () => {
        clearInterval(newsInterval);
        const routeId = item.dataset.routeId;
        if (onSelectRoute) onSelectRoute(routeId);
      });
    });
  }

  bindHotRouteEvents();

  // Supabase 비동기 동기화 완료 시 핫 노선 부분 DOM 갱신 (화면 멈춤 없이 100% 안전!)
  syncCloudBoardsToLocal().then(updated => {
    if (updated) {
      const updatedHotRoutes = getHotRoutes();
      const listEl = container.querySelector("#hot-routes-list-container");
      if (listEl) {
        listEl.innerHTML = renderHotRoutesHTML(updatedHotRoutes);
        bindHotRouteEvents();
      }
      const newsEl = container.querySelector("#home-news-text");
      if (newsEl) {
        const updatedNews = getLongestOccupantNews();
        newsEl.textContent = updatedNews.isDefault 
          ? '[시내버스 속보] 6642번 노선을 완주하고 첫 번째 영주가 되어보세요! ✨' 
          : `[시내버스 속보] ${updatedNews.routeNo}번 노선, '${updatedNews.occupantNick}' 님 ${updatedNews.occupiedDays}일째 장기 점령 중! ✨`;
      }
    }
  });

  const newsInterval = setInterval(() => {
    const updatedNews = getLongestOccupantNews();
    const newsTickerEl = container.querySelector("#home-news-text");
    if (newsTickerEl) {
      newsTickerEl.textContent = updatedNews.isDefault 
        ? '[시내버스 속보] 6642번 노선을 완주하고 첫 번째 영주가 되어보세요! ✨' 
        : `[시내버스 속보] ${updatedNews.routeNo}번 노선, '${updatedNews.occupantNick}' 님 ${updatedNews.occupiedDays}일째 장기 점령 중! ✨`;
    }
  }, 3600000);

  // 4초 간격 클라우드 Direct Fetch (A안: 핫 노선 상위 5개 클라우드 1등/도전자 수 즉시 실시간 반영)
  const refreshHotRoutesDirectFromCloud = async () => {
    try {
      await syncCloudBoardsToLocal();
      const hotList = getHotRoutes();

      // 상위 5개 노선에 대해 클라우드에서 직접 dedup 랭킹 수신
      const cloudPromises = hotList.map(r => fetchBoardDirectFromSupabase(r.routeId, "easy"));
      const cloudBoards = await Promise.all(cloudPromises);

      cloudBoards.forEach((cb, idx) => {
        if (cb && cb.occupantNick) {
          hotList[idx].occupant = cb.occupantNick;
          hotList[idx].challengers = cb.challengerCount || 1;
          if (cb.bestMs) {
            hotList[idx].bestMs = cb.bestMs;
            hotList[idx].diffSec = `${(cb.bestMs / 1000).toFixed(2)}초 기록`;
            hotList[idx].status = "🔥 영주 사수 중";
          }
        }
      });

      const listEl = container.querySelector("#hot-routes-list-container");
      if (listEl) {
        listEl.innerHTML = renderHotRoutesHTML(hotList);
        bindHotRouteEvents();
      }
    } catch (e) {
      console.warn("[HomeScreen Cloud Refresh Warn]", e);
    }
  };

  // 즉시 1회 실행 후 4초 폴링
  refreshHotRoutesDirectFromCloud();
  const liveSyncInterval = setInterval(refreshHotRoutesDirectFromCloud, 4000);

  // 이벤트 바인딩 시 인터벌 해제 포함
  const clearAllTimers = () => {
    clearInterval(newsInterval);
    clearInterval(liveSyncInterval);
  };

  container.querySelector("#btn-open-faq-modal").addEventListener("click", () => showFaqModal());

  const quickSearchInput = container.querySelector("#home-quick-search-input");
  const quickSearchBtn = container.querySelector("#btn-home-quick-search");
  const executeQuickSearch = () => {
    clearAllTimers();
    const query = quickSearchInput.value.trim();
    onStartClick(query);
  };

  quickSearchBtn.addEventListener("click", executeQuickSearch);
  quickSearchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") executeQuickSearch();
  });

  container.querySelector("#btn-press-start").addEventListener("click", () => {
    clearAllTimers();
    onStartClick("");
  });

  const authBtn = container.querySelector("#btn-auth-open");
  if (authBtn) {
    authBtn.addEventListener("click", () => {
      clearAllTimers();
      if (onAuthClick) {
        onAuthClick();
      } else {
        renderAuthModal(document.body, {});
      }
    });
  }

  function bindHotRouteEvents() {
    container.querySelectorAll(".hot-route-item").forEach(item => {
      item.addEventListener("click", () => {
        clearAllTimers();
        const routeId = item.dataset.routeId;
        if (onSelectRoute) onSelectRoute(routeId);
      });
    });
  }

  bindHotRouteEvents();
}
