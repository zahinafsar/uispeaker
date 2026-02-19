# UISpeaker

[![npm version](https://img.shields.io/npm/v/uispeaker.svg)](https://www.npmjs.com/package/uispeaker)
[![license](https://img.shields.io/npm/l/uispeaker.svg)](https://github.com/zahinafsar/uispeaker/blob/main/LICENSE)
[![bundle size](https://img.shields.io/bundlephobia/minzip/uispeaker)](https://bundlephobia.com/package/uispeaker)

Add sound to your UI with a single data attribute. Framework-agnostic, CDN-loaded, zero dependencies.

- **One data attribute** -- `data-uispeaker="click"` on any element, no JS required
- **Framework agnostic** -- works with React, Vue, Svelte, plain HTML
- **13 curated sounds** -- loaded on demand from CDN, under 50KB each
- **Smart event detection** -- auto-maps clicks, keystrokes, hovers, toggles, notifications

## Quick Start

### Script Tag (CDN)

```html
<script src="https://unpkg.com/uispeaker"></script>
<button data-uispeaker="click">Save</button>
```

### ES Module (npm)

```bash
npm i uispeaker
```

```js
import { UISpeaker } from 'uispeaker';

const speaker = new UISpeaker();
speaker.init();
```

## Documentation

Full docs and live demos: [zahinafsar.github.io/uispeaker](https://zahinafsar.github.io/uispeaker)

Core package: [`packages/core`](./packages/core)

## License

MIT
