// ==========================================================================
// 버스정류장 땅따먹기 — 카카오톡 도전장 수락 진입 화면 (ChallengeEntryScreen.js)
// ==========================================================================

import { getChallengeById, getRouteById, getDifficultySpec } from "../lib/api.js";
import { trackGAEvent } from "../lib/ga.js";

export function renderChallengeEntryScreen(container, { challengeId, onAcceptChallenge, onHome }) {
  const challenge = getChallengeById(challengeId);
  if (!challenge) {
    container.innerHTML = `
      <div class="screen-container" style="justify-content: center; align-items: center; text-align: center;">
        <div style="font-size: 32px; margin-bottom: 12px;">⚠️</div>
        <h2 style="color: var(--danger); font-size: 18px; margin-bottom: 8px;">도전장을 찾을 수 없습니다</h2>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px;">만료되었거나 유효하지 않은 도전 링크입니다.</p>
        <button id="btn-err-home" class="pixel-btn btn-primary">🏠 홈으로 가기</button>
      </div>
    `;
    container.querySelector("#btn-err-home").addEventListener("click", onHome);
    return;
  }

  const route = getRouteById(challenge.routeId);
  const diffSpec = getDifficultySpec(route.stopCount, challenge.difficulty);
  const senderSecStr = (challenge.totalMs / 1000).toFixed(2);

  trackGAEvent("challenge_view", {
    challenge_id: challengeId,
    from_nick: challenge.fromNick
  });

  container.innerHTML = `
    <div class="screen-container" style="justify-content: center; align-items: center; text-align: center;">
      <div style="font-size: 48px; animation: flagWave 0.6s infinite; margin-bottom: 12px;">⚔️🚌</div>

      <div class="pixel-box" style="width: 100%; border-color: var(--text-gold); box-shadow: var(--pixel-glow-gold); padding: 20px; margin-bottom: 20px;">
        <div style="font-size: 11px; color: var(--text-gold); margin-bottom: 6px;">[카카오톡 도전장]</div>
        <h2 style="font-size: 22px; color: #fff; margin-bottom: 12px;">
          <span style="color: var(--accent-neon);">${challenge.fromNick}</span>의 도전장!
        </h2>

        <div style="background: var(--bg-input); border: 2px solid #000; padding: 14px; margin-bottom: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
            <span class="bus-badge green">${route.routeNo}번</span>
            <span style="font-size: 12px; color: var(--text-muted);">${diffSpec.label} (${diffSpec.playCount}개 정류장)</span>
          </div>
          <div style="font-size: 13px; color: #fff; text-align: left; margin-bottom: 4px;">
            📍 구간: <strong>${route.startNode} ↔ ${route.endNode}</strong>
          </div>
          <div style="font-size: 18px; font-weight: bold; color: var(--text-gold); margin-top: 8px;">
            🔥 상대 기록: ${senderSecStr}초
          </div>
        </div>

        <p style="font-size: 12px; color: var(--text-muted);">
          친구 <strong>${challenge.fromNick}</strong>의 고스트 버스와 실시간으로 겨뤄 승리하세요!
        </p>
      </div>

      <div style="width: 100%; display: flex; flex-direction: column; gap: 12px;">
        <button id="btn-accept-challenge" class="pixel-btn btn-accent" style="width: 100%; font-size: 18px; padding: 16px;">
          ⚔️ 도전 수락! 고스트 대결 시작
        </button>
        <button id="btn-challenge-home" class="pixel-btn btn-ghost" style="width: 100%;">
          🏠 메인으로 이동
        </button>
      </div>
    </div>
  `;

  container.querySelector("#btn-accept-challenge").addEventListener("click", () => {
    trackGAEvent("challenge_accept", {
      challenge_id: challengeId
    });
    onAcceptChallenge(challenge);
  });

  container.querySelector("#btn-challenge-home").addEventListener("click", onHome);
}
