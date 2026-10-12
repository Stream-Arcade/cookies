/** The categories a visitor can allow. Necessary cookies need no consent and are not listed. */
export type ConsentCategory = 'analytics' | 'marketing';
/** Fits the `consent` prop of `@stream-arcade/tags` as it is. */
export type Consent = Record<ConsentCategory, boolean>;
/**
 * The categories every StreamArcade app asks for. This list is the one place to add or
 * drop a category platform-wide; apps pick it up with the next release.
 */
export declare const defaultCategories: ConsentCategory[];
/** Shared across all stream-arcade apps on the same origin, hence the prefix and Path=/. */
export declare const CONSENT_COOKIE = "_sa.consent";
/** The consent with exactly the given categories allowed. */
export declare function consentOf(allowed: readonly ConsentCategory[]): Consent;
/** Reads the consent out of a `document.cookie` string. `null` means not decided yet. */
export declare function parseConsent(cookieString: string): Consent | null;
/** The string to assign to `document.cookie` to remember the consent. */
export declare function serializeConsent(consent: Consent): string;
/** The visitor's consent, `null` while they have not decided. Browser only. */
export declare function getConsent(): Consent | null;
/** Calls `listener` after every change; returns a function that stops it. */
export declare function subscribeConsent(listener: () => void): () => void;
/** Stores the visitor's choice. */
export declare function saveConsent(consent: Consent): void;
/** Allows the given categories, by default all the platform asks for. */
export declare function acceptAll(categories?: readonly ConsentCategory[]): void;
/** Allows nothing but the necessary cookies. */
export declare function rejectAll(): void;
/** Forgets the choice, so the banner shows again, e.g. behind a "Cookie settings" link. */
export declare function resetConsent(): void;
