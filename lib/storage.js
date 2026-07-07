// Small helpers around localStorage so every page can save/load
// its own data without repeating try/catch everywhere.

export const KEYS = {
  accounts: "sms_accounts",
  courses: "sms_courses",
  assignments: "sms_assignments",
  grades: "sms_grades",
  attendance: "sms_attendance",
  profile: "sms_profile",
  settings: "sms_settings",
  loggedIn: "sms_logged_in",
};

export function load(key, fallback) {
  if (typeof window === "undefined") return fallback;
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch {
    return fallback;
  }
}

export function save(key, val) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch {
    // localStorage might be unavailable (e.g. private mode) — fail silently
  }
}

export const uid = () => Math.random().toString(36).slice(2, 9);

export function getAccounts() {
  return load(KEYS.accounts, []);
}

export function saveAccounts(accounts) {
  save(KEYS.accounts, accounts);
}

export function registerAccount(account) {
  const accounts = getAccounts();

  const exists = accounts.find(
    (a) => a.email.toLowerCase() === account.email.toLowerCase()
  );

  if (exists) {
    return {
      success: false,
      message: "Email already registered.",
    };
  }

  accounts.push(account);

  saveAccounts(accounts);

  return {
    success: true,
  };
}

export function loginAccount(email, password) {
  const accounts = getAccounts();

  const account = accounts.find(
    (a) =>
      a.email.toLowerCase() === email.toLowerCase() &&
      a.password === password
  );

  if (!account) {
    return null;
  }

  save(KEYS.loggedIn, account);

  return account;
}

export function logoutAccount() {
  localStorage.removeItem(KEYS.loggedIn);
}