import { useSyncExternalStore } from 'react';
import { acceptAll, getConsent, rejectAll, resetConsent, saveConsent, subscribeConsent, } from './core.js';
const getServerSnapshot = () => undefined;
/** The visitor's cookie consent, kept in sync with the banner. */
export function useCookieConsent() {
    const snapshot = useSyncExternalStore(subscribeConsent, getConsent, getServerSnapshot);
    return {
        status: snapshot === undefined ? 'pending' : snapshot === null ? 'undecided' : 'decided',
        consent: snapshot ?? undefined,
        accept: acceptAll,
        reject: rejectAll,
        save: saveConsent,
        reset: resetConsent,
    };
}
