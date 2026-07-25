// ==========================================================================
// 버스타자 (BusTaja) — 커스텀 레트로 픽셀 모달 팝업 시스템 (modal.js)
// 브라우저 뷰포트 고정(position: fixed) & 배경 스크롤 잠금 지원
// ==========================================================================

export function showPixelAlert(message, title = "🚌 버스타자 알림") {
  const existingModal = document.getElementById("pixel-custom-modal");
  if (existingModal) existingModal.remove();

  // 모달 열릴 때 배경 스크롤 잠금
  document.body.style.overflow = "hidden";

  const modalOverlay = document.createElement("div");
  modalOverlay.id = "pixel-custom-modal";
  modalOverlay.className = "modal-overlay";
  modalOverlay.style.cssText = "position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100vw; height: 100vh; background: rgba(17, 14, 23, 0.88); display: flex; align-items: center; justify-content: center; z-index: 999999; padding: 20px; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);";

  modalOverlay.innerHTML = `
    <div class="modal-box" style="text-align: center; max-width: 360px; border-color: var(--kairo-yellow); background: var(--kairo-bg-card-light); border: 4px solid #110e17; border-radius: 8px; box-shadow: var(--kairo-shadow-lg); padding: 20px;">
      <div style="font-size: 11px; color: var(--kairo-yellow); margin-bottom: 6px;">[${title}]</div>
      <div style="margin-bottom: 12px;">
        <span class="kairo-bubble" style="font-size: 12px; background: #fffbeb; color: #1c1917;">
          🚌👨‍✈️ 버스 기사님 안내
        </span>
      </div>
      <div style="font-size: 14px; color: #fff; line-height: 1.5; margin-bottom: 18px; word-break: keep-all; white-space: pre-wrap;">
${message}
      </div>
      <button id="btn-close-pixel-modal" class="pixel-btn btn-accent" style="width: 100%; padding: 10px; font-size: 14px;">
        확인 (OK)
      </button>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  const closeModal = () => {
    document.body.style.overflow = "";
    if (modalOverlay && modalOverlay.parentNode) {
      modalOverlay.parentNode.removeChild(modalOverlay);
    }
  };

  const closeBtn = modalOverlay.querySelector("#btn-close-pixel-modal");
  closeBtn.addEventListener("click", closeModal);
  modalOverlay.addEventListener("click", (e) => {
    if (e.target === modalOverlay) closeModal();
  });
}

// 개인정보처리방침 팝업 모달 (애드센스 승인 필수 요소)
export function showPrivacyPolicyModal() {
  showPixelAlert(
    `📜 [개인정보처리방침]\n\n1. 개인정보 처리 목적: '버스타자'는 별도의 회원가입 없이 익명 및 닉네임 기반으로 게임 랭킹 서비스와 카카오톡 도전장 대결을 제공합니다.\n\n2. 수집 항목: 유저 지정 닉네임, 완주 소요 시간, 카카오톡 도전장 대결 데이터.\n\n3. 쿠키 및 구글 애드센스: 본 서비스는 구글 애드센스(Google AdSense) 및 Google Analytics를 사용하여 사용자 경험 개선과 맞춤형 광고를 제공할 수 있습니다.`,
    "🔒 개인정보처리방침"
  );
}

// 이용약관 팝업 모달
export function showTermsModal() {
  showPixelAlert(
    `📜 [서비스 이용약관]\n\n1. 서비스 목적: 본 서비스는 서울 및 경기도 시내버스 정류장 이름을 타이핑하여 영역을 점령하는 무료 레트로 웹 게임 서비스입니다.\n\n2. 공정한 게임 이용: 매크로나 자동 타이핑 프로그램을 사용한 비정상적인 기록 제출 시 랭킹에서 제외될 수 있습니다.\n\n3. 서비스 변경: 본 서비스는 성능 개선 및 보완을 위해 사전 고지 없이 업데이트될 수 있습니다.`,
    "📜 서비스 이용약관"
  );
}

// FAQ 및 이용안내 팝업 모달
export function showFaqModal() {
  showPixelAlert(
    `❓ [자주 묻는 질문 & 이용 안내]\n\nQ. 버스타자는 무료인가요?\nA. 100% 무료로 별도 가입 없이 바로 이용 가능합니다.\n\nQ. 타자 속도는 어떻게 측정되나요?\nA. 첫 번째 정류장 글자를 칠 때부터 완성 엔터(Enter) 제출 시점까지의 시간이 측정됩니다.\n\nQ. 카카오톡 대결은 어떻게 하나요?\nA. 게임 완주 후 '카카오톡 도전장 보내기'를 누르고 친구에게 링크를 전달하면 1:1 고스트 레이스가 시작됩니다.`,
    "❓ FAQ & 이용안내"
  );
}

// 모바일 재도전 전면 광고 브릿지 모달 (Rewarded Interstitial Ad Flow)
export function showInterstitialAdModal(onAdComplete) {
  const existingModal = document.getElementById("pixel-custom-modal");
  if (existingModal) existingModal.remove();

  document.body.style.overflow = "hidden";

  const modalOverlay = document.createElement("div");
  modalOverlay.id = "pixel-custom-modal";
  modalOverlay.className = "modal-overlay";
  modalOverlay.style.cssText = "position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100vw; height: 100vh; background: rgba(17, 14, 23, 0.94); display: flex; align-items: center; justify-content: center; z-index: 999999; padding: 20px; backdrop-filter: blur(6px); -webkit-backdrop-filter: blur(6px);";

  let countdownSec = 3;

  modalOverlay.innerHTML = `
    <div class="modal-box" style="text-align: center; width: 100%; max-width: 360px; border-color: var(--pixel-yellow); background: var(--pixel-bg-card-light); border: 4px solid #110e17; border-radius: 10px; box-shadow: var(--pixel-shadow-lg); padding: 24px 20px;">
      <div style="font-size: 11px; color: var(--pixel-yellow); margin-bottom: 8px; font-weight: bold;">
        🎬 SPONSOR AD (모바일 스폰서 전면 광고)
      </div>
      
      <div style="background: var(--pixel-bg-input); border: 2px dashed #4c4463; border-radius: 6px; padding: 18px 12px; margin-bottom: 16px;">
        <div style="font-size: 28px; margin-bottom: 6px; animation: flagWave 0.6s infinite;">📺⚡</div>
        <div style="font-size: 13px; font-weight: bold; color: #ffffff; margin-bottom: 4px;">
          구글 AdSense / 토스 스폰서 배너
        </div>
        <div style="font-size: 11px; color: var(--text-muted);">
          ☕ 픽셀카페 신도림점 — 완주 축하 아메리카노 10% 할인 쿠폰
        </div>
      </div>

      <div style="font-size: 13px; color: var(--pixel-mint); font-weight: bold; margin-bottom: 16px;">
        광고 시청 후 게임이 시작됩니다 (<span id="ad-countdown-text">${countdownSec}</span>초...)
      </div>

      <button id="btn-close-ad-modal" class="pixel-btn btn-accent" style="width: 100%; padding: 12px; font-size: 15px; opacity: 0.7;" disabled>
        ⏱️ 광고 시청 중... (${countdownSec}s)
      </button>
    </div>
  `;

  document.body.appendChild(modalOverlay);

  const closeBtn = modalOverlay.querySelector("#btn-close-ad-modal");
  const countText = modalOverlay.querySelector("#ad-countdown-text");

  const finishAd = () => {
    clearInterval(timerId);
    document.body.style.overflow = "";
    if (modalOverlay && modalOverlay.parentNode) {
      modalOverlay.parentNode.removeChild(modalOverlay);
    }
    if (typeof onAdComplete === "function") {
      onAdComplete();
    }
  };

  const timerId = setInterval(() => {
    countdownSec--;
    if (countText) countText.textContent = countdownSec;
    if (closeBtn) closeBtn.textContent = `⏱️ 광고 시청 중... (${countdownSec}s)`;

    if (countdownSec <= 0) {
      clearInterval(timerId);
      if (countText) countText.textContent = "0";
      if (closeBtn) {
        closeBtn.disabled = false;
        closeBtn.style.opacity = "1";
        closeBtn.textContent = "▶ 닫기 & 즉시 재도전 시작";
      }
    }
  }, 1000);

  closeBtn.addEventListener("click", () => {
    if (!closeBtn.disabled) {
      finishAd();
    }
  });
}
