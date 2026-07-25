// ==========================================================================
// 버스정류장 땅따먹기 — Supabase 100% 무료 DB 연동 모듈 (Supabase Free Tier)
// ==========================================================================

// 유저가 발급받은 실제 Supabase Project URL 및 Publishable Key
const SUPABASE_URL = "https://wnvioqmkyymvmahecjye.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_knih9nw6Vw9BoSLDGCCgbw_1UhxuEu2";

let supabaseClient = null;

export function initSupabase() {
  if (window.supabase) {
    try {
      supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
      console.log("[Supabase Active] Connected to:", SUPABASE_URL);
    } catch (e) {
      console.warn("[Supabase] Failed to init, using local fallback", e);
    }
  }
  return supabaseClient;
}

export function getSupabase() {
  if (!supabaseClient) initSupabase();
  return supabaseClient;
}

// Supabase DB에서 특정 노선 난이도의 1위 점령자 및 TOP 10 랭킹 직통 SELECT 쿼리
export async function fetchBoardDirectFromSupabase(routeId, diffKey = "easy") {
  const sb = getSupabase();
  const boardId = `${routeId}__${diffKey}`;

  // 1차 Supabase SDK 직통 SELECT
  if (sb) {
    try {
      const { data, error } = await sb
        .from("scores")
        .select("*")
        .eq("board_id", boardId)
        .order("best_ms", { ascending: true })
        .limit(10);

      if (!error && Array.isArray(data) && data.length > 0) {
        const top = data[0];
        return {
          routeId,
          difficulty: diffKey,
          occupantNick: top.nickname,
          bestMs: top.best_ms,
          bestSplits: top.splits || [],
          occupiedSince: top.created_at || new Date().toISOString(),
          challengerCount: data.length,
          scores: data.map((item, idx) => ({
            rank: idx + 1,
            nickname: item.nickname,
            bestMs: item.best_ms,
            date: new Date(item.created_at || Date.now()).toLocaleDateString()
          }))
        };
      }
    } catch (err) {
      console.warn("[Supabase SDK fetch Board err]", err);
    }
  }

  // 2차 Supabase Direct REST API SELECT
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    const restUrl = `${SUPABASE_URL}/rest/v1/scores?board_id=eq.${boardId}&order=best_ms.asc&limit=10`;

    const res = await fetch(restUrl, {
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
        const top = dataList[0];
        return {
          routeId,
          difficulty: diffKey,
          occupantNick: top.nickname,
          bestMs: top.best_ms,
          bestSplits: top.splits || [],
          occupiedSince: top.created_at || new Date().toISOString(),
          challengerCount: dataList.length,
          scores: dataList.map((item, idx) => ({
            rank: idx + 1,
            nickname: item.nickname,
            bestMs: item.best_ms,
            date: new Date(item.created_at || Date.now()).toLocaleDateString()
          }))
        };
      }
    }
  } catch (err2) {
    console.warn("[Supabase REST fetch Board err]", err2);
  }

  return null;
}

// Supabase DB에 점령 스코어 제출
export async function submitScoreToSupabase({ routeId, difficulty, nickname, totalMs, splits }) {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const boardId = `${routeId}__${difficulty}`;
    const { data, error } = await sb
      .from("scores")
      .insert([
        {
          board_id: boardId,
          nickname,
          best_ms: totalMs,
          splits,
          created_at: new Date().toISOString()
        }
      ]);
    
    if (error) throw error;
    console.log("[Supabase Score Submitted Successfully]", data);
    return data;
  } catch (err) {
    console.warn("[Supabase submitScore error]", err);
    return null;
  }
}

// Supabase DB에서 특정 노선의 1위 점령자 및 Top 랭킹 조회
export async function fetchBoardFromSupabase(boardId) {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from("scores")
      .select("*")
      .eq("board_id", boardId)
      .order("best_ms", { ascending: true })
      .limit(50);

    if (error) throw error;
    if (!data || data.length === 0) return null;

    // 1위 영주 및 도전자 수 파악
    const rank1 = data[0];
    const uniqueChallengers = new Set(data.map(s => s.nickname));

    return {
      occupantNick: rank1.nickname,
      bestMs: rank1.best_ms,
      bestSplits: rank1.splits || [],
      occupiedSince: rank1.created_at || new Date().toISOString(),
      challengerCount: uniqueChallengers.size,
      scores: data.map((s, idx) => ({
        rank: idx + 1,
        nickname: s.nickname,
        bestMs: s.best_ms,
        date: s.created_at ? new Date(s.created_at).toLocaleDateString() : "최근"
      }))
    };
  } catch (err) {
    console.warn("[Supabase fetchBoard error]", err);
    return null;
  }
}

// Supabase DB에서 전세계 노선의 최신 1위 점령 데이터 일괄 조회 (타 브라우저 100% 동기화)
export async function fetchAllBoardsFromSupabase() {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from("scores")
      .select("*")
      .order("best_ms", { ascending: true });

    if (error) throw error;
    if (!data) return null;

    const boardsMap = {};
    data.forEach(item => {
      const bId = item.board_id;
      if (!boardsMap[bId]) {
        boardsMap[bId] = {
          boardKey: bId,
          occupantNick: item.nickname,
          bestMs: item.best_ms,
          bestSplits: item.splits || [],
          occupiedSince: item.created_at || new Date().toISOString(),
          scores: []
        };
      }
      boardsMap[bId].scores.push({
        nickname: item.nickname,
        bestMs: item.best_ms,
        date: item.created_at ? new Date(item.created_at).toLocaleDateString() : "최근"
      });
    });

    return boardsMap;
  } catch (err) {
    console.warn("[Supabase fetchAllBoards error]", err);
    return null;
  }
}
