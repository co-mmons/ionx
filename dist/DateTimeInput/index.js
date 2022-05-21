import { HTMLElement, createEvent, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { intl, setGlobalValues, MessageRef } from '@co.mmons/js-intl';
import { TimeZoneDate, NoTimeDate, LocalDate, timeZoneOffset, sleep, toInteger } from '@co.mmons/js-utils/core';
import { popoverController, isPlatform } from '@ionic/core';
import { addEventListener } from 'ionx/utils';
import { Select } from 'ionx/Select';

const DateTimeInput = "ionx-date-time-input";

function currentTimeZone() {
  return new Intl.DateTimeFormat().resolvedOptions().timeZone;
}

const defaultDateTimeFormat = {
  year: "numeric", month: "numeric", day: "numeric",
  hour: "2-digit", minute: "2-digit", second: undefined
};
const onlyDateDefaultFormat = {
  year: "numeric", month: "numeric", day: "numeric"
};
const onlyDateForceFormat = {
  timeZone: "UTC",
  timeZoneName: undefined
};

const DateTimeInputTypeDate = "date";
const DateTimeInputTypeDateTime = "date-time";
const DateTimeInputTypeLocalDateTime = "local-date-time";

function isDateOnlyType(type) {
  return (typeof type === "string" ? type : type[0]) === DateTimeInputTypeDate;
}

function isDateTimeType(type) {
  return (typeof type === "string" && type === DateTimeInputTypeDateTime) || (Array.isArray(type) && type.includes(DateTimeInputTypeDateTime));
}

function isLocalDateTimeType(type) {
  return (typeof type === "string" && type === DateTimeInputTypeLocalDateTime) || (Array.isArray(type) && type.includes(DateTimeInputTypeLocalDateTime));
}

const inputCss = ".sc-ionx-date-time-input-h{position:relative;display:inline-flex;max-width:100%;user-select:none;min-height:38px;align-items:center;outline:none;cursor:pointer}.sc-ionx-date-time-input-h::-moz-focus-inner{border:0}.sc-ionx-date-time-input-h .ionx--text.sc-ionx-date-time-input{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.sc-ionx-date-time-input-h .ionx--text.ionx--placeholder-visible.sc-ionx-date-time-input{opacity:var(--date-time-placeholder-opacity, 0.5)}.sc-ionx-date-time-input-h .ionx--icon.sc-ionx-date-time-input{position:relative;width:16px;height:20px}.sc-ionx-date-time-input-h .ionx--icon.sc-ionx-date-time-input .ionx--icon-inner.sc-ionx-date-time-input{top:50%;right:0;margin-top:-3px;position:absolute;width:0;height:0;border-top:5px solid;border-right:5px solid transparent;border-left:5px solid transparent;color:currentColor;opacity:var(--date-time-dropdown-icon-opacity, 0.5);pointer-events:none}[disabled].sc-ionx-date-time-input-h{opacity:var(--date-time-disabled-opacity, 0.5);pointer-events:none;cursor:default}[readonly].sc-ionx-date-time-input-h{opacity:1;pointer-events:none;cursor:default}.sc-ionx-date-time-input-h ion-button.sc-ionx-date-time-input{--padding-start:4px;--padding-end:4px;margin:0 0 0 4px;height:auto}ionx-form-field [slot-container=default]>.sc-ionx-date-time-input-h,.item-label-stacked.sc-ionx-date-time-input-h,.item-label-stacked .sc-ionx-date-time-input-h{align-self:flex-start;width:calc(100% - 32px);margin-left:16px;margin-right:16px;min-height:38px}ionx-form-field [slot-container=default]>.sc-ionx-date-time-input-h .ionx--text.sc-ionx-date-time-input,.item-label-stacked.sc-ionx-date-time-input-h .ionx--text.sc-ionx-date-time-input,.item-label-stacked .sc-ionx-date-time-input-h .ionx--text.sc-ionx-date-time-input{max-width:calc(100% - 16px);flex:initial}";

let Input = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.ionChange = createEvent(this, "ionChange", 7);
    this.ionFocus = createEvent(this, "ionFocus", 7);
    this.ionStyle = createEvent(this, "ionStyle", 7);
    /**
     * @inheritDoc
     */
    this.placeholder = intl.message `@co.mmons/js-intl#Choose...`;
    /**
     * @inheritDoc
     */
    this.timeZoneDisabled = false;
    /**
     * @inheritDoc
     */
    this.timeZoneRequired = true;
    /**
     * @inheritDoc
     */
    this.clearButtonVisible = true;
  }
  readonlyChanged() {
    this.emitStyle();
  }
  disabledChanged() {
    this.emitStyle();
  }
  valueChanged(value, old) {
    if (this.valueChanging && (!!value !== !!old || JSON.stringify(value.toJSON()) !== JSON.stringify(old.toJSON()))) {
      this.ionChange.emit({ value });
    }
    this.emitStyle();
    this.valueChanging = false;
  }
  get isDateOnly() {
    return isDateOnlyType(this.type);
  }
  get isDateTime() {
    return isDateTimeType(this.type);
  }
  get isLocalDateTime() {
    return isLocalDateTimeType(this.type);
  }
  formatValue() {
    if (this.value) {
      const { isDateOnly } = this;
      let value = this.value;
      const options = Object.assign({}, (isDateOnly ? onlyDateDefaultFormat : defaultDateTimeFormat), this.formatOptions, (isDateOnly ? onlyDateForceFormat : {}));
      if (isDateOnly) {
        return intl.dateFormat(value.getTime(), options);
      }
      else {
        if (value instanceof TimeZoneDate) {
          options.timeZone = value.timeZone ?? this.defaultTimeZone;
          if (!("timeZoneName" in options)) {
            options.timeZoneName = "short";
          }
        }
        else {
          options.timeZone = "UTC";
          options.timeZoneName = undefined;
        }
        return intl.dateTimeFormat(value.getTime(), options);
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
      this.open();
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
      this.open();
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
  async clearValue() {
    this.value = undefined;
  }
  async open() {
    const { isLocalDateTime, isDateTime, isDateOnly, timeZoneDisabled } = this;
    const timeZoneRequired = this.timeZoneRequired && this.isDateTime && !this.isLocalDateTime;
    if (this.nativePicker) {
      this.nativePicker = document.createElement("input");
      this.nativePicker.type = "date";
      document.body.appendChild(this.nativePicker);
      this.nativePicker.click();
    }
    else if (!this.nativePicker) {
      let value = this.value || this.initialValue;
      if (isDateOnly) {
        value = new NoTimeDate(value ?? new Date());
      }
      else if (isLocalDateTime && !isDateTime) {
        if (value instanceof TimeZoneDate) {
          value = new LocalDate(value.getFullYear(), value.getMonth(), value.getDate(), value.getHours(), value.getMinutes(), value.getSeconds(), value.getMilliseconds());
        }
        else if (!value) {
          const now = new Date();
          value = new LocalDate(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
        }
      }
      else {
        let defaultTimeZone = timeZoneDisabled ? undefined : this.defaultTimeZone;
        // musimy pobrać identyfikator aktualnej strefy czasowej
        if (!defaultTimeZone && !timeZoneDisabled && isDateTime && !isLocalDateTime && (!value || !(value instanceof TimeZoneDate) || !value.timeZone)) {
          defaultTimeZone = currentTimeZone();
        }
        if (value instanceof LocalDate) {
          if (!this.isLocalDateTime) {
            value = new TimeZoneDate(value, timeZoneRequired ? defaultTimeZone : undefined);
          }
        }
        else if (!value) {
          if (this.isLocalDateTime && !this.isDateTime) {
            value = new LocalDate();
          }
          else {
            const now = new Date();
            value = new TimeZoneDate(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0, 0), timeZoneRequired ? defaultTimeZone : undefined);
          }
        }
        else if (timeZoneRequired && (!(value instanceof TimeZoneDate) || !value.timeZone)) {
          value = new TimeZoneDate(value ?? new Date(), defaultTimeZone);
        }
        if (value instanceof TimeZoneDate) {
          if (value.timeZone === "UTC") {
            value = new TimeZoneDate(Date.UTC(value.getUTCFullYear(), value.getUTCMonth(), value.getUTCDate(), value.getUTCHours(), value.getUTCMinutes(), 0, 0), value.timeZone);
          }
          else {
            value = new TimeZoneDate(value.getTime() + (timeZoneOffset(value.timeZone ?? defaultTimeZone, value) * -1), value.timeZone);
          }
        }
      }
      value.setUTCSeconds(0, 0);
      const overlayProps = {
        value,
        type: this.type,
        timeZoneDisabled: isDateOnly || (isLocalDateTime && !isDateTime) || !!this.timeZoneDisabled,
        timeZoneRequired: !isDateOnly && !!this.timeZoneRequired
      };
      const popover = await popoverController.create({
        component: "ionx-date-time-input-overlay",
        componentProps: overlayProps,
        event: { target: this.element },
        showBackdrop: true
      });
      popover.style.setProperty("--width", "250px");
      popover.present();
      this.overlayVisible = true;
      const result = await popover.onWillDismiss();
      if (result.role === "ok") {
        this.valueChanging = true;
        this.value = result.data;
      }
      this.overlayVisible = false;
      this.setFocus({ preventScroll: true });
    }
  }
  connectedCallback() {
    this.valueChanged(this.value, undefined);
    if (!this.element.hasAttribute("tabIndex")) {
      this.element.setAttribute("tabIndex", "0");
    }
    this.initItemListener();
  }
  disconnectedCallback() {
    this.itemClickUnlisten?.();
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
      this.itemClickUnlisten = addEventListener(item, "click", ev => this.focused && ev.target === item && (this.open() || true));
    }
  }
  render() {
    const { value, placeholder, readonly, disabled, clearButtonVisible } = this;
    return h(Host, null, h("div", { class: {
        "ionx--text": true,
        "ionx--placeholder-visible": !value && !!placeholder
      } }, value ? this.formatValue() : placeholder), !readonly && !disabled && h("div", { class: "ionx--icon", role: "presentation" }, h("div", { class: "ionx--icon-inner" })), clearButtonVisible && !readonly && !disabled && value && h("ion-button", { fill: "clear", size: "small", tabIndex: -1, onClick: ev => this.clearButtonClicked(ev) }, h("ion-icon", { name: "backspace", slot: "icon-only" })));
  }
  get element() { return this; }
  static get watchers() { return {
    "readonly": ["readonlyChanged"],
    "disabled": ["disabledChanged"],
    "value": ["valueChanged"]
  }; }
  static get style() { return inputCss; }
};

let loaded = [];
async function importJson() {
  const locale = intl.locale;
  switch (locale) {case "cs": return (await import('./cs.js')).default;
case "da": return (await import('./da.js')).default;
case "de": return (await import('./de.js')).default;
case "fr": return (await import('./fr.js')).default;
case "hu": return (await import('./hu.js')).default;
case "nl": return (await import('./nl.js')).default;
case "pl": return (await import('./pl.js')).default;
case "ru": return (await import('./ru.js')).default;

  }
  return Promise.resolve({});
}
async function loadIntlMessages() {
  if (loaded.includes(intl.locale)) {
    return;
  }
  setGlobalValues("ionx/DateTimeInput", intl.locale, await importJson());
  loaded.push(intl.locale);
}

const localTimeZoneSelectValue = {
  value: "local",
  label: new MessageRef("ionx/DateTimeInput", "Local time")
};

let currentLocale;
var TimeZone;
(function (TimeZone) {
  function get(tz, date) {
    if (!date) {
      date = new Date();
    }
    const fullFormat = {
      hour12: false, year: "numeric",
      month: "numeric", day: "numeric",
      hour: "numeric", minute: "numeric",
      timeZone: tz
    };
    const shortFormat = {
      hour12: false, year: "numeric",
      month: "numeric", day: "numeric",
      hour: "numeric", minute: "numeric",
      timeZoneName: "short", timeZone: tz
    };
    if (!currentLocale) {
      currentLocale = new Intl.DateTimeFormat().resolvedOptions().locale;
    }
    try {
      const full = new Intl.DateTimeFormat(currentLocale, fullFormat).format(date);
      const short = new Intl.DateTimeFormat(currentLocale, shortFormat).format(date).replace(full, "").trim();
      return { id: tz, label: tz.replace("_", " ") + " (" + short + ")", date: full };
    }
    catch (error) {
      throw new Error("Invalid time zone. " + error);
      // console.log(error);
    }
  }
  TimeZone.get = get;
})(TimeZone || (TimeZone = {}));

const unspecifiedTimeZoneSelectValue = {
  value: undefined,
  label: new MessageRef("ionx/DateTimeInput", "Unspecified|time zone")
};

function timeZoneSelectItemsLoader(required, localAllowed, date) {
  return async (values) => {
    if (!date) {
      date = new Date();
    }
    if (values) {
      return values.map(timeZone => timeZone === "local" ? localTimeZoneSelectValue : (timeZone && { value: timeZone, label: TimeZone.get(timeZone)?.label }));
    }
    const { timeZones } = await import('./timeZones.js');
    const unsorted = [];
    for (const tz of timeZones) {
      try {
        unsorted.push(TimeZone.get(tz, date));
      }
      catch (error) {
        // console.warn(error);
      }
    }
    const items = [];
    if (!required) {
      items.push(unspecifiedTimeZoneSelectValue);
    }
    if (localAllowed) {
      items.push(localTimeZoneSelectValue);
    }
    return items.concat(unsorted.sort((a, b) => a.date.localeCompare(b.date)).map(t => ({ value: t.id, label: t.label })));
  };
}

const overlayCss = ":host{display:block}:host ion-input{flex:1;text-align:right;--padding-end:0px;font-weight:600}:host ion-input input::-webkit-outer-spin-button,:host ion-input input::-webkit-inner-spin-button{-webkit-appearance:none;margin:0}:host ion-input input[type=number]{-moz-appearance:textfield}:host ion-item{--inner-padding-start:16px;--inner-padding-end:16px;--padding-start:0px;--padding-end:0px}:host ion-item ion-button[slot=end]{margin:0}:host .numeric-label{white-space:normal}:host .numeric-label small{opacity:0.5}:host .numeric-buttons{text-align:center;margin-left:16px;margin-right:0}:host .numeric-buttons ion-button{margin:0;--padding-start:2px;--padding-end:2px}:host ion-footer{--border-width:0px}:host ion-footer::before{display:none}:host ion-footer ion-toolbar{--border-width:0px !important;--padding-start:0px;--padding-end:0px;--padding-top:0px;--padding-bottom:0px;--min-height:none;--ion-safe-area-bottom:0px;--ion-safe-area-top:0px;--ion-safe-area-start:0px;--ion-safe-area-end:0px}:host ion-footer div{flex:1;display:flex}:host ion-footer ion-button{min-height:44px;margin:0px}:host ion-footer ion-button:not(:last-child){font-weight:400}:host ion-footer ion-button:last-child{font-weight:500}:host ion-footer.md div{justify-content:flex-end}:host ion-footer.md ion-button{flex:none !important}:host ion-footer.ios ion-button{width:50%}";

let Overlay = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    this.numericValues = {};
  }
  get isDateOnly() {
    return isDateOnlyType(this.type);
  }
  get isDateTime() {
    return isDateTimeType(this.type);
  }
  get isLocalDateTime() {
    return isLocalDateTimeType(this.type);
  }
  ranges() {
    const ranges = {
      "Year": [1900, new Date().getUTCFullYear() + 50],
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
  move(part, step) {
    const date = new Date(this.date);
    if (part === "Year") {
      date.setUTCFullYear(date.getUTCFullYear() + step);
    }
    else if (part === "Month") {
      date.setUTCMonth(date.getUTCMonth() + step);
    }
    else if (part === "Day") {
      date.setUTCDate(date.getUTCDate() + step);
    }
    else if (part === "Hour") {
      date.setUTCHours(date.getUTCHours() + step);
    }
    else if (part === "Minute") {
      date.setUTCMinutes(date.getUTCMinutes() + step);
    }
    this.date = date;
  }
  now() {
    const now = new Date();
    this.date = new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate(), now.getHours(), now.getMinutes(), 0, 0));
  }
  ok() {
    let value;
    if (this.isDateOnly) {
      value = new NoTimeDate(this.date);
    }
    else if (this.timeZoneValue === "local" || (this.isLocalDateTime && !this.isDateTime)) {
      value = new LocalDate(this.date);
    }
    else {
      value = new TimeZoneDate(this.date, this.timeZoneValue);
      if ((this.timeZoneValue && this.timeZoneValue !== "UTC") || (!this.timeZoneDisabled && !this.timeZoneValue)) {
        value = new TimeZoneDate(value.getTime() - (timeZoneOffset(this.timeZoneValue ?? currentTimeZone(), this.value) * -1), this.timeZoneValue);
      }
    }
    const popover = this.element.closest("ion-popover");
    popover.dismiss(value, "ok");
  }
  cancel() {
    const popover = this.element.closest("ion-popover");
    popover.dismiss(undefined, "cancel");
  }
  async onFocus(event) {
    const input = event.composedPath().find(t => t.tagName === "ION-INPUT");
    if (input) {
      (await input.getInputElement()).select();
    }
  }
  async onKeyDown(event) {
    const input = event.composedPath().find(t => t.tagName === "ION-INPUT");
    if (input && (event.key === "e" || event.key === "E" || event.key === "-" || event.key === "." || event.key === ",")) {
      event.preventDefault();
    }
    else if (input && event.key === "Enter") {
      const next = input.closest("ion-item").nextElementSibling?.querySelector("ion-input");
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
      if (stringed.length < (typeof input.min === "number" ? input.min : input.min.length)) {
        return;
      }
      if (stringed.length > (typeof input.max === "number" ? input.max : input.max.length) || input.value > toInteger(input.max)) {
        input.value = this.numericValues[input.name];
        return;
      }
      this.numericValues[input.name] = input.value;
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
    else {
      this.timeZoneValue = event.detail.value;
    }
  }
  async didEnter() {
    if (isPlatform("desktop")) {
      let input;
      while (!input) {
        input = this.element.shadowRoot.querySelector("ion-input");
      }
      input.setFocus();
    }
  }
  async componentWillLoad() {
    await loadIntlMessages();
  }
  connectedCallback() {
    if (this.value instanceof LocalDate) {
      this.date = new Date(this.value.getTime());
      this.timeZoneValue = "local";
    }
    else if (this.value instanceof TimeZoneDate) {
      this.date = new Date(this.value);
      this.timeZoneValue = this.value.timeZone === "current" ? undefined : this.value.timeZone;
    }
    else if (this.value instanceof NoTimeDate) {
      this.date = new Date(this.value.getTime());
    }
    else if (this.value) {
      this.date = new Date(this.value);
    }
    if (this.isDateOnly) {
      this.date.setUTCHours(0, 0, 0, 0);
    }
    else {
      this.date.setUTCSeconds(0, 0);
    }
    this.monthFormatter = new Intl.DateTimeFormat(undefined, { month: "long" });
    this.dayOfWeekFormatter = new Intl.DateTimeFormat(undefined, { weekday: "long" });
  }
  renderPart(part, range) {
    if (part !== "Time zone") {
      let def;
      let val;
      let label;
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
        label = this.monthFormatter.format(this.date);
      }
      else if (part === "Day") {
        def = val = this.date.getUTCDate();
        label = this.dayOfWeekFormatter.format(this.date);
      }
      if (part in this.numericValues && typeof this.numericValues[part] !== "number") {
        val = undefined;
      }
      return h("ion-item", null, h("ion-label", { class: "numeric-label" }, h("div", null, intl.message(`ionx/DateTimeInput#${part}`)), label && h("small", null, label)), h("div", { class: "numeric-buttons", slot: "end" }, h("ion-button", { fill: "clear", size: "small", tabindex: -1, onClick: () => this.move(part, -1) }, h("ion-icon", { slot: "icon-only", name: "remove-circle-outline" })), h("ion-button", { fill: "clear", size: "small", tabindex: -1, onClick: () => this.move(part, 1) }, h("ion-icon", { slot: "icon-only", name: "add-circle" }))), h("ion-input", { type: "number", name: part, placeholder: `${def}`, value: val, min: `${range[0]}`, max: `${range[1]}` }));
    }
    else {
      return h("ion-item", null, h("ion-label", { position: "stacked" }, intl.message(`ionx/DateTimeInput#${part}`)), h(Select, { overlay: "modal", placeholder: this.timeZoneRequired ? "Choose..." : intl.message(unspecifiedTimeZoneSelectValue.label), value: this.timeZoneValue, lazyItems: timeZoneSelectItemsLoader(this.timeZoneRequired, this.isLocalDateTime, this.date) }));
    }
  }
  render() {
    const { isDateOnly } = this;
    const ranges = this.ranges();
    return h(Host, null, h("div", null, this.renderPart("Year", ranges["Year"]), this.renderPart("Month", ranges["Month"]), this.renderPart("Day", ranges["Day"]), !isDateOnly && this.renderPart("Hour", ranges["Hour"]), !isDateOnly && this.renderPart("Minute", ranges["Minute"]), h("ion-item", null, h("ion-button", { size: "small", slot: "end", onClick: () => this.now() }, isDateOnly ? intl.message `ionx/DateTimeInput#Today` : intl.message `ionx/DateTimeInput#Now`)), !this.timeZoneDisabled && this.renderPart("Time zone")), h("ion-footer", null, h("ion-toolbar", null, h("div", null, h("ion-button", { fill: "clear", onClick: () => this.cancel() }, intl.message `@co.mmons/js-intl#Cancel`), h("ion-button", { fill: "clear", onClick: () => this.ok() }, intl.message `@co.mmons/js-intl#Ok`)))));
  }
  get element() { return this; }
  static get style() { return overlayCss; }
};

