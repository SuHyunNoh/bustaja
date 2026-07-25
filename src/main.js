// ==========================================================================
// 버스타자 (BusTaja) — Main App Router & Entry Point
// 1. URL Hash Router (/#/, /#/search, /#/route/:id, /#/game/:id/:diff, /#/result)
// 2. GA4 페이지 방문 & 주요 이벤트 추적
// 3. 카카오톡 도전장 연동 및 픽셀 HUD 푸터
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
    const loader = document.getElementById("static-loading-screen");
    if (loader && loader.parentNode) {
      loader.parentNode.removeChild(loader);
    }

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

    if (this.appContainer) {
      this.appContainer.appendChild(this.headerSlot);
      this.appContainer.appendChild(this.screenSlot);
    }

    this.currentScreen = "home";
    this.selectedRouteId = "ROUTE_6642";
    this.selectedDifficulty = "easy";
    this.lastGameData = null;
    this.lastBoardData = null;
    
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

      // 4.0 정석 URL 해시변화 감지 리스너 (새로고침/뒤로가기 100% 원천 대응)
      window.addEventListener("hashchange", () => this.handleHashRoute());

      const urlParams = new URLSearchParams(window.location.search);
      const challengeId = urlParams.get("c");

      if (challengeId) {
        this.currentChallengeId = challengeId;
        this.navigate("challenge_entry");
      } else {
        this.handleHashRoute();
      }
    } catch (err) {
      console.error("[App Init Fatal Error]", err);
      try {
        this.navigate("home");
      } catch (e) {}
    }
  }

  handleHashRoute() {
    const hash = window.location.hash || "#/";

    if (hash.startsWith("#/route/")) {
      const routeId = hash.replace("#/route/", "").trim();
      this.selectedRouteId = routeId || "ROUTE_6642";
      this.navigate("detail", {}, false);
    } else if (hash.startsWith("#/game/")) {
      const parts = hash.replace("#/game/", "").split("/");
      this.selectedRouteId = parts[0] || "ROUTE_6642";
      this.selectedDifficulty = parts[1] || "easy";
      this.navigate("game", {}, false);
    } else if (hash.startsWith("#/search")) {
      const query = hash.includes("?q=") ? hash.split("?q=")[1] : "";
      this.navigate("search", { query }, false);
    } else if (hash.startsWith("#/result")) {
      this.navigate("result", {}, false);
    } else {
      this.navigate("home", {}, false);
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
    this.navigate(this.currentScreen, {}, false);
  }

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

  navigate(screenName, params = {}, updateHash = true) {
    this.currentScreen = screenName;
    this.screenSlot.innerHTML = "";

    // 4.0 정석 URL 해시 갱신 (독립적인 Clean URL 분리)
    if (updateHash) {
      if (screenName === "home") window.location.hash = "#/";
      else if (screenName === "search") window.location.hash = `#/search?q=${params.query || ''}`;
      else if (screenName === "detail") window.location.hash = `#/route/${this.selectedRouteId}`;
      else if (screenName === "game") window.location.hash = `#/game/${this.selectedRouteId}/${this.selectedDifficulty}`;
      else if (screenName === "result") window.location.hash = "#/result";
    }

    if (typeof trackPageView === "function") trackPageView(screenName);

    try {
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
            onQuit: () => this.navigate("detail")
          });
          break;

        case "result":
          renderResultScreen(this.screenSlot, {
            routeId: this.selectedRouteId,
            difficulty: this.selectedDifficulty,
            gameData: this.lastGameData || {},
            resultData: this.lastGameData || {},
            isChallengeMatch: this.isChallengeMatch,
            challengeData: this.activeChallengeData,
            onRetry: () => this.navigate("game"),
            onHome: () => this.navigate("home")
          });
          break;

        default:
          this.navigate("home");
      }
    } catch (err) {
      console.error("[Router Execution Error]", screenName, err);
      if (screenName !== "home") this.navigate("home");
    }

    const screenContainer = this.screenSlot.querySelector(".screen-container");
    if (screenContainer) {
      screenContainer.insertAdjacentHTML("beforeend", this.getFooterHTML());
      this.bindFooterEvents(screenContainer);
    }
  }
}

// 클래스 밖 독립된 안전 실행 부트스트랩 (중괄호 매칭 100% 매칭)
try {
  if (!window.__bustaja_app_instance__) {
    window.__bustaja_app_instance__ = new App();
  }
} catch (err) {
  console.error("[App Global Launch Failure]", err);
}
