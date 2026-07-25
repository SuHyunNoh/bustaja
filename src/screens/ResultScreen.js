// ==========================================================================
// 버스타자 — 결과 & 카카오톡 도전장 대결 승패 알림 화면 (ResultScreen.js)
// 커스텀 레트로 픽셀 모달 팝업 연동
// ==========================================================================

import { getRouteById, getDifficultySpec, submitScore, submitScoreAsync, createChallenge, submitChallengeResult } from "../lib/api.js";
import { getCurrentUser } from "../lib/auth.js";
import { shareChallengeToKakao, shareChallengeResultToKakao } from "../lib/kakao.js";
import { showPixelAlert, showInterstitialAdModal } from "../ui/modal.js";

export function renderResultScreen(container, props = {}) {
  const { isChallengeMatch, challengeData, onRetry, onHome } = props;
  const resultData = props.resultData || props.gameData || {};
  const routeId = props.routeId || resultData.routeId || "ROUTE_6642";
  const difficulty = props.difficulty || resultData.difficulty || "easy";

  const route = getRouteById(routeId);
  const diffSpec = getDifficultySpec(route ? route.stopCount : 20, difficulty);
  const currentUser = getCurrentUser();

  const totalSecStr = ((resultData.totalMs || 0) / 1000).toFixed(2);
  const avgSplitSecStr = resultData.stopCount ? ((resultData.totalMs || 0) / resultData.stopCount / 1000).toFixed(2) : "0.00";

  let challengeResultInfo = null;
  let submitRes = submitScore({
    uid: currentUser.uid,
    nickname: currentUser.nickname,
    routeId,
    diffKey: difficulty,
    totalMs: resultData.totalMs || 0,
    splits: resultData.splits || []
  });

  // 비동기 클라우드 Supabase DB 직통 100% 보장형 푸시 파이프라인
  submitScoreAsync({
    uid: currentUser.uid,
    nickname: currentUser.nickname,
    routeId,
    diffKey: difficulty,
    totalMs: resultData.totalMs || 0,
    splits: resultData.splits || []
  }).then(asyncRes => {
    console.log("[ResultScreen Supabase Direct Push Completed]", asyncRes);
  });

  if (isChallengeMatch && challengeData) {
    challengeResultInfo = submitChallengeResult({
      challengeId: challengeData.challengeId,
      challengerNick: currentUser.nickname,
      challengerTotalMs: resultData.totalMs,
      challengerSplits: resultData.splits
    });
  }

  container.innerHTML = `
    <div class="screen-container" style="justify-content: center; align-items: center; text-align: center;">
      
      ${isChallengeMatch && challengeResultInfo ? `
        <!-- 친구 도전장 대결 승패 결과 카드 -->
        ${challengeResultInfo.isChallengerWon ? `
          <div style="font-size: 44px; animation: flagWave 0.6s infinite;">🏆⚡</div>
          <div class="result-headline" style="color: var(--kairo-mint);">
            도전 성공! VICTORY!
          </div>
          <p style="font-size: 14px; color: #fff; margin-bottom: 16px;">
            🎉 축하합니다! <strong>${challengeResultInfo.senderNick}</strong>의 기록(${(challengeResultInfo.senderTotalMs / 1000).toFixed(2)}초)을 
            <strong style="color: var(--kairo-mint);">${challengeResultInfo.timeDiffSec}초 차이</strong>로 깨고 승리하셨습니다!
          </p>
        ` : `
          <div style="font-size: 44px;">💀⚔️</div>
          <div class="result-headline" style="color: var(--danger);">
            도전 실패... DEFEAT
          </div>
          <p style="font-size: 14px; color: #fff; margin-bottom: 16px;">
            아쉽습니다! <strong>${challengeResultInfo.senderNick}</strong>의 벽(${(challengeResultInfo.senderTotalMs / 1000).toFixed(2)}초)을 넘지 못했습니다.<br>
            <span style="color: var(--danger); font-weight: bold;">(차이: +${challengeResultInfo.timeDiffSec}초)</span>
          </p>
        `}
      ` : submitRes && submitRes.isOccupied ? `
        <!-- 일반 모드 1위 역전 점령 성공 연출 -->
        <div style="font-size: 44px; animation: flagWave 0.6s infinite;">👑🚩</div>
        <div class="result-headline" style="color: var(--kairo-yellow);">
          🎉 축하합니다! 새로운 영주가 되었습니다! 👑🚩
        </div>
        <p style="font-size: 14px; color: var(--kairo-mint); margin-bottom: 20px; font-weight: bold; line-height: 1.6;">
          노선의 1위 자리를 멋지게 차지하셨습니다!<br>
          전 세계 플레이어들에게 당신의 이름을 선포합니다! 🏆
        </p>
      ` : `
        <!-- 일반 모드 완주 / 점령 실패 격려 연출 -->
        <div style="font-size: 44px;">💪🏁</div>
        <div class="result-headline" style="color: #ffffff;">
          💪 아쉬워요! 기존 영주의 벽을 넘지 못했습니다.
        </div>
        <p style="font-size: 13px; color: var(--text-muted); margin-bottom: 20px; line-height: 1.6;">
          0.1초만 더 단축하면 영주 자리를 빼앗을 수 있습니다!<br>
          <strong style="color: var(--kairo-yellow);">다시 도전해 보세요! 🔄</strong>
        </p>
      `}

      <!-- 기록 요약 카드 -->
      <div class="result-card" style="width: 100%;">
        <div style="font-size: 12px; color: var(--text-muted);">내 완주 소요 시간</div>
        <div class="result-time-lg">${totalSecStr}초</div>

        <div style="display: flex; justify-content: space-around; margin-top: 16px; border-top: 2px dashed var(--border-pixel); padding-top: 12px; font-size: 12px;">
          <div>
            <div style="color: var(--text-muted);">정류장당 평균</div>
            <div style="font-weight: bold; color: #fff; font-size: 14px; margin-top: 2px;">${avgSplitSecStr}초</div>
          </div>
          <div>
            <div style="color: var(--text-muted);">${isChallengeMatch ? '상대 도전자' : '현재 1위 점령자'}</div>
            <div style="font-weight: bold; color: var(--kairo-yellow); font-size: 14px; margin-top: 2px;">
              ${isChallengeMatch ? challengeData.fromNick : submitRes.board.occupantNick}
            </div>
          </div>
        </div>
      </div>


      <!-- 완주 축하 픽셀 배너 구좌 (제휴/자체 배너 스팟) -->
      <div class="pixel-banner-slot" style="width: 100%;">
        <div class="banner-content">
          <span style="font-size: 16px;">🏆✨</span>
          <span>완주를 축하합니다! 손목 풀고 다음 노선 1위 고스트 타자 기록도 깨보세요! ⚡</span>
        </div>
      </div>
      <div style="width: 100%; display: flex; flex-direction: column; gap: 12px;">
        
        ${isChallengeMatch && challengeResultInfo ? `
          <button id="btn-share-result-reply" class="pixel-btn btn-accent" style="width: 100%; font-size: 16px;">
            📲 승패 결과 친구에게 답장 보내기 (카카오톡)
          </button>
        ` : `
          <button id="btn-share-kakao-challenge" class="pixel-btn btn-accent" style="width: 100%; font-size: 16px;">
            📲 카카오톡 도전장 보내기 (친구 공유)
          </button>
        `}

        <button id="btn-retry" class="pixel-btn btn-primary" style="width: 100%; font-size: 16px;">
          🔄 다시 도전하기
        </button>

        <button id="btn-result-home" class="pixel-btn btn-ghost" style="width: 100%;">
          🏠 메인으로 돌아가기
        </button>
      </div>

    </div>
  `;

  // 1. 친구 도전장 보내기 카카오톡 공유
  const shareBtn = container.querySelector("#btn-share-kakao-challenge");
  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      const challengeObj = createChallenge({
        routeId,
        difficulty,
        fromNick: currentUser.nickname,
        splits: resultData.splits,
        totalMs: resultData.totalMs
      });

      const res = shareChallengeToKakao({
        challengeId: challengeObj.challengeId,
        routeNo: route.routeNo,
        routeType: route.routeType,
        diffLabel: diffSpec.label,
        senderNick: currentUser.nickname,
        totalTimeStr: `${totalSecStr}초`
      });

      if (res.method === 'clipboard') {
        showPixelAlert(
          `📋 카카오 도전장 링크가 클립보드에 복사되었습니다!\n\n친구에게 전송해 내 기록(${totalSecStr}초)과 고스트 대결을 신청해보세요!\n\n${res.url}`,
          "📲 카카오 도전장 복사 완료"
        );
      }
    });
  }

  // 2. 대결 승패 결과 친구에게 답장 카카오톡 공유
  const replyShareBtn = container.querySelector("#btn-share-result-reply");
  if (replyShareBtn && challengeResultInfo) {
    replyShareBtn.addEventListener("click", () => {
      const res = shareChallengeResultToKakao({
        challengeId: challengeData.challengeId,
        isWon: challengeResultInfo.isChallengerWon,
        winnerNick: challengeResultInfo.isChallengerWon ? currentUser.nickname : challengeResultInfo.senderNick,
        loserNick: challengeResultInfo.isChallengerWon ? challengeResultInfo.senderNick : currentUser.nickname,
        winnerTimeStr: `${totalSecStr}초`,
        timeDiffSec: challengeResultInfo.timeDiffSec
      });

      if (res.method === 'clipboard') {
        showPixelAlert(
          `📋 대결 승패 결과 공유 링크가 복사되었습니다!\n\n친구에게 결과를 알려주세요:\n\n${res.url}`,
          "⚔️ 대결 결과 복사 완료"
        );
      }
    });
  }

  // 모바일 재도전 클릭 시 전면 광고 시청 브릿지 노출 후 게임 재시작
  container.querySelector("#btn-retry").addEventListener("click", () => {
    showInterstitialAdModal(() => {
      onRetry();
    });
  });
  container.querySelector("#btn-result-home").addEventListener("click", onHome);
}
