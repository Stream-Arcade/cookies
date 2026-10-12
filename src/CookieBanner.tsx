import { useId, useState, type CSSProperties, type ReactNode } from 'react';
import { consentOf, defaultCategories, type Consent, type ConsentCategory } from './core.js';
import { useCookieConsent } from './useCookieConsent.js';

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

export const defaultLabels: Record<CookieBannerLang, CookieBannerLabels> = {
  en: {
    title: 'Cookie settings',
    text: 'We use cookies that are needed to run the games. With your consent we also use cookies to see how the games are played.',
    privacy: 'Privacy',
    accept: 'Accept all',
    reject: 'Only necessary',
    customize: 'Customize',
    save: 'Save selection',
    necessary: 'Necessary',
    necessaryHint: 'Language and game state. Always on.',
    analytics: 'Analytics',
    analyticsHint: 'Shows us which games are played.',
    marketing: 'Marketing',
    marketingHint: 'Content and ads from partners.',
  },
  de: {
    title: 'Cookie-Einstellungen',
    text: 'Wir verwenden Cookies, die für den Betrieb der Spiele nötig sind. Mit deiner Zustimmung nutzen wir außerdem Cookies, um zu sehen, wie die Spiele gespielt werden.',
    privacy: 'Datenschutz',
    accept: 'Alle akzeptieren',
    reject: 'Nur notwendige',
    customize: 'Anpassen',
    save: 'Speichern',
    necessary: 'Notwendig',
    necessaryHint: 'Sprache und Spielstand. Immer aktiv.',
    analytics: 'Statistik',
    analyticsHint: 'Zeigt uns, welche Spiele gespielt werden.',
    marketing: 'Marketing',
    marketingHint: 'Inhalte und Werbung von Partnern.',
  },
};

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

function cx(...names: (string | undefined | false)[]) {
  return names.filter(Boolean).join(' ');
}

/**
 * Asks once for the cookie consent and renders nothing after the visitor decided. The
 * choice is shared by every StreamArcade app; read it with `useCookieConsent()`.
 */
export function CookieBanner({
  logo,
  name,
  lang = 'en',
  labels: labelOverrides,
  categories = defaultCategories,
  privacyLink,
  position = 'left',
  className,
  classNames = {},
  style,
}: CookieBannerProps) {
  const { status, accept, reject, save } = useCookieConsent();
  const [customizing, setCustomizing] = useState(false);
  const [draft, setDraft] = useState<Consent>(() => consentOf([]));
  const id = useId();

  if (status !== 'undecided') return null;

  const labels = { ...defaultLabels[lang], ...labelOverrides };
  const buttonClass = cx('sac-button', classNames.button);
  // The banner may show again after a reset; it then starts closed and empty.
  const decide = (action: () => void) => {
    setCustomizing(false);
    setDraft(consentOf([]));
    action();
  };

  return (
    <section
      role="dialog"
      aria-modal="false"
      aria-label={labels.title}
      aria-describedby={`${id}-text`}
      data-position={position}
      className={cx('sac-banner', className, classNames.root)}
      style={style}
    >
      {logo != null &&
        logo !== false &&
        (typeof logo === 'string' ? (
          <img src={logo} alt={name ?? ''} className={cx('sac-logo', classNames.logo)} />
        ) : (
          <div className={cx('sac-logo', classNames.logo)}>{logo}</div>
        ))}

      <p id={`${id}-text`} className={cx('sac-text', classNames.text)}>
        {labels.text}
        {privacyLink !== false && (
          <>
            {' '}
            <a
              href={privacyLink?.href ?? '/privacy/'}
              className={cx('sac-link', classNames.privacyLink)}
            >
              {privacyLink?.label ?? labels.privacy}
            </a>
          </>
        )}
      </p>

      {customizing && (
        <ul className={cx('sac-options', classNames.options)}>
          <li className={cx('sac-option', classNames.option)}>
            <label htmlFor={`${id}-necessary`} className="sac-option-label">
              <span className="sac-option-name">{labels.necessary}</span>
              <span className="sac-option-hint">{labels.necessaryHint}</span>
            </label>
            <input id={`${id}-necessary`} type="checkbox" className="sac-switch" checked disabled />
          </li>
          {categories.map((category) => (
            <li key={category} className={cx('sac-option', classNames.option)}>
              <label htmlFor={`${id}-${category}`} className="sac-option-label">
                <span className="sac-option-name">{labels[category]}</span>
                <span className="sac-option-hint">{labels[`${category}Hint`]}</span>
              </label>
              <input
                id={`${id}-${category}`}
                type="checkbox"
                className="sac-switch"
                checked={draft[category]}
                onChange={(e) => setDraft({ ...draft, [category]: e.target.checked })}
              />
            </li>
          ))}
        </ul>
      )}

      <div className={cx('sac-actions', classNames.actions)}>
        {customizing ? (
          <button type="button" className={buttonClass} onClick={() => decide(() => save(draft))}>
            {labels.save}
          </button>
        ) : (
          <button type="button" className={buttonClass} onClick={() => decide(reject)}>
            {labels.reject}
          </button>
        )}
        <button
          type="button"
          className={cx(buttonClass, 'sac-button--primary', classNames.primaryButton)}
          onClick={() => decide(() => accept(categories))}
        >
          {labels.accept}
        </button>
      </div>

      {!customizing && (
        <button
          type="button"
          className={cx('sac-customize', classNames.customizeButton)}
          onClick={() => setCustomizing(true)}
        >
          {labels.customize}
        </button>
      )}
    </section>
  );
}
