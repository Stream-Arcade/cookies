/**
 * The categories every StreamArcade app asks for. This list is the one place to add or
 * drop a category platform-wide; apps pick it up with the next release.
 */
export const defaultCategories = ['analytics', 'marketing'];
/** Shared across all stream-arcade apps on the same origin, hence the prefix and Path=/. */
export const CONSENT_COOKIE = '_sa.consent';
/** After half a year the banner asks again. */
const MAX_AGE_SECONDS = 60 * 60 * 24 * 180;
const ALL = ['analytics', 'marketing'];
// Always part of the value, so "decided for nothing" differs from "not decided".
const NECESSARY = 'necessary';
/** The consent with exactly the given categories allowed. */
export function consentOf(allowed) {
    return { analytics: allowed.includes('analytics'), marketing: allowed.includes('marketing') };
}
/** Reads the consent out of a `document.cookie` string. `null` means not decided yet. */
export function parseConsent(cookieString) {
    for (const part of cookieString.split(';')) {
        const eq = part.indexOf('=');
        if (eq === -1 || part.slice(0, eq).trim() !== CONSENT_COOKIE)
            continue;
        const values = part
            .slice(eq + 1)
            .trim()
            .split('.');
        if (!values.includes(NECESSARY))
            return null;
        return consentOf(ALL.filter((category) => values.includes(category)));
    }
    return null;
}
/** The string to assign to `document.cookie` to remember the consent. */
export function serializeConsent(consent) {
    const value = [NECESSARY, ...ALL.filter((category) => consent[category])].join('.');
    return `${CONSENT_COOKIE}=${value}; Path=/; Max-Age=${MAX_AGE_SECONDS}; SameSite=Lax`;
}
// `undefined` until the cookie was read once. From then on this is the truth, so a choice
// also holds for the page load when the browser refuses the cookie.
let current;
const listeners = new Set();
function writeCookie(value) {
    try {
        document.cookie = value;
    }
    catch {
        // Cookies are blocked: the choice lives until the next page load.
    }
}
function set(next) {
    current = next;
    listeners.forEach((listener) => listener());
}
/** The visitor's consent, `null` while they have not decided. Browser only. */
export function getConsent() {
    if (current === undefined) {
        try {
            current = parseConsent(document.cookie);
        }
        catch {
            current = null;
        }
    }
    return current;
}
/** Calls `listener` after every change; returns a function that stops it. */
export function subscribeConsent(listener) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}
/** Stores the visitor's choice. */
export function saveConsent(consent) {
    const next = consentOf(ALL.filter((category) => consent[category]));
    writeCookie(serializeConsent(next));
    set(next);
}
/** Allows the given categories, by default all the platform asks for. */
export function acceptAll(categories = defaultCategories) {
    saveConsent(consentOf(categories));
}
/** Allows nothing but the necessary cookies. */
export function rejectAll() {
    saveConsent(consentOf([]));
}
/** Forgets the choice, so the banner shows again, e.g. behind a "Cookie settings" link. */
export function resetConsent() {
    writeCookie(`${CONSENT_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`);
    set(null);
}
