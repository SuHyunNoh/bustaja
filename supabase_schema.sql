-- ==========================================================================
-- 버스정류장 땅따먹기 — Supabase 100% 무료 PostgreSQL 데이터베이스 스키마
-- Supabase 대시보드 (https://app.supabase.com) > SQL Editor에서 실행
-- ==========================================================================

-- 1. 버스 노선 테이블 (routes)
CREATE TABLE IF NOT EXISTS public.routes (
    id TEXT PRIMARY KEY,
    route_no TEXT NOT NULL,
    route_type TEXT NOT NULL,
    city_code TEXT DEFAULT '25',
    city_name TEXT DEFAULT '서울',
    start_node TEXT NOT NULL,
    end_node TEXT NOT NULL,
    stop_count INTEGER NOT NULL,
    stops JSONB NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. 노선x난이도 점령 및 랭킹 보드 테이블 (boards)
CREATE TABLE IF NOT EXISTS public.boards (
    board_id TEXT PRIMARY KEY, -- 예: ROUTE_6642__easy
    route_id TEXT NOT NULL REFERENCES public.routes(id) ON DELETE CASCADE,
    difficulty TEXT NOT NULL,  -- easy, mid, hard
    occupant_uid TEXT,
    occupant_nick TEXT DEFAULT '미점령',
    best_ms INTEGER,
    best_splits JSONB,
    occupied_since TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    challenger_count INTEGER DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 개별 스코어 제출 기록 (scores)
CREATE TABLE IF NOT EXISTS public.scores (
    id BIGSERIAL PRIMARY KEY,
    board_id TEXT NOT NULL REFERENCES public.boards(board_id) ON DELETE CASCADE,
    nickname TEXT NOT NULL,
    best_ms INTEGER NOT NULL,
    splits JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. 카카오톡 공유 도전장 테이블 (challenges)
CREATE TABLE IF NOT EXISTS public.challenges (
    challenge_id TEXT PRIMARY KEY,
    route_id TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    from_nick TEXT NOT NULL,
    splits JSONB NOT NULL,
    total_ms INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security) 읽기/쓰기 공개 설정 (무료 익명 플레이 지원)
ALTER TABLE public.routes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.boards ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read Routes" ON public.routes FOR SELECT USING (true);
CREATE POLICY "Public Read Boards" ON public.boards FOR SELECT USING (true);
CREATE POLICY "Public Write Scores" ON public.scores FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Scores" ON public.scores FOR SELECT USING (true);
CREATE POLICY "Public Read Challenges" ON public.challenges FOR SELECT USING (true);
CREATE POLICY "Public Write Challenges" ON public.challenges FOR INSERT WITH CHECK (true);
