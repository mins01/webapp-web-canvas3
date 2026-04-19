export default class ShortcutManager {
  constructor(options = {}) {
    this.shortcuts = new Map();
    this.enabled = true;

    this.options = {
      ignoreInput: true,
      target: window,
      ...options
    };
    this.target = this.options.target

    this._handler = this.handleKeyup.bind(this);
    this.target.addEventListener('keyup', this._handler);
  }

  destroy() {
    this.target.removeEventListener('keyup', this._handler);
    this.shortcuts.clear();
  }

  enable() {
    this.enabled = true;
  }

  disable() {
    this.enabled = false;
  }

  register(keyCombo, callback, opts = {}) {
    const key = this._normalize(keyCombo);
    console.debug('ShortcutManager:register', key);
    this.shortcuts.set(key, {
      callback,
      preventDefault: opts.preventDefault ?? true
    });
  }

  unregister(keyCombo) {
    const key = this._normalize(keyCombo);
    this.shortcuts.delete(key);
  }

  handleKeyup(e) {
    if (!this.enabled) return;

    if (this.options.ignoreInput) {
      const tag = e.target.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable) {
        return;
      }
    }

    const key = this._eventToKey(e);
    const shortcut = this.shortcuts.get(key);

    if (shortcut) {
      if (shortcut.preventDefault) {
        e.preventDefault();
      }
      shortcut.callback(e);
    }
  }

  _eventToKey(e) {
    const keys = [];

    if (e.ctrlKey) keys.push('ctrl');
    if (e.altKey) keys.push('alt');
    if (e.shiftKey) keys.push('shift');
    if (e.metaKey) keys.push('meta');

    keys.push(e.key.toLowerCase());

    return keys.join('+');
  }

  _normalize(keyCombo) {
    return keyCombo
      .toLowerCase()
      .split('+')
      .map(k => k.trim())
      .sort() // 순서 무관하게 처리
      .join('+');
  }
}

// const shortcuts = new ShortcutManager();

// // Ctrl + S
// shortcuts.register('ctrl+s', (e) => {
//   console.log('저장!');
// });

// // Shift + A
// shortcuts.register('shift+a', () => {
//   console.log('Shift + A');
// });

// // 해제
// shortcuts.unregister('shift+a');

// // 전체 비활성화
// shortcuts.disable();