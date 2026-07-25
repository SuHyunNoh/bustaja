// ==========================================================================
// 버스타자 (BusTaja) — 노선 검색 화면 (RouteSearchScreen.js)
// 버스 성격별(간선:파랑, 지선:초록, 광역:빨강, 순환:노랑) 색상 구분 적용
// ==========================================================================

import { searchRoutes, getBusBadgeInfo } from "../lib/api.js";
import { showPixelAlert } from "../ui/modal.js";

export function renderRouteSearchScreen(container, { initialQuery = "", onSelectRoute, onBack }) {
  const routes = searchRoutes(initialQuery);

  container.innerHTML = `
    <div class="screen-container">
      <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
        <button id="btn-search-back" class="pixel-btn btn-ghost" style="padding: 6px 12px; font-size: 12px;">
          ← 메인으로
        </button>
        <h2 style="font-size: 16px; color: var(--pixel-yellow);">🚌 버스 노선 검색</h2>
      </div>

      <!-- 검색 바 -->
      <div class="search-bar-wrapper">
        <input type="text" id="route-search-input" class="pixel-input" placeholder="노선 번호 입력 (예: 6642, 146, 6631, 7770, 150)" value="${initialQuery}">
      </div>

      <div style="font-size: 11px; color: var(--text-muted); margin-bottom: 12px;">
        💡 <strong>룰:</strong> 정류장이 20개 초과인 노선만 점령전 참여가 가능합니다.
      </div>

      <!-- 노선 목록 -->
      <div id="route-list-container">
        ${renderRouteListHTML(routes)}
      </div>
    </div>
  `;

  const inputEl = container.querySelector("#route-search-input");
  const listContainer = container.querySelector("#route-list-container");

  inputEl.addEventListener("input", (e) => {
    const filtered = searchRoutes(e.target.value);
    listContainer.innerHTML = renderRouteListHTML(filtered);
    bindRouteCardEvents(container, onSelectRoute);
  });

  container.querySelector("#btn-search-back").addEventListener("click", onBack);
  bindRouteCardEvents(container, onSelectRoute);
}

function renderRouteListHTML(routes) {
  if (routes.length === 0) {
    return `<div style="text-align: center; padding: 40px; color: var(--text-muted);">검색된 노선이 없습니다.</div>`;
  }

  return routes.map(r => {
    const badgeInfo = getBusBadgeInfo(r.routeNo, r.routeType);
    
    return `
      <div class="route-card ${r.isExcluded ? 'disabled' : ''}" data-route-id="${r.routeId}" data-excluded="${r.isExcluded}">
        <div class="route-card-header">
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="bus-badge ${badgeInfo.badgeClass}">${r.routeNo}</span>
            <span class="route-number">${r.routeNo}번</span>
          </div>
          <span style="font-size: 12px; color: var(--text-muted);">${r.cityName} ${badgeInfo.label}</span>
        </div>

        <div class="route-stops-info">
          <span>🚩 ${r.startNode} ↔ ${r.endNode}</span>
          <span style="font-weight: bold; color: ${r.isExcluded ? 'var(--danger)' : 'var(--pixel-mint)'}">
            ${r.stopCount}개 정류장
          </span>
        </div>

        ${r.isExcluded ? `
          <div class="exclusion-notice">
            ⚠️ ${r.exclusionReason}
          </div>
        ` : ''}
      </div>
    `;
  }).join('');
}

function bindRouteCardEvents(container, onSelectRoute) {
  container.querySelectorAll(".route-card").forEach(card => {
    card.addEventListener("click", () => {
      const isExcluded = card.dataset.excluded === "true";
      if (isExcluded) {
        showPixelAlert("⚠️ 해당 노선은 정류장이 20개 이하(또는 제외 노선)로 땅따먹기 점령전에 참가할 수 없습니다!", "노선 참가 제외 안내");
        return;
      }
      const routeId = card.dataset.routeId;
      onSelectRoute(routeId);
    });
  });
}
