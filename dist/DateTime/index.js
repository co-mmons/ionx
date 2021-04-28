import { createEvent, h, Host, attachShadow, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { intl } from '@co.mmons/js-intl';
import { sleep, TimeZoneDate } from '@co.mmons/js-utils/core';
import { popoverController } from '@ionic/core';
import { addEventListener } from 'ionx/utils';

const defaultDateTimeFormat = {
  year: "numeric", month: "numeric", day: "numeric",
  hour: "2-digit", minute: "2-digit", second: undefined
};
const defaultDateFormat = {
  year: "numeric", month: "numeric", day: "numeric"
};

const dateTimeInputCss = ".sc-ionx-date-time-h{--date-time-placeholder-opacity:.5;position:relative;display:inline-flex;font-family:var(--ion-font-family, inherit);max-width:100%;padding:var(--date-time-padding-top, 8px) var(--date-time-padding-end, 0px) var(--date-time-padding-bottom, 8px) var(--date-time-padding-start, 0px);user-select:none;outline:none;cursor:pointer}.sc-ionx-date-time-h::-moz-focus-inner{border:0}.sc-ionx-date-time-h .ionx--text.sc-ionx-date-time{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sc-ionx-date-time-h .ionx--text.ionx--placeholder-visible.sc-ionx-date-time{opacity:var(--date-time-placeholder-opacity, 0.5)}.ionx--disabled.sc-ionx-date-time-h{opacity:var(--date-time-disabled-opacity, 0.5);pointer-events:none}.ionx--readonly.sc-ionx-date-time-h{opacity:1;pointer-events:none}.sc-ionx-date-time-h ion-button.sc-ionx-date-time{--border-radius:100%;--padding-start:4px;--padding-end:4px;margin:0px;position:absolute;height:100%;right:0px;top:0px}.item-label-stacked.sc-ionx-date-time-h,.item-label-stacked .sc-ionx-date-time-h{align-self:flex-start;--date-time-padding-start:0px;width:100%}.item-label-stacked.sc-ionx-date-time-h .ionx--text.sc-ionx-date-time,.item-label-stacked .sc-ionx-date-time-h .ionx--text.sc-ionx-date-time{max-width:calc(100% - 16px);flex:initial}";

const DateTimeInput = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.ionChange = createEvent(this, "ionChange", 7);
    this.ionFocus = createEvent(this, "ionFocus", 7);
    this.ionStyle = createEvent(this, "ionStyle", 7);
  }
  readonlyChanged() {
    this.emitStyle();
  }
  disabledChanged() {
    this.emitStyle();
  }
  valueChanged(niu, old, fireEvent = true) {
    this.formattedValue = this.formatValue();
    this.emitStyle();
    if (fireEvent && (niu !== old || (niu === null || niu === void 0 ? void 0 : niu.getTime()) !== (old === null || old === void 0 ? void 0 : old.getTime()) || (niu === null || niu === void 0 ? void 0 : niu.timeZone) !== (old === null || old === void 0 ? void 0 : old.timeZone))) {
      this.ionChange.emit({ value: niu });
    }
  }
  formatValue() {
    if (this.value) {
      const options = Object.assign({}, this.formatOptions || (this.dateOnly ? defaultDateFormat : defaultDateTimeFormat));
      if (this.value.timeZone) {
        options.timeZone = this.value.timeZone;
        if (!options.timeZoneName) {
          options.timeZoneName = "short";
        }
      }
      if (!this.value.timeZone) {
        options.timeZone = "UTC";
        options.timeZoneName = undefined;
      }
      if (this.dateOnly) {
        return intl.dateFormat(this.value, options);
      }
      else {
        return intl.dateTimeFormat(this.value, options);
      }
    }
    else {
      return null;
    }
  }
  async setFocus(options) {
    this.element.focus(options);
  }
  async setBlur() {
    this.element.blur();
  }
  onKeyDown(ev) {
    if (!this.readonly && !this.disabled && (ev.key === "Enter" || ev.key === " ")) {
      ev.preventDefault();
      this.open(ev);
    }
  }
  onFocus() {
    this.focused = true;
    this.emitStyle();
  }
  onBlur() {
    if (this.focused && !this.overlayVisible) {
      this.focused = false;
      this.emitStyle();
    }
  }
  onClick(ev) {
    if (!ev.composedPath().find(t => t.tagName === "ION-BUTTON")) {
      this.open(ev);
    }
  }
  emitStyle() {
    this.ionStyle.emit({
      "interactive": !this.disabled && !this.readonly,
      "input": true,
      "has-placeholder": this.placeholder != null,
      "has-value": !!this.value,
      "has-focus": this.focused,
      "interactive-disabled": this.disabled,
    });
  }
  clearButtonClicked(ev) {
    ev.preventDefault();
    this.clearValue();
    if (!this.focused) {
      this.setFocus();
    }
  }
  clearValue() {
    this.value = undefined;
  }
  async open(event) {
    var _a;
    if (this.nativePicker) {
      this.nativePicker = document.createElement("input");
      this.nativePicker.type = "date";
      document.body.appendChild(this.nativePicker);
      this.nativePicker.click();
    }
    else if (!this.nativePicker) {
      const overlayProps = {
        value: (_a = this.value) !== null && _a !== void 0 ? _a : new Date(),
        dateOnly: !!this.dateOnly
      };
      const popover = await popoverController.create({
        component: "ionx-date-time-overlay",
        componentProps: overlayProps,
        event,
        showBackdrop: true
      });
      popover.present();
      this.overlayVisible = true;
      const result = await popover.onWillDismiss();
      if (result.role === "ok") {
        this.value = result.data;
      }
      this.overlayVisible = false;
      this.setFocus({ preventScroll: true });
    }
  }
  connectedCallback() {
    this.valueChanged(this.value, undefined, false);
    if (!this.element.hasAttribute("tabIndex")) {
      this.element.setAttribute("tabIndex", "0");
    }
    this.initItemListener();
  }
  disconnectedCallback() {
    var _a;
    (_a = this.itemClickUnlisten) === null || _a === void 0 ? void 0 : _a.call(this);
    this.itemClickUnlisten = undefined;
  }
  async initItemListener() {
    while (!this.element.parentElement) {
      await sleep(100);
    }
    if (this.element.parentElement.tagName === "IONX-FORM-ITEM") {
      while (!this.element.assignedSlot) {
        await sleep(100);
      }
    }
    const item = this.element.closest("ion-item");
    if (item) {
      this.itemClickUnlisten = addEventListener(item, "click", ev => this.focused && ev.target === item && (this.open({ target: this.element }) || true));
    }
  }
  render() {
    var _a;
    return h(Host, null, h("div", { class: {
        "ionx--text": true,
        "ionx--placeholder-visible": !this.formattedValue && !!this.placeholder
      } }, (_a = this.formattedValue) !== null && _a !== void 0 ? _a : this.placeholder), this.clearButtonVisible && !this.readonly && !this.disabled && this.value && h("ion-button", { fill: "clear", size: "small", tabIndex: -1, onMouseDown: ev => this.clearButtonClicked(ev) }, h("ion-icon", { name: "close", slot: this.clearButtonText ? "start" : "icon-only" }), this.clearButtonText && h("span", null, this.clearButtonText)));
  }
  get element() { return this; }
  static get watchers() { return {
    "readonly": ["readonlyChanged"],
    "disabled": ["disabledChanged"],
    "value": ["valueChanged"]
  }; }
  static get style() { return dateTimeInputCss; }
};

