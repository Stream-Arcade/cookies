import { type CSSProperties, type ReactNode } from 'react';
import { type ConsentCategory } from './core.js';
export type CookieBannerLang = 'en' | 'de';
export interface CookieBannerLabels {
    /** Name of the banner for screen readers. */
    title: string;
    text: string;
    privacy: string;
    accept: string;
    reject: string;
    customize: string;
    save: string;
    necessary: string;
    necessaryHint: string;
    analytics: string;
    analyticsHint: string;
    marketing: string;
    marketingHint: string;
}
export declare const defaultLabels: Record<CookieBannerLang, CookieBannerLabels>;
export interface CookieBannerPrivacyLink {
    href?: string;
    label?: ReactNode;
}
export interface CookieBannerClassNames {
    root?: string;
    logo?: string;
    text?: string;
    privacyLink?: string;
    options?: string;
    option?: string;
    actions?: string;
    button?: string;
    primaryButton?: string;
    customizeButton?: string;
}
export interface CookieBannerProps {
    /** The game's logo: an image URL or your own element, e.g. an inline `<svg>`. */
    logo?: ReactNode;
    /** The game's name. Alt text of a logo given as URL. */
    name?: string;
    /** Language of the default labels. */
    lang?: CookieBannerLang;
    /** Overrides single default labels, e.g. for another language. */
    labels?: Partial<CookieBannerLabels>;
    /** Replaces the categories the visitor is asked for. */
    categories?: readonly ConsentCategory[];
    /** Link to the privacy policy (contract: the hub serves it at `/privacy/`). `false` hides it. */
    privacyLink?: CookieBannerPrivacyLink | false;
    /** Where the card sits on wide screens. Narrow screens always get the full width. */
    position?: 'left' | 'center' | 'right';
    className?: string;
    classNames?: CookieBannerClassNames;
    /** Also the place to set the `--sac-*` CSS variables. */
    style?: CSSProperties;
}
/**
 * Asks once for the cookie consent and renders nothing after the visitor decided. The
 * choice is shared by every StreamArcade app; read it with `useCookieConsent()`.
 */
export declare function CookieBanner({ logo, name, lang, labels: labelOverrides, categories, privacyLink, position, className, classNames, style, }: CookieBannerProps): import("react").JSX.Element | null;
