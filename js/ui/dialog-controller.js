const openDialogs = [];
const originalInert = new Map();
let originalOverflow = '';
const focusableSelector = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

function updateBackground() {
  originalInert.forEach((value, element) => { element.inert = value; });
  const top = openDialogs.at(-1);
  if (!top) {
    originalInert.clear();
    document.body.style.overflow = originalOverflow;
    return;
  }
  let branch = top.element;
  while (branch && branch !== document.body) {
    for (const sibling of branch.parentElement?.children || []) {
      if (sibling === branch || ['SCRIPT', 'STYLE', 'LINK'].includes(sibling.tagName)) continue;
      if (!originalInert.has(sibling)) originalInert.set(sibling, sibling.inert);
      sibling.inert = true;
    }
    branch = branch.parentElement;
  }
}

/** Accessible dialog lifecycle shared by every overlay, including nested dialogs. */
export class DialogController {
  constructor(element, { onClose, initialFocus } = {}) {
    this.element = element;
    this.onClose = onClose;
    this.initialFocus = initialFocus;
    this.isOpen = false;
    this.handleKeydown = (event) => {
      if (openDialogs.at(-1) !== this) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        this.close();
      } else if (event.key === 'Tab') {
        const items = this.focusableElements();
        const first = items[0];
        const last = items.at(-1);
        if (!first) {
          event.preventDefault();
          this.element.focus();
        } else if (event.shiftKey && (document.activeElement === first || !items.includes(document.activeElement))) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && (document.activeElement === last || !items.includes(document.activeElement))) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    this.handleFocus = (event) => {
      if (openDialogs.at(-1) === this && !this.element.contains(event.target)) this.focus();
    };
    this.handleBackdrop = (event) => {
      if (event.target === this.element && openDialogs.at(-1) === this) this.close();
    };
    this.element?.addEventListener('click', this.handleBackdrop);
  }

  focusableElements() {
    return [...this.element.querySelectorAll(focusableSelector)].filter(element =>
      element.tabIndex >= 0 && !element.closest('[hidden], [inert]') && element.getClientRects().length > 0
    );
  }

  focus() {
    const requested = typeof this.initialFocus === 'string'
      ? this.element.querySelector(this.initialFocus) : this.initialFocus;
    (requested || this.focusableElements()[0] || this.element).focus();
  }

  open() {
    if (!this.element || this.isOpen) return;
    this.returnFocus = document.activeElement;
    this.returnFocusId = this.returnFocus?.id;
    this.returnFolderId = this.returnFocus?.dataset?.folderId;
    if (openDialogs.length === 0) originalOverflow = document.body.style.overflow;
    this.isOpen = true;
    this.element.hidden = false;
    this.element.setAttribute('role', 'dialog');
    this.element.setAttribute('aria-modal', 'true');
    this.element.tabIndex = -1;
    openDialogs.push(this);
    document.body.style.overflow = 'hidden';
    updateBackground();
    document.addEventListener('keydown', this.handleKeydown);
    document.addEventListener('focusin', this.handleFocus);
    this.focus();
  }

  close() {
    if (!this.isOpen) return;
    const wasTop = openDialogs.at(-1) === this;
    openDialogs.splice(openDialogs.indexOf(this), 1);
    this.isOpen = false;
    this.element.hidden = true;
    document.removeEventListener('keydown', this.handleKeydown);
    document.removeEventListener('focusin', this.handleFocus);
    updateBackground();
    if (wasTop) {
      // A completed lesson may re-render the route while its dialog is open.
      const restoredTarget = this.returnFocus?.isConnected ? this.returnFocus
        : this.returnFocusId ? document.getElementById(this.returnFocusId)
          : [...document.querySelectorAll('[data-folder-id]')].find(element => element.dataset.folderId === this.returnFolderId);
      if (restoredTarget && !restoredTarget.closest('[hidden], [inert]')) restoredTarget.focus();
      else openDialogs.at(-1)?.focus();
    }
    this.onClose?.();
  }

  destroy() {
    this.close();
    this.element?.removeEventListener('click', this.handleBackdrop);
  }
}