const dateTimeOverlayCss = ":host{display:block}:host ion-input{text-align:right;--padding-end:0px}:host ion-input input::-webkit-outer-spin-button,:host ion-input input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}:host ion-input input[type=number]{-moz-appearance:textfield}:host ion-item{--inner-padding-start:16px;--inner-padding-end:16px;--padding-start:0px;--padding-end:0px}:host ion-footer{--border-width:0px}:host ion-footer::before{display:none}:host ion-footer ion-toolbar{--border-width:0px !important;--padding-start:0px;--padding-end:0px;--padding-top:0px;--padding-bottom:0px;--min-height:none;--ion-safe-area-bottom:0px;--ion-safe-area-top:0px;--ion-safe-area-start:0px;--ion-safe-area-end:0px}:host ion-footer div{flex:1;display:flex}:host ion-footer ion-button{min-height:44px;margin:0px}:host ion-footer ion-button:not(:last-child){font-weight:400}:host ion-footer ion-button:last-child{font-weight:500}:host ion-footer.md div{justify-content:flex-end}:host ion-footer.md ion-button{flex:none !important}:host ion-footer.ios ion-button{width:50%}";

const DateTimeOverlay = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    attachShadow(this);
    this.values = {};
  }
  ranges() {
    const ranges = {
      "Year": [1900, new Date().getUTCFullYear() + 2],
      "Month": [1, 12],
      "Day": [1, 31],
      "Hour": [0, 23],
      "Minute": [0, 59]
    };
    let tmp;
    // generate possible days
    for (let d = 1; d <= 31; d++) {
      if (d === 1) {
        tmp = new Date(this.date);
        ranges["Day"] = [1, 1];
      }
      tmp.setUTCDate(d);
      tmp.setUTCHours(0, 0, 0, 0);
      if (tmp.getUTCMonth() === this.date.getUTCMonth()) {
        ranges["Day"][1] = d;
      }
    }
    return ranges;
  }
  ok() {
    const popover = this.element.closest("ion-popover");
    popover.dismiss(new TimeZoneDate(this.date), "ok");
  }
  cancel() {
    const popover = this.element.closest("ion-popover");
    popover.dismiss(undefined, "cancel");
  }
  async onKeyDown(event) {
    var _a;
    const input = event.composedPath().find(t => t.tagName === "ION-INPUT");
    if (input && (event.key === "e" || event.key === "E" || event.key === "-" || event.key === "." || event.key === ",")) {
      event.preventDefault();
    }
    else if (input && event.key === "Enter") {
      const next = (_a = input.closest("ion-item").nextElementSibling) === null || _a === void 0 ? void 0 : _a.querySelector("ion-input");
      if (next) {
        event.preventDefault();
        next.setFocus();
        (await next.getInputElement()).select();
      }
      else {
        this.ok();
      }
    }
  }
  onChange(event) {
    const input = event.composedPath().find(t => t.tagName === "ION-INPUT");
    if (input) {
      const stringed = `${input.value}`;
      if (stringed.length < input.min.length) {
        return;
      }
      if (stringed.length > input.max.length || input.value > parseInt(input.max, 10)) {
        input.value = this.values[input.name];
        return;
      }
      this.values[input.name] = input.value;
      const date = new Date(this.date);
      if (input.name === "Year") {
        date.setUTCFullYear(input.value);
      }
      else if (input.name === "Month") {
        date.setUTCMonth(input.value - 1);
      }
      else if (input.name === "Day") {
        date.setUTCDate(input.value);
      }
      else if (input.name === "Minute") {
        date.setUTCMinutes(input.value, 0, 0);
      }
      else if (input.name === "Hour") {
        date.setUTCHours(input.value);
      }
      this.date = date;
    }
  }
  connectedCallback() {
    this.date = new Date(this.value);
    if (this.dateOnly) {
      this.date.setUTCHours(0);
      this.date.setUTCMinutes(0, 0, 0);
    }
  }
  renderPart(part, range) {
    if (part !== "Time zone") {
      let def;
      let val;
      if (part === "Hour") {
        def = val = this.date.getUTCHours();
      }
      else if (part === "Minute") {
        def = val = this.date.getUTCMinutes();
      }
      else if (part === "Year") {
        def = val = this.date.getUTCFullYear(), length = 4;
      }
      else if (part === "Month") {
        def = val = this.date.getUTCMonth() + 1;
      }
      else if (part === "Day") {
        def = val = this.date.getUTCDate();
      }
      if (part in this.values && this.values[part] === "") {
        val = "";
      }
      return h("ion-item", null, h("ion-label", null, intl.message(`ionx/DateTime#${part}`)), h("ion-input", { type: "number", name: part, placeholder: `${def}`, value: val, min: `${range[0]}`, max: `${range[1]}` }));
    }
    else {
      return h("ion-item", null, h("ion-label", { position: "stacked" }, intl.message(`ionx/DateTime#${part}`)), h("ionx-select", { options: [{ value: "", label: intl.message `No time zone` }], value: "" }));
    }
  }
  render() {
    const ranges = this.ranges();
    return h(Host, null, h("div", null, this.renderPart("Year", ranges["Year"]), this.renderPart("Month", ranges["Month"]), this.renderPart("Day", ranges["Day"]), !this.dateOnly && this.renderPart("Hour", ranges["Hour"]), !this.dateOnly && this.renderPart("Minute", ranges["Minute"])), h("ion-footer", null, h("ion-toolbar", null, h("div", null, h("ion-button", { fill: "clear", onClick: () => this.cancel() }, intl.message `@co.mmons/js-intl#Cancel`), h("ion-button", { fill: "clear", onClick: () => this.ok() }, intl.message `@co.mmons/js-intl#Ok`)))));
  }
  get element() { return this; }
  static get style() { return dateTimeOverlayCss; }
};

const IonxDateTime = /*@__PURE__*/proxyCustomElement(DateTimeInput, [2,"ionx-date-time",{"placeholder":[1],"dateOnly":[4,"date-only"],"timeZoneDisabled":[4,"time-zone-disabled"],"defaultTimeZone":[1,"default-time-zone"],"clearButtonVisible":[4,"clear-button-visible"],"clearButtonIcon":[1,"clear-button-icon"],"clearButtonText":[1,"clear-button-text"],"readonly":[4],"disabled":[4],"formatOptions":[16],"value":[1040],"formattedValue":[32]},[[0,"keydown","onKeyDown"],[0,"focus","onFocus"],[0,"blur","onBlur"],[0,"click","onClick"]]]);
const IonxDateTimeOverlay = /*@__PURE__*/proxyCustomElement(DateTimeOverlay, [1,"ionx-date-time-overlay",{"dateOnly":[4,"date-only"],"timeZoneDisabled":[4,"time-zone-disabled"],"value":[16],"date":[32]},[[0,"keydown","onKeyDown"],[0,"ionChange","onChange"]]]);
const defineIonxDateTime = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      IonxDateTime,
  IonxDateTimeOverlay
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};

export { IonxDateTime, IonxDateTimeOverlay, defineIonxDateTime };
