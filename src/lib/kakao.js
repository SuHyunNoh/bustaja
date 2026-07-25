// ==========================================================================
// 버스타자 (BusTaja) — 카카오톡 공유 SDK 래퍼 (kakao.js)
// 카카오톡 공유 가이드 준수: https://developers.kakao.com/docs/ko/kakaotalk-share/js-link
// ==========================================================================

import { trackGAEvent } from "./ga.js";

// Kakao SDK 초기화 (앱 키 등록)
const KAKAO_JS_KEY = "42f1fb58716374bd9c920276fc167781439a460750806fb7957fe570490602e3";

export function initKakaoSDK() {
  if (window.Kakao) {
    if (!window.Kakao.isInitialized()) {
      try {
        window.Kakao.init(KAKAO_JS_KEY);
        console.log("[Kakao SDK] initialized successfully");
      } catch (e) {
        console.warn("[Kakao SDK] init warning:", e);
      }
    }
  }
}

// 1. 친구에게 도전장 카카오톡 공유하기 (Send Challenge Feed)
export function shareChallengeToKakao({ challengeId, routeNo, routeType, diffLabel, senderNick, totalTimeStr }) {
  initKakaoSDK();

  const shareTitle = `[${routeNo}번 · ${diffLabel}] 🚌 ${senderNick}의 도전장 도착!`;
  const shareDesc = `내 완주 기록 ${totalTimeStr}! 이 버스 노선의 주인, 나를 깰 수 있어? 🚩`;
  const origin = window.location.origin && window.location.origin !== "null" ? window.location.origin : "https://busstop-azure.vercel.app";
  const targetUrl = `${origin}${window.location.pathname}?c=${challengeId}`;
  const imageUrl = `${origin}/og_thumbnail.jpg`;

  trackGAEvent("kakao_share_challenge", {
    challenge_id: challengeId,
    route_no: routeNo,
    diff: diffLabel
  });

  if (window.Kakao && window.Kakao.isInitialized()) {
    try {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: shareTitle,
          description: shareDesc,
          imageUrl: imageUrl,
          link: {
            mobileWebUrl: targetUrl,
            webUrl: targetUrl,
          },
        },
        itemContent: {
          profileText: '버스타자 — 정류장 땅따먹기 🚩',
          titleCol: '도전 정류장',
          sumCol: `${routeNo}번 (${diffLabel})`,
        },
        buttons: [
          {
            title: '⚔️ 고스트와 대결하기',
            link: {
              mobileWebUrl: targetUrl,
              webUrl: targetUrl,
            },
          },
        ],
      });
      return { success: true, method: 'kakao', url: targetUrl };
    } catch (err) {
      console.warn("Kakao Share API failed, fallback to link copy", err);
    }
  }

  // Fallback: 클립보드 복사
  try {
    navigator.clipboard.writeText(`${shareTitle}\n${shareDesc}\n도전하기 👉 ${targetUrl}`);
  } catch (e) {
    console.error("Clipboard copy error", e);
  }
  return { success: true, method: 'clipboard', url: targetUrl };
}

// 2. 대결 승패 결과 친구에게 카카오톡 공유하기 (Send Result Reply Feed)
export function shareChallengeResultToKakao({ challengeId, isWon, winnerNick, loserNick, winnerTimeStr, timeDiffSec }) {
  initKakaoSDK();

  const shareTitle = isWon
    ? `🎉 [도전 성공] ${winnerNick}가 ${loserNick}의 기록을 지웠습니다!`
    : `💀 [도전 실패] ${winnerNick}의 벽을 넘지 못했습니다...`;

  const shareDesc = isWon
    ? `결과: ${winnerTimeStr} (차이: -${timeDiffSec}초 승리!) 🏆`
    : `결과: ${winnerNick}의 승리 (+${timeDiffSec}초 차이) ⚔️`;

  const origin = window.location.origin && window.location.origin !== "null" ? window.location.origin : "https://busstop-azure.vercel.app";
  const targetUrl = `${origin}${window.location.pathname}?c=${challengeId}`;
  const imageUrl = `${origin}/og_thumbnail.jpg`;

  trackGAEvent("kakao_share_result", {
    challenge_id: challengeId,
    is_won: isWon
  });

  if (window.Kakao && window.Kakao.isInitialized()) {
    try {
      window.Kakao.Share.sendDefault({
        objectType: 'feed',
        content: {
          title: shareTitle,
          description: shareDesc,
          imageUrl: imageUrl,
          link: {
            mobileWebUrl: targetUrl,
            webUrl: targetUrl,
          },
        },
        buttons: [
          {
            title: '🔥 리매치 재대결 도전하기',
            link: {
              mobileWebUrl: targetUrl,
              webUrl: targetUrl,
            },
          },
        ],
      });
      return { success: true, method: 'kakao', url: targetUrl };
    } catch (err) {
      console.warn("Kakao Share API failed, fallback to link copy", err);
    }
  }

  // Fallback: 클립보드 복사
  try {
    navigator.clipboard.writeText(`${shareTitle}\n${shareDesc}\n확인하기 👉 ${targetUrl}`);
  } catch (e) {
    console.error("Clipboard copy error", e);
  }
  return { success: true, method: 'clipboard', url: targetUrl };
}
