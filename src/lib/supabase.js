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

// Supabase DB에서 노선 목록 읽기
export async function fetchRoutesFromSupabase() {
  const sb = getSupabase();
  if (!sb) return null;

  try {
    const { data, error } = await sb
      .from("routes")
      .select("*");
    
    if (error) throw error;
    return data;
  } catch (err) {
    console.warn("[Supabase fetchRoutes]", err);
    return null;
  }
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
