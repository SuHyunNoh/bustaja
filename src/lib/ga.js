// ==========================================================================
// 버스타자 (BusTaja) — Google Analytics 4 (GA4) 트래킹 모듈 (ga.js)
// 실제 발급받은 GA4 측정 ID: G-CK8GQY3NBY 적용
// ==========================================================================

const GA_MEASUREMENT_ID = window.GA_MEASUREMENT_ID || "G-CK8GQY3NBY";

export function initGA() {
  if (window.gtag) return;

  // gtag.js 스크립트 동적 로드
  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, {
    send_page_view: false // SPA 라우터에서 수동 전송
  });

  console.log(`[GA4] initialized with ID: ${GA_MEASUREMENT_ID}`);
}

// 화면 방문 이벤트 (Screen View)
export function trackPageView(screenName) {
  if (window.gtag) {
    window.gtag("event", "page_view", {
      page_title: `Screen: ${screenName}`,
      page_location: window.location.href,
      page_path: `/${screenName}`
    });
  }
  console.log(`[GA4 Event] Page View: ${screenName}`);
}

// 커스텀 주요 이벤트 추적
export function trackGAEvent(eventName, params = {}) {
  if (window.gtag) {
    window.gtag("event", eventName, params);
  }
  console.log(`[GA4 Event] ${eventName}:`, params);
}
