// ==========================================================================
// 버스타자 (BusTaja) — 익명 + 닉네임/코드 인증 모달 (AuthScreen.js)
// ==========================================================================

import { getCurrentUser, registerOrLoginWithCode } from "../lib/auth.js";

export function renderAuthModal(container, { onClose, onUserUpdated }) {
  // 기존 잔존 모달 중복 생성 방지
  const existingModal = document.getElementById("auth-modal-overlay");
  if (existingModal) existingModal.remove();

  const currentUser = getCurrentUser();

  // 모달 오픈 시 배경 스크롤 잠금
  document.body.style.overflow = "hidden";

  const modalHtml = `
    <div class="modal-overlay" id="auth-modal-overlay" style="position: fixed; top: 0; left: 0; right: 0; bottom: 0; width: 100vw; height: 100vh; background: rgba(17, 14, 23, 0.88); display: flex; align-items: center; justify-content: center; z-index: 99999; padding: 20px; backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);">
      <div class="modal-box" style="width: 100%; max-width: 400px; background: var(--kairo-bg-card-light); border: 4px solid #110e17; border-radius: 8px; box-shadow: var(--kairo-shadow-lg); padding: 20px; text-align: left;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 14px;">
          <h2 style="font-size: 18px; color: var(--kairo-yellow); margin: 0;">👤 계정 / 닉네임 설정</h2>
          <button id="auth-modal-close" style="background: none; border: none; color: #fff; font-size: 22px; cursor: pointer; padding: 4px 8px;">✕</button>
        </div>

        <div style="font-size: 12px; color: var(--text-muted); margin-bottom: 14px; line-height: 1.5;">
          닉네임만 자유롭게 변경하거나, 비밀코드(8자 이상)를 등록해 내 점령 기록과 고스트를 다른 기기에서도 유지하세요!
        </div>

        <div class="pixel-box-inset" style="margin-bottom: 16px; background: var(--kairo-bg-input); border: 2px solid #110e17; border-radius: 6px; padding: 10px 12px;">
          <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 2px;">현재 프로필</div>
          <div style="font-size: 15px; font-weight: bold; color: var(--kairo-mint);">
            ${currentUser.nickname} ${currentUser.isGuest ? '(익명 게스트)' : '✅ (인증 계정)'}
          </div>
        </div>

        <form id="auth-form" style="display: flex; flex-direction: column; gap: 12px;">
          <div>
            <label style="font-size: 12px; color: #fff; display: block; margin-bottom: 4px; font-weight: bold;">닉네임 (2자 이상 필도)</label>
            <input type="text" id="auth-nick-input" class="pixel-input" placeholder="예: 신도림타이핑왕" value="${currentUser.nickname || ''}" style="width: 100%;">
          </div>
          <div>
            <label style="font-size: 12px; color: #fff; display: block; margin-bottom: 4px; font-weight: bold;">
              비밀코드 <span style="font-weight: normal; color: var(--text-muted); font-size: 11px;">(선택: 8자 이상 입력 시 계정 고정)</span>
            </label>
            <input type="password" id="auth-code-input" class="pixel-input" placeholder="비밀코드 입력 시 계정 동기화 (8자+)" style="width: 100%;">
          </div>

          <div id="auth-error-msg" style="font-size: 11px; color: var(--danger); display: none; background: rgba(239,68,68,0.15); border: 1px dashed var(--danger); padding: 6px 10px; border-radius: 4px;"></div>
          <div id="auth-success-msg" style="font-size: 11px; color: var(--kairo-mint); display: none; background: rgba(52,211,153,0.15); border: 1px dashed var(--kairo-mint); padding: 6px 10px; border-radius: 4px;"></div>

          <button type="submit" id="btn-save-auth" class="pixel-btn btn-accent" style="width: 100%; margin-top: 6px; font-size: 16px; padding: 14px;">
            💾 프로필 / 닉네임 저장
          </button>
        </form>
      </div>
    </div>
  `;

  const modalWrapper = document.createElement("div");
  modalWrapper.innerHTML = modalHtml;
  const modalEl = modalWrapper.firstElementChild;
  document.body.appendChild(modalEl);

  const formEl = modalEl.querySelector("#auth-form");
  const errorMsg = modalEl.querySelector("#auth-error-msg");
  const successMsg = modalEl.querySelector("#auth-success-msg");

  const closeModal = () => {
    document.body.style.overflow = "";
    if (modalEl && modalEl.parentNode) {
      modalEl.parentNode.removeChild(modalEl);
    }
    if (onClose) onClose();
  };

  modalEl.querySelector("#auth-modal-close").addEventListener("click", closeModal);
  modalEl.addEventListener("click", (e) => {
    if (e.target === modalEl) closeModal();
  });

  formEl.addEventListener("submit", (e) => {
    e.preventDefault();
    errorMsg.style.display = "none";
    successMsg.style.display = "none";

    const nick = modalEl.querySelector("#auth-nick-input").value;
    const code = modalEl.querySelector("#auth-code-input").value;

    try {
      const result = registerOrLoginWithCode(nick, code);
      if (!result.success) {
        errorMsg.style.display = "block";
        errorMsg.textContent = result.message;
      } else {
        successMsg.style.display = "block";
        successMsg.textContent = result.message || "저장되었습니다!";
        
        setTimeout(() => {
          closeModal();
          if (onUserUpdated) onUserUpdated(result.user);
        }, 500);
      }
    } catch (err) {
      console.error("[AuthForm Submit Error]", err);
      errorMsg.style.display = "block";
      errorMsg.textContent = "저장 중 오류가 발생했습니다: " + err.message;
    }
  });
}
