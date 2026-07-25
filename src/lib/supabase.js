// ==========================================================================
// 버스타자 4.0 (BusTaja 4.0) — Supabase Direct REST API Engine
// ==========================================================================

const SUPABASE_URL = "https://wnvioqmkyymvmahecjye.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_knih9nw6Vw9BoSLDGCCgbw_1UhxuEu2";

let supabaseClient = null;

export function initSupabase() {
  if (window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    } catch (e) {
      console.warn("[Supabase SDK Init Warn]", e);
    }
  }
  return supabaseClient;
}

export function getSupabase() {
  if (!supabaseClient) initSupabase();
  return supabaseClient;
}

// 닉네임별 최고기록(best_ms 최소)만 남기고 best_ms 오름차순 정렬 → 고유 도전자 리스트
function dedupByNickname(rows) {
  const bestByNick = {};
  for (const item of rows) {
    const n = item.nickname;
    if (!bestByNick[n] || item.best_ms < bestByNick[n].best_ms) bestByNick[n] = item;
  }
  return Object.values(bestByNick).sort((a, b) => a.best_ms - b.best_ms);
}

// 1. Supabase DB에서 특정 노선 1위 영주 및 TOP 랭킹 Direct SELECT 쿼리
export async function fetchBoardDirectFromSupabase(routeId, diffKey = "easy") {
  const boardId = `${routeId}__${diffKey}`;

  // Direct REST API GET Query
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);
    const url = `${SUPABASE_URL}/rest/v1/scores?board_id=eq.${boardId}&order=best_ms.asc&limit=200`;

    const res = await fetch(url, {
      method: "GET",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json"
      },
      cache: "no-store",
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res && res.ok) {
      const dataList = await res.json();
      if (Array.isArray(dataList) && dataList.length > 0) {
        // 닉네임별 최고기록만 남겨 중복 제거 → 고유 도전자 수 + 깔끔한 랭킹
        const unique = dedupByNickname(dataList);
        const top = unique[0];
        return {
          routeId,
          difficulty: diffKey,
          occupantNick: top.nickname,
          bestMs: top.best_ms,
          bestSplits: top.splits || [],
          occupiedSince: top.created_at || new Date().toISOString(),
          challengerCount: unique.length,
          scores: unique.slice(0, 10).map((item, idx) => ({
            rank: idx + 1,
            nickname: item.nickname,
            bestMs: item.best_ms,
            date: new Date(item.created_at || Date.now()).toLocaleDateString()
          }))
        };
      }
    }
  } catch (err) {
    console.warn("[Supabase Direct REST Fetch Board Warn]", err);
  }

  // SDK Fallback
  const sb = getSupabase();
  if (sb) {
    try {
      const { data, error } = await sb
        .from("scores")
        .select("*")
        .eq("board_id", boardId)
        .order("best_ms", { ascending: true })
        .limit(10);

      if (!error && Array.isArray(data) && data.length > 0) {
        const unique = dedupByNickname(data);
        const top = unique[0];
        return {
          routeId,
          difficulty: diffKey,
          occupantNick: top.nickname,
          bestMs: top.best_ms,
          bestSplits: top.splits || [],
          occupiedSince: top.created_at || new Date().toISOString(),
          challengerCount: unique.length,
          scores: unique.slice(0, 10).map((item, idx) => ({
            rank: idx + 1,
            nickname: item.nickname,
            bestMs: item.best_ms,
            date: new Date(item.created_at || Date.now()).toLocaleDateString()
          }))
        };
      }
    } catch (e) {}
  }

  return null;
}

// Supabase DB에 점령 스코어 제출 (scores 단독 100% 무조건 직통 INSERT 파이프)
export async function submitScoreToSupabase({ routeId, difficulty, nickname, totalMs, splits }) {
  const boardId = `${routeId}__${difficulty}`;

  const scorePayload = {
    board_id: boardId,
    nickname: nickname,
    best_ms: totalMs,
    splits: splits || [],
    created_at: new Date().toISOString()
  };

  // Direct REST API INSERT (외래키 걸림 0% 단독 100% 무조건 직통 적재)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const res = await fetch(`${SUPABASE_URL}/rest/v1/scores`, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
        "Content-Type": "application/json",
        "Prefer": "return=representation"
      },
      body: JSON.stringify(scorePayload),
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res && res.ok) {
      const resultData = await res.json();
      console.log("[Supabase Direct Score Insert Success]", resultData);
      return resultData;
    }
  } catch (err) {
    console.warn("[Supabase Direct Score Insert Warn]", err);
  }

  return null;
}

export async function fetchRoutesFromSupabase() { return null; }
export async function fetchAllBoardsFromSupabase() { return null; }
export async function fetchBoardFromSupabase(boardId) { return null; }
