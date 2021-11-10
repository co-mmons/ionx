import { createEvent, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { prefetchComponent } from 'ionx/utils';

const toggleLabelsCss = ".sc-ionx-toggle-labels-h{display:flex;align-items:center}.ionx--readonly.sc-ionx-toggle-labels-h .ionx--on.sc-ionx-toggle-labels,.ionx--readonly.sc-ionx-toggle-labels-h .ionx--off.sc-ionx-toggle-labels,.ionx--readonly.sc-ionx-toggle-labels-h .ionx--default-toggle.sc-ionx-toggle-labels{display:none}.sc-ionx-toggle-labels-h .ionx--on.sc-ionx-toggle-labels{margin-left:4px}.sc-ionx-toggle-labels-h .ionx--on.sc-ionx-toggle-labels:empty{display:none}.sc-ionx-toggle-labels-h .ionx--off.sc-ionx-toggle-labels{margin-right:4px}.sc-ionx-toggle-labels-h .ionx--off.sc-ionx-toggle-labels:empty{display:none}.ionx--interactive.sc-ionx-toggle-labels-h .ionx--on.sc-ionx-toggle-labels{cursor:pointer}.ionx--interactive.sc-ionx-toggle-labels-h .ionx--off.sc-ionx-toggle-labels{cursor:pointer}.sc-ionx-toggle-labels-s>ion-toggle,.sc-ionx-toggle-labels-h ion-toggle.sc-ionx-toggle-labels{padding-inline-start:2px;padding-inline-end:2px}.item-label-stacked.sc-ionx-toggle-labels-h,.item-label-stacked .sc-ionx-toggle-labels-h{align-self:flex-start}.ios.sc-ionx-toggle-labels-h .item-label-stacked.sc-ionx-toggle-labels,.ios .item-label-stacked .sc-ionx-toggle-labels-h{margin-top:2px;margin-bottom:2px}ionx-form-field [slot-container=default]>.sc-ionx-toggle-labels-h{margin-left:16px;margin-right:16px;min-height:38px}";

const ToggleLabels = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.ionChange = createEvent(this, "ionChange", 7);
  }
  get toggle() {
    return this.element.querySelector("ion-toggle");
  }
  switchToggle(state) {
    if (!this.disabled && !this.readonly) {
      this.toggle.checked = state === "on";
    }
  }
  toggleChanged(ev) {
    if (this.defaultToggle && ev.target !== this.element) {
      ev.preventDefault();
      ev.stopImmediatePropagation();
      ev.stopPropagation();
    }
    const was = this.value;
    this.value = this.toggle.checked;
    if (was !== this.value) {
      this.ionChange.emit({ value: this.value });
    }
  }
  valueChanged() {
    if (this.toggle.checked !== this.value) {
      this.toggle.checked = this.value;
    }
  }
  syncToggle() {
    const toggle = this.toggle;
    toggle.disabled = this.readonly || this.disabled;
  }
  componentDidLoad() {
    prefetchComponent({ delay: 0 }, "ion-toggle");
  }
  connectedCallback() {
    this.initialToggleState = { checked: this.value, disabled: this.readonly || this.disabled };
  }
  render() {
    if (this.prefetch) {
      return;
    }
    return h(Host, { class: { "ionx--interactive": !this.disabled && !this.readonly, "ionx--readonly": this.readonly } }, this.readonly && h("span", null, this.value ? this.on : this.off), h("span", { class: "ionx--off", onClick: () => this.switchToggle("off") }, this.off && h("span", null, this.off), h("slot", { name: "off" })), this.defaultToggle && h("ion-toggle", Object.assign({ class: "ionx--default-toggle" }, this.initialToggleState)), h("slot", null), h("span", { class: "ionx--on", onClick: () => this.switchToggle("on") }, this.on && h("span", null, this.on), h("slot", { name: "on" })));
  }
  get element() { return this; }
  static get watchers() { return {
    "value": ["valueChanged"],
    "readonly": ["syncToggle"],
    "disabled": ["syncToggle"]
  }; }
  static get style() { return toggleLabelsCss; }
};

const IonxToggleLabels = /*@__PURE__*/proxyCustomElement(ToggleLabels, [6,"ionx-toggle-labels",{"on":[1],"off":[1],"defaultToggle":[4,"default-toggle"],"readonly":[4],"disabled":[4],"value":[1028],"prefetch":[4]},[[0,"ionChange","toggleChanged"]]]);
const defineIonxToggleLabels = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      IonxToggleLabels
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};

export { IonxToggleLabels, defineIonxToggleLabels };