const IonxDateTimeInput = /*@__PURE__*/proxyCustomElement(Input, [2,"ionx-date-time-input",{"type":[1],"placeholder":[1],"readonly":[516],"disabled":[516],"value":[1040],"initialValue":[16],"timeZoneDisabled":[4,"time-zone-disabled"],"timeZoneRequired":[4,"time-zone-required"],"defaultTimeZone":[1,"default-time-zone"],"clearButtonVisible":[4,"clear-button-visible"],"clearButtonIcon":[1,"clear-button-icon"],"formatOptions":[16]},[[0,"keydown","onKeyDown"],[0,"focus","onFocus"],[0,"blur","onBlur"],[0,"click","onClick"]]]);
const IonxDateTimeInputOverlay = /*@__PURE__*/proxyCustomElement(Overlay, [1,"ionx-date-time-input-overlay",{"type":[1],"timeZoneDisabled":[4,"time-zone-disabled"],"timeZoneRequired":[4,"time-zone-required"],"value":[16],"date":[32]},[[0,"ionFocus","onFocus"],[0,"keydown","onKeyDown"],[0,"ionChange","onChange"],[0,"ionViewDidEnter","didEnter"]]]);
const defineIonxDateTimeInput = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      IonxDateTimeInput,
  IonxDateTimeInputOverlay
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};
defineIonxDateTimeInput();

export { DateTimeInput, IonxDateTimeInput, IonxDateTimeInputOverlay, defineIonxDateTimeInput };
