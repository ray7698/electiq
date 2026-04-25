export function getOrCreateSessionId() {
  let sid = localStorage.getItem('electiq_session_id');
  if (!sid) {
    sid = 'sess_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem('electiq_session_id', sid);
  }
  return sid;
}

export const SESSION_ID = getOrCreateSessionId();

let _currentLang = localStorage.getItem('electiq_lang') || 'en';
export function getCurrentLang() {
  return _currentLang;
}
export function setCurrentLang(lang) {
  _currentLang = lang;
  localStorage.setItem('electiq_lang', lang);
}
