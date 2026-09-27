import test from 'node:test';
import assert from 'node:assert/strict';
import { DialogController } from '../js/ui/dialog-controller.js';

/** Minimal focus surface; browser rendering is checked separately. */
class Element {
  constructor(tagName = 'DIV', { id = '', tabIndex = -1, hidden = false } = {}) {
    Object.assign(this, { tagName, id, tabIndex, hidden, inert: false, dataset: {}, children: [], parentElement: null, style: { overflow: '' } });
  }
  add(...children) { children.forEach(child => { child.parentElement = this; this.children.push(child); }); return this; }
  get isConnected() { return this === document.body || Boolean(this.parentElement?.isConnected); }
  addEventListener() {}
  removeEventListener() {}
  setAttribute(key, value) { this[key] = value; }
  focus() { document.activeElement = this; }
  contains(element) { return element === this || this.children.some(child => child.contains(element)); }
  closest() { return this.hidden || this.inert ? this : this.parentElement?.closest() || null; }
  getClientRects() { return this.closest() ? [] : [{}]; }
  descendants() { return this.children.flatMap(child => [child, ...child.descendants()]); }
  querySelectorAll(selector) {
    return this.descendants().filter(element => selector === '[data-folder-id]' ? element.dataset.folderId : element.tagName === 'BUTTON' && !element.disabled);
  }
  querySelector(selector) { return this.descendants().find(element => `#${element.id}` === selector) || null; }
}

function fixture(t) {
  const previousDocument = globalThis.document;
  const body = new Element('BODY');
  body.style.overflow = 'scroll';
  const background = new Element();
  const trigger = new Element('BUTTON', { tabIndex: 0 });
  const modal = new Element('DIV', { hidden: true });
  const first = new Element('BUTTON', { tabIndex: 0 });
  const skipped = new Element('BUTTON', { tabIndex: -1 });
  const last = new Element('BUTTON', { tabIndex: 0 });
  modal.add(first, skipped, last);
  background.add(trigger);
  body.add(background, modal);
  const listeners = new Map();
  globalThis.document = {
    body, activeElement: trigger,
    addEventListener(type, listener) { const handlers = listeners.get(type) || new Set(); handlers.add(listener); listeners.set(type, handlers); },
    removeEventListener(type, listener) { listeners.get(type)?.delete(listener); },
    querySelectorAll: selector => body.querySelectorAll(selector),
    getElementById: id => body.descendants().find(element => element.id === id)
  };
  const dialogs = [];
  t.after(() => { [...dialogs].reverse().forEach(dialog => dialog.destroy()); globalThis.document = previousDocument; });
  const create = (element = modal) => { const dialog = new DialogController(element); dialogs.push(dialog); return dialog; };
  return { body, background, trigger, modal, first, skipped, last, create, listeners };
}

function key(key, shiftKey = false) {
  return { key, shiftKey, prevented: false, preventDefault() { this.prevented = true; }, stopPropagation() {} };
}

test('dialog traps keyboard focus, excludes negative tabindex, and restores focus on Escape', t => {
  const surface = fixture(t);
  const dialog = surface.create();
  dialog.open();
  assert.equal(document.activeElement, surface.first);
  assert.equal(surface.background.inert, true);
  assert.equal(surface.body.style.overflow, 'hidden');
  assert.deepEqual(dialog.focusableElements(), [surface.first, surface.last]);
  const back = key('Tab', true);
  dialog.handleKeydown(back);
  assert.equal(back.prevented, true);
  assert.equal(document.activeElement, surface.last);
  dialog.handleKeydown(key('Tab'));
  assert.equal(document.activeElement, surface.first);
  dialog.handleKeydown(key('Escape'));
  assert.equal(dialog.isOpen, false);
  assert.equal(surface.modal.hidden, true);
  assert.equal(surface.background.inert, false);
  assert.equal(surface.body.style.overflow, 'scroll');
  assert.equal(document.activeElement, surface.trigger);
  assert.equal(surface.listeners.get('keydown').size, 0);
});

test('nested dialog only closes the top layer and restores its underlying dialog', t => {
  const surface = fixture(t);
  const child = new Element('DIV', { hidden: true });
  const childButton = new Element('BUTTON', { tabIndex: 0 });
  child.add(childButton);
  surface.body.add(child);
  const parentDialog = surface.create();
  const childDialog = surface.create(child);
  parentDialog.open();
  childDialog.open();
  assert.equal(surface.modal.inert, true);
  parentDialog.handleKeydown(key('Escape'));
  assert.equal(parentDialog.isOpen, true);
  childDialog.handleKeydown(key('Escape'));
  assert.equal(childDialog.isOpen, false);
  assert.equal(parentDialog.isOpen, true);
  assert.equal(surface.modal.inert, false);
  assert.equal(surface.background.inert, true);
  assert.equal(document.activeElement, surface.first);
  parentDialog.close();
  assert.equal(surface.background.inert, false);
  assert.equal(child.inert, false);
});

test('focus restoration survives a route button being replaced after completion', t => {
  const surface = fixture(t);
  surface.trigger.dataset.folderId = 'g1-m1-anatomy';
  const dialog = surface.create();
  dialog.open();
  const replacement = new Element('BUTTON', { tabIndex: 0 });
  replacement.dataset.folderId = surface.trigger.dataset.folderId;
  surface.background.children = [];
  surface.trigger.parentElement = null;
  surface.background.add(replacement);
  dialog.close();
  assert.equal(document.activeElement, replacement);
});
