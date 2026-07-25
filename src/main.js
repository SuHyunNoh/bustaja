// ==========================================================================
// 버스정류장 땅따먹기 — Main App Router & Entry Point (v3.0)
// 1. 버스 노선도 UI (Bus Route Map Line)
// 2. GA4 페이지 방문 & 주요 이벤트 추적 (ga.js)
// 3. 카카오톡 도전장 공유 링크(?c=challengeId) 수신 및 대결 / 승패 플로우
// 4. 카이로소프트 프레임 내부 스크롤 하단 푸터 (법적 고지 & FAQ 모달 연동)
// ==========================================================================

import { renderHeaderHUD } from "./ui/components.js";
import { getCurrentUser } from "./lib/auth.js";
import { initGA, trackPageView } from "./lib/ga.js";
import { initKakaoSDK } from "./lib/kakao.js";
import { initSupabase } from "./lib/supabase.js";
import { showPrivacyPolicyModal, showTermsModal, showFaqModal } from "./ui/modal.js";

import { renderHomeScreen } from "./screens/HomeScreen.js";
import { renderAuthModal } from "./screens/AuthScreen.js";
import { renderRouteSearchScreen } from "./screens/RouteSearchScreen.js";
import { renderRouteDetailScreen } from "./screens/RouteDetailScreen.js";
import { renderGameScreen } from "./screens/GameScreen.js";
import { renderResultScreen } from "./screens/ResultScreen.js";
import { renderChallengeEntryScreen } from "./screens/ChallengeEntryScreen.js";

class App {
  constructor() {
    this.appContainer = document.getElementById("app-container");
    if (this.appContainer) {
      this.appContainer.innerHTML = "";
    }
    this.headerSlot = document.createElement("div");
    this.screenSlot = document.createElement("div");
    this.screenSlot.className = "screen-container-wrapper";
    this.screenSlot.style.flex = "1";
    this.screenSlot.style.display = "flex";
    this.screenSlot.style.flexDirection = "column";

    this.appContainer.appendChild(this.headerSlot);
    this.appContainer.appendChild(this.screenSlot);

    this.currentScreen = "home";
    this.selectedRouteId = "ROUTE_6642";
    this.selectedDifficulty = "easy";
    this.lastGameData = null;
    this.lastBoardData = null;
    
    // 친구 도전장 대결 모드 데이터
    this.isChallengeMatch = false;
    this.activeChallengeData = null;

    this.init();
  }

  init() {
    try {
      if (typeof initGA === "function") initGA();
      if (typeof initKakaoSDK === "function") initKakaoSDK();
      if (typeof initSupabase === "function") initSupabase();
    } catch (err) {
      console.warn("[App SDK Init Non-fatal Warn]", err);
    }

    try {
      this.updateHeader();

      const urlParams = new URLSearchParams(window.location.search);
      const challengeId = urlParams.get("c");

      if (challengeId) {
        this.currentChallengeId = challengeId;
        this.navigate("challenge_entry");
      } else {
        this.navigate("home");
      }
    } catch (err) {
      console.error("[App Init Fatal Error]", err);
      // 치명적 에러 발생 시에도 화면 백화 방지 강제 홈 렌더링
      try {
        this.navigate("home");
      } catch (e) {}
    }
  }

  updateHeader() {
    renderHeaderHUD(this.headerSlot, {
      onTitleClick: () => this.navigate("home"),
      onUserClick: () => this.openAuthModal()
    });
  }

  openAuthModal() {
    renderAuthModal(document.body, {
      onClose: () => this.updateHeader(),
      onUserUpdated: () => {
        this.updateHeader();
        this.refreshCurrentScreen();
      }
    });
  }

  refreshCurrentScreen() {
    this.navigate(this.currentScreen);
  }

  // 화면 스크롤 하단에 안전하고 예쁘게 주입하는 픽셀 푸터 HTML
  getFooterHTML() {
    return `
      <footer class="pixel-footer" style="width: 100%; padding: 16px 10px; margin-top: 20px; text-align: center; font-size: 11px; color: var(--text-muted); border-top: 2px dashed #3b354d; background: var(--kairo-bg-input); border-radius: 6px;">
        <div style="margin-bottom: 8px;">
          <a href="#" id="link-privacy-policy" style="color: var(--kairo-yellow); text-decoration: none; margin: 0 4px; font-weight: bold;">개인정보처리방침</a> | 
          <a href="#" id="link-terms-of-service" style="color: var(--kairo-yellow); text-decoration: none; margin: 0 4px; font-weight: bold;">이용약관</a> | 
          <a href="#" id="link-faq-info" style="color: var(--kairo-yellow); text-decoration: none; margin: 0 4px; font-weight: bold;">FAQ / 이용안내</a>
        </div>
        <div>© 2026 버스타자 (BusTaja) All rights reserved.</div>
      </footer>
    `;
  }

