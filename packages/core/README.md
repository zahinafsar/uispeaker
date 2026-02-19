# uispeaker

Add interactive sounds to any HTML element with a single data attribute. No framework required.

## Install

```bash
npm install uispeaker
```

## Quick Start

### Script Tag (auto-initializes)

```html
<script src="https://unpkg.com/uispeaker/dist/uispeaker.global.js"></script>

<button data-uispeaker="click">Click me</button>
<input data-uispeaker="keystroke" placeholder="Type here..." />
```

That's it. The library scans the DOM, detects elements with `data-uispeaker`, and binds the appropriate sound automatically.

### ES Module

```ts
import { UISpeaker } from 'uispeaker';

const speaker = new UISpeaker();
speaker.init();
```

Or use the convenience `init` function:

```ts
import { init } from 'uispeaker';

const speaker = init({ volume: 0.8 });
```

## Data Attributes

| Attribute | Value | Description |
|-----------|-------|-------------|
| `data-uispeaker` | Sound name | The sound to play (e.g., `click`, `tap`, `pop`) |
| `data-uispeaker-event` | Event type | Override auto-detected event (e.g., `hover`, `input`) |
| `data-uispeaker-close` | Sound name | Sound to play on close (for toggle elements) |

### Event Auto-Detection

The library infers the right event based on the element type:

| Element | Inferred Event |
|---------|---------------|
| `<button>`, `<a>`, ARIA roles | `click` |
| `<input type="text">`, `<textarea>` | `input` (debounced) |
| `<input type="checkbox">`, `<select>` | `click` |
| `<details>`, `<dialog>` | `open` / `close` |
| Elements with `data-state` | `open` / `close` |

Override with `data-uispeaker-event`:

```html
<div data-uispeaker="hover" data-uispeaker-event="hover">Hover me</div>
```

## Built-in Sounds

| Name | Category | Event | Description |
|------|----------|-------|-------------|
| `click` | click | click | Short digital click |
| `tap` | click | click | Soft tap for toggles |
| `pop` | click | click | Bubble pop for playful interactions |
| `keystroke` | input | input | Single key press |
| `typewriter` | input | input | Mechanical typewriter key |
| `hover` | hover | hover | Subtle swoosh |
| `swoosh` | hover | hover | Pronounced swoosh |
| `slide` | mousemove | mousemove | Smooth slide |
| `open` | toggle | open | Opening tone |
| `close` | toggle | close | Closing tone |
| `success` | notification | success | Positive chime |
| `error` | notification | error | Alert tone |
| `warning` | notification | warning | Cautionary beep |

## Examples

### Buttons

```html
<button data-uispeaker="click">Save</button>
<button data-uispeaker="pop">Add to Cart</button>
<button data-uispeaker="tap">Toggle</button>
```

### Text Input

```html
<input data-uispeaker="keystroke" type="text" />
<textarea data-uispeaker="typewriter"></textarea>
```

### Hover Effects

```html
<div data-uispeaker="hover" data-uispeaker-event="hover">
  Hover for sound
</div>
```

### Dropdowns and Dialogs

```html
<details data-uispeaker="open" data-uispeaker-close="close">
  <summary>Open me</summary>
  <p>Content here</p>
</details>
```

### Notifications (Programmatic)

```ts
import { UISpeaker } from 'uispeaker';

const speaker = new UISpeaker();
speaker.init();

// Play sounds programmatically
speaker.play('success');
speaker.play('error');
speaker.play('warning');
```

## JavaScript API

### Constructor

```ts
const speaker = new UISpeaker({
  cdnBase: 'https://your-cdn.com/sounds',  // Custom sound URL base
  volume: 0.8,                              // 0-1, default: 1
  muted: false,                             // Start muted, default: false
  root: document.body,                      // Root element to scan
  inputDebounce: 80,                        // Input debounce ms, default: 80
  mousemoveThrottle: 100,                   // Mousemove throttle ms, default: 100
});
```

### Methods

| Method | Description |
|--------|-------------|
| `init(root?)` | Start scanning and observing the DOM |
| `play(name)` | Play a sound by name |
| `volume(v)` | Set master volume (0-1) |
| `getVolume()` | Get current volume |
| `mute()` | Mute all sounds |
| `unmute()` | Unmute |
| `isMuted()` | Check mute state |
| `register(name, entry)` | Register a custom sound |
| `setCdnBase(url)` | Change the CDN base URL |
| `sounds()` | List all available sound names |
| `destroy()` | Tear down and clean up |

### Register Custom Sounds

```ts
speaker.register('custom-ding', {
  url: '/sounds/ding.mp3',
  defaultEvent: 'click',
  category: 'custom',
});
```

```html
<button data-uispeaker="custom-ding">Custom Sound</button>
```

## Script Tag API

When loaded via `<script>` tag, the library creates a `window.UISpeaker` global with the following methods:

```html
<script src="https://unpkg.com/uispeaker/dist/uispeaker.global.js"></script>
<script>
  UISpeaker.volume(0.5);
  UISpeaker.mute();
  UISpeaker.unmute();
  UISpeaker.play('success');
  UISpeaker.register('ding', { url: '/sounds/ding.mp3' });
</script>
```

## Browser Support

Works in all modern browsers that support the Web Audio API:

- Chrome 35+
- Firefox 25+
- Safari 14.1+
- Edge 79+

Note: Browsers require a user gesture (click, tap, keypress) before audio can play. UISpeaker handles this automatically -- sounds will begin playing after the user's first interaction with the page.

## Bundle Size

| Format | Minified | Gzipped |
|--------|----------|---------|
| IIFE (script tag) | ~12 KB | ~4 KB |
| ESM | ~11 KB | ~3.7 KB |
| CJS | ~11 KB | ~3.7 KB |

Sounds are loaded on demand from CDN and are not included in the bundle.

## License

MIT
