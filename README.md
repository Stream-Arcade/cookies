# @stream-arcade/cookies

The StreamArcade cookie banner as a React component. Every app shows the same banner with
its own logo; the visitor decides once and the choice holds for every game on the origin.

It needs no Tailwind: styling is plain CSS with CSS variables.

The categories the banner asks for live in `defaultCategories` in [src/core.ts](src/core.ts).
Change them there once and every app gets it with the next release.

## Installation

```sh
pnpm add github:Stream-Arcade/cookies#v1.0.0
```

`dist/` is committed, so installing needs no build step. Peer dependency: `react >= 18`.

## Usage

Render it once, anywhere in the app. It is fixed to the bottom of the window and renders
nothing once the visitor decided:

```tsx
import { CookieBanner } from '@stream-arcade/cookies';
import '@stream-arcade/cookies/cookies.css';

<CookieBanner logo={`${import.meta.env.BASE_URL}logo.svg`} name="GeoGrid" lang={lang} />;
```

`logo` is an image URL or your own element, e.g. an inline SVG component:

```tsx
<CookieBanner logo={<Logo />} lang={lang} />
```

With Tailwind v4, import the CSS **after** Tailwind in your stylesheet:

```css
@import 'tailwindcss';
@import '@stream-arcade/cookies/cookies.css';
```

## Using the consent

`useCookieConsent()` returns the visitor's choice. It has the shape the `consent` prop of
[@stream-arcade/tags](https://github.com/Stream-Arcade/tags) takes:

```tsx
import { CookieBanner, useCookieConsent } from '@stream-arcade/cookies';
import { Tags } from '@stream-arcade/tags';

function Platform() {
  const { consent } = useCookieConsent();
  return (
    <>
      <Tags consent={consent} />
      <CookieBanner logo={<Logo />} />
    </>
  );
}
```

| Field     | Meaning                                                                              |
| --------- | ------------------------------------------------------------------------------------ |
| `consent` | `{ analytics, marketing }`, `undefined` until the visitor decided                    |
| `status`  | `'pending'` (server, hydration), `'undecided'` (banner shows) or `'decided'`         |
| `accept`  | allows all categories, or the ones passed                                            |
| `reject`  | allows only the necessary cookies                                                    |
| `save`    | stores a `{ analytics, marketing }` choice                                           |
| `reset`   | forgets the choice, so the banner shows again                                        |

Visitors must be able to change their mind. Put a button that calls `reset` where they find
it, e.g. into the footer:

```tsx
const { reset } = useCookieConsent();

<Footer>
  <button type="button" onClick={reset}>
    Cookie settings
  </button>
</Footer>;
```

The choice is stored in the cookie `_sa.consent` (`Path=/`, 180 days), next to
`_sa.language`. If the browser refuses the cookie, the choice holds until the next page load.

On the server and while hydrating the banner renders nothing, so server-rendered pages
hydrate without a mismatch.

## Overriding content

```tsx
<CookieBanner
  logo="/geogrid/logos/logo-blue.svg"
  name="GeoGrid" // alt text of a logo given as URL
  lang="de" // default labels in German ('en' | 'de')
  labels={{ text: 'Wir verwenden Cookies.' }} // single labels
  categories={['analytics']} // ask only for these
  privacyLink={{ href: '/privacy/', label: 'Datenschutz' }} // `false` hides it
  position="right" // 'left' (default) | 'center' | 'right'
/>
```

`defaultLabels` and `defaultCategories` are exported.

## Overriding the design

**CSS variables**, either in your CSS or through `style`:

| Variable              | Default                     |
| --------------------- | --------------------------- |
| `--sac-bg`            | `#1c1b2e`                   |
| `--sac-color`         | `rgb(255 255 255 / 0.7)`    |
| `--sac-color-strong`  | `#fff`                      |
| `--sac-border-color`  | `rgb(255 255 255 / 0.12)`   |
| `--sac-accent`        | `#fff`                      |
| `--sac-accent-color`  | `#1c1b2e`                   |
| `--sac-radius`        | `1rem`                      |
| `--sac-button-radius` | `0.625rem`                  |
| `--sac-shadow`        | `0 1.25rem 3rem -0.75rem …` |
| `--sac-width`         | `24rem`                     |
| `--sac-offset`        | `1rem`                      |
| `--sac-padding`       | `1.25rem`                   |
| `--sac-gap`           | `1rem`                      |
| `--sac-font-size`     | `0.875rem`                  |
| `--sac-line-height`   | `1.375rem`                  |
| `--sac-logo-height`   | `2.5rem`                    |
| `--sac-z-index`       | `1000`                      |
| `--sac-transition`    | `150ms …`                   |

```tsx
<CookieBanner
  logo={<Logo />}
  style={{ '--sac-accent': '#f6c432', '--sac-logo-height': '3rem' } as React.CSSProperties}
/>
```

**Classes**: `className` goes on the banner, and `classNames` targets individual parts
(`root`, `logo`, `text`, `privacyLink`, `options`, `option`, `actions`, `button`,
`primaryButton`, `customizeButton`):

```tsx
<CookieBanner className="font-display" classNames={{ primaryButton: 'bg-primary text-dark' }} />
```

The package's rules live in `@layer components`. That's why unlayered CSS and Tailwind
utilities override them without `!important`. Your own CSS can also target the classes
`.sac-banner`, `.sac-logo`, `.sac-text`, `.sac-link`, `.sac-options`, `.sac-option`,
`.sac-switch`, `.sac-actions`, `.sac-button`, `.sac-button--primary` and `.sac-customize`
directly.

"Only necessary" and "Accept all" have the same size on purpose: refusing must be as easy
as accepting. Keep that when restyling.

## Without React

`@stream-arcade/cookies/core` has the consent store without importing React:

```ts
import { getConsent, parseConsent, subscribeConsent } from '@stream-arcade/cookies/core';

getConsent(); // browser: { analytics, marketing } or null
subscribeConsent(() => console.log(getConsent()));
parseConsent(request.headers.cookie ?? ''); // server
```

## Development

```sh
pnpm install
pnpm build   # writes dist/ – commit it, it's what consumers install
```

Release: bump the version in `package.json`, run `pnpm build`, commit, then `git tag vX.Y.Z` and push the tag.
