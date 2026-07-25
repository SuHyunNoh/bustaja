// ==========================================================================
// 버스타자 (BusTaja) — UI 공통 Header HUD & Components (v3.0)
// ==========================================================================

import { getCurrentUser } from "../lib/auth.js";

export function renderHeaderHUD(headerContainer, { onTitleClick, onUserClick }) {
  const user = getCurrentUser();

  headerContainer.innerHTML = `
    <header class="app-header">
      <div class="app-title" id="hud-title-logo">
        <span style="font-size: 18px; font-weight: bold; color: #1c1917;">버스타자 🚌🚩</span>
        <span class="bus-badge green" style="font-size: 10px; padding: 2px 4px;">v3.0</span>
      </div>

      <div class="user-status-pill" id="hud-user-pill">
        <span>👑</span>
        <span style="max-width: 100px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">
          ${user.nickname}
        </span>
      </div>
    </header>
  `;

  headerContainer.querySelector("#hud-title-logo").addEventListener("click", onTitleClick);
  headerContainer.querySelector("#hud-user-pill").addEventListener("click", onUserClick);
}
