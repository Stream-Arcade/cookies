import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useId, useState } from 'react';
import { consentOf, defaultCategories } from './core.js';
import { useCookieConsent } from './useCookieConsent.js';
export const defaultLabels = {
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
function cx(...names) {
    return names.filter(Boolean).join(' ');
}
/**
 * Asks once for the cookie consent and renders nothing after the visitor decided. The
 * choice is shared by every StreamArcade app; read it with `useCookieConsent()`.
 */
export function CookieBanner({ logo, name, lang = 'en', labels: labelOverrides, categories = defaultCategories, privacyLink, position = 'left', className, classNames = {}, style, }) {
    const { status, accept, reject, save } = useCookieConsent();
    const [customizing, setCustomizing] = useState(false);
    const [draft, setDraft] = useState(() => consentOf([]));
    const id = useId();
    if (status !== 'undecided')
        return null;
    const labels = { ...defaultLabels[lang], ...labelOverrides };
    const buttonClass = cx('sac-button', classNames.button);
    // The banner may show again after a reset; it then starts closed and empty.
    const decide = (action) => {
        setCustomizing(false);
        setDraft(consentOf([]));
        action();
    };
    return (_jsxs("section", { role: "dialog", "aria-modal": "false", "aria-label": labels.title, "aria-describedby": `${id}-text`, "data-position": position, className: cx('sac-banner', className, classNames.root), style: style, children: [logo != null &&
                logo !== false &&
                (typeof logo === 'string' ? (_jsx("img", { src: logo, alt: name ?? '', className: cx('sac-logo', classNames.logo) })) : (_jsx("div", { className: cx('sac-logo', classNames.logo), children: logo }))), _jsxs("p", { id: `${id}-text`, className: cx('sac-text', classNames.text), children: [labels.text, privacyLink !== false && (_jsxs(_Fragment, { children: [' ', _jsx("a", { href: privacyLink?.href ?? '/privacy/', className: cx('sac-link', classNames.privacyLink), children: privacyLink?.label ?? labels.privacy })] }))] }), customizing && (_jsxs("ul", { className: cx('sac-options', classNames.options), children: [_jsxs("li", { className: cx('sac-option', classNames.option), children: [_jsxs("label", { htmlFor: `${id}-necessary`, className: "sac-option-label", children: [_jsx("span", { className: "sac-option-name", children: labels.necessary }), _jsx("span", { className: "sac-option-hint", children: labels.necessaryHint })] }), _jsx("input", { id: `${id}-necessary`, type: "checkbox", className: "sac-switch", checked: true, disabled: true })] }), categories.map((category) => (_jsxs("li", { className: cx('sac-option', classNames.option), children: [_jsxs("label", { htmlFor: `${id}-${category}`, className: "sac-option-label", children: [_jsx("span", { className: "sac-option-name", children: labels[category] }), _jsx("span", { className: "sac-option-hint", children: labels[`${category}Hint`] })] }), _jsx("input", { id: `${id}-${category}`, type: "checkbox", className: "sac-switch", checked: draft[category], onChange: (e) => setDraft({ ...draft, [category]: e.target.checked }) })] }, category)))] })), _jsxs("div", { className: cx('sac-actions', classNames.actions), children: [customizing ? (_jsx("button", { type: "button", className: buttonClass, onClick: () => decide(() => save(draft)), children: labels.save })) : (_jsx("button", { type: "button", className: buttonClass, onClick: () => decide(reject), children: labels.reject })), _jsx("button", { type: "button", className: cx(buttonClass, 'sac-button--primary', classNames.primaryButton), onClick: () => decide(() => accept(categories)), children: labels.accept })] }), !customizing && (_jsx("button", { type: "button", className: cx('sac-customize', classNames.customizeButton), onClick: () => setCustomizing(true), children: labels.customize }))] }));
}
