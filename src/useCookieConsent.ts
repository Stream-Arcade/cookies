import { useSyncExternalStore } from 'react';
import {
  acceptAll,
  getConsent,
  rejectAll,
  resetConsent,
  saveConsent,
  subscribeConsent,
  type Consent,
  type ConsentCategory,
} from './core.js';

/** `'pending'` on the server and while hydrating, where the cookie cannot be read. */
export type ConsentStatus = 'pending' | 'undecided' | 'decided';

export interface CookieConsent {
  status: ConsentStatus;
  /** The visitor's choice, `undefined` until they made one. Pass it to `<Tags consent>`. */
  consent: Consent | undefined;
  accept: (categories?: readonly ConsentCategory[]) => void;
  reject: () => void;
  save: (consent: Consent) => void;
  /** Forgets the choice, so the banner shows again. */
  reset: () => void;
}

const getServerSnapshot = () => undefined;

/** The visitor's cookie consent, kept in sync with the banner. */
export function useCookieConsent(): CookieConsent {
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
