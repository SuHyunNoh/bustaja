// ==========================================================================
// 버스타자 (BusTaja) — 익명 + 닉네임/코드 인증 매니저 (auth.js)
// UTF-8 한글 닉네임 안전 인코딩 지원
// ==========================================================================

const LOCAL_STORAGE_KEY = "busstop_user_profile_v2";

// UTF-8 한글 문자열 안전 Base64 인코더 (btoa Latin1 예외 방지)
function safeUtf8Btoa(str) {
  try {
    return btoa(encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, function(match, p1) {
      return String.fromCharCode('0x' + p1);
    })).replace(/=/g, "");
  } catch (e) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = ((hash << 5) - hash) + str.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash).toString(36);
  }
}

export function getCurrentUser() {
  const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed && parsed.uid && parsed.nickname) {
        return parsed;
      }
    } catch (e) {
      console.error("[Auth] Failed to parse saved user", e);
    }
  }
  
  // 최초 1회 익명 게스트 프로필 생성 (지속성 보장: 새로고침해도 동일 UID 유지)
  const guestId = "guest_" + Math.random().toString(36).substring(2, 9);
  const guestUser = {
    uid: guestId,
    nickname: "익명도전자_" + guestId.substring(6),
    isGuest: true,
    createdAt: new Date().toISOString()
  };
  saveUser(guestUser);
  return guestUser;
}

export function saveUser(userObj) {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(userObj));
  } catch (e) {
    console.error("[Auth] Failed to save user profile", e);
  }
}

/**
 * 닉네임 또는 비밀코드 업데이트
 * - secretCode 없이 닉네임만 입력: 기존 UID 유지하며 닉네임 변경 (게스트/회원 모두 가능)
 * - secretCode(8자 이상) 입력: 동일 닉네임+코드 기반의 고유 UID 생성/로그인
 */
export function registerOrLoginWithCode(nickname, secretCode = "") {
  const cleanNick = (nickname || "").trim();
  const cleanCode = (secretCode || "").trim();

  if (!cleanNick || cleanNick.length < 2) {
    return { success: false, message: "닉네임은 2자 이상 입력해주세요." };
  }

  const currentUser = getCurrentUser();

  // 비밀코드가 입력된 경우 (계정 고정/불러오기 모드)
  if (cleanCode.length > 0) {
    if (cleanCode.length < 8) {
      return { success: false, message: "비밀코드는 8자 이상 입력해주세요." };
    }
    
    // 한글 닉네임 포함 안전 해시 UID 생성
    const codeHash = safeUtf8Btoa(cleanNick + "::" + cleanCode);
    const uid = "usr_" + codeHash.substring(0, 16);
    
    const userProfile = {
      uid,
      nickname: cleanNick,
      isGuest: false,
      secretCodeHash: codeHash.substring(0, 8),
      updatedAt: new Date().toISOString()
    };
    
    saveUser(userProfile);
    return { success: true, user: userProfile, message: "계정이 인증 및 저장되었습니다!" };
  }

  // 비밀코드가 없는 경우 (닉네임만 변경)
  const userProfile = {
    ...currentUser,
    nickname: cleanNick,
    updatedAt: new Date().toISOString()
  };

  saveUser(userProfile);
  return { success: true, user: userProfile, message: "닉네임이 성공적으로 변경되었습니다!" };
}