  bindFooterEvents(container) {
    const privacyBtn = container.querySelector("#link-privacy-policy");
    const termsBtn = container.querySelector("#link-terms-of-service");
    const faqBtn = container.querySelector("#link-faq-info");

    if (privacyBtn) {
      privacyBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showPrivacyPolicyModal();
      });
    }
    if (termsBtn) {
      termsBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showTermsModal();
      });
    }
    if (faqBtn) {
      faqBtn.addEventListener("click", (e) => {
        e.preventDefault();
        showFaqModal();
      });
    }
  }

  navigate(screenName, params = {}) {
    this.currentScreen = screenName;
    this.screenSlot.innerHTML = "";

    // GA4 화면 방문 기록
    trackPageView(screenName);

    switch (screenName) {
      case "home":
        this.isChallengeMatch = false;
        this.activeChallengeData = null;
        renderHomeScreen(this.screenSlot, {
          onStartClick: (query = "") => {
            this.navigate("search", { query });
          },
          onAuthClick: () => this.openAuthModal(),
          onSelectRoute: (routeId) => {
            this.selectedRouteId = routeId;
            this.navigate("detail");
          },
          currentUser: getCurrentUser()
        });
        break;

      case "search":
        renderRouteSearchScreen(this.screenSlot, {
          initialQuery: params.query || "",
          onSelectRoute: (routeId) => {
            this.selectedRouteId = routeId;
            this.navigate("detail");
          },
          onBack: () => this.navigate("home")
        });
        break;

      case "detail":
        renderRouteDetailScreen(this.screenSlot, {
          routeId: this.selectedRouteId,
          onStartGame: ({ routeId, difficulty, board }) => {
            this.selectedRouteId = routeId;
            this.selectedDifficulty = difficulty;
            this.lastBoardData = board;
            this.isChallengeMatch = false;
            this.activeChallengeData = null;
            this.navigate("game");
          },
          onBack: () => this.navigate("search")
        });
        break;

      case "challenge_entry":
        renderChallengeEntryScreen(this.screenSlot, {
          challengeId: this.currentChallengeId,
          onAcceptChallenge: (challenge) => {
            this.selectedRouteId = challenge.routeId;
            this.selectedDifficulty = challenge.difficulty;
            this.isChallengeMatch = true;
            this.activeChallengeData = challenge;
            this.navigate("game");
          },
          onHome: () => this.navigate("home")
        });
        break;

      case "game":
        renderGameScreen(this.screenSlot, {
          routeId: this.selectedRouteId,
          difficulty: this.selectedDifficulty,
          board: this.lastBoardData || {},
          isChallengeMatch: this.isChallengeMatch,
          challengeData: this.activeChallengeData,
          onGameComplete: (resultData) => {
            this.lastGameData = resultData;
            this.navigate("result");
          },
          onQuit: () => this.navigate(this.isChallengeMatch ? "challenge_entry" : "detail")
        });
        break;

      case "result":
        renderResultScreen(this.screenSlot, {
          routeId: this.selectedRouteId,
          difficulty: this.selectedDifficulty,
          resultData: this.lastGameData,
          isChallengeMatch: this.isChallengeMatch,
          challengeData: this.activeChallengeData,
          onRetry: () => this.navigate("game"),
          onHome: () => this.navigate("home")
        });
        break;

      default:
        this.navigate("home");
    }

    // 모든 화면 하단 스크롤 안쪽에 정갈하게 푸터 주입
    const screenContainer = this.screenSlot.querySelector(".screen-container");
    if (screenContainer) {
      screenContainer.insertAdjacentHTML("beforeend", this.getFooterHTML());
      this.bindFooterEvents(screenContainer);
    }
  }
}

// Launch App (DOM 준비 상태에 관계없이 100% 즉각 인스턴스 실행)
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => new App());
} else {
  new App();
}
