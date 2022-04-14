import { HTMLElement, createEvent, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import { MessageRef, intl, setGlobalValues } from '@co.mmons/js-intl';
import { Enum } from '@co.mmons/js-utils/core';
import { FormValidationError, validEmail, defineIonxForms, FormController, required } from 'ionx/forms';
import { createAnimation } from '@ionic/core';
import { defineIonxDialog, showDialog } from 'ionx/Dialog';
import { defineIonxFormsTooltipErrorPresenter } from 'ionx/forms/TooltipErrorPresenter';
import { defineIonxSelect } from 'ionx/Select';

class DefaultLinkTarget extends Enum {
  constructor(name) {
    super(name);
    this.name = name;
    this.label = new MessageRef("ionx/LinkEditor", `${name}TargetLabel`);
    this.target = `_${name}`;
  }
  static values() {
    return super.values();
  }
  static valueOf(value) {
    return super.valueOf(value);
  }
  static fromJSON(value) {
    return super.fromJSON(value);
  }
}
DefaultLinkTarget.self = new DefaultLinkTarget("self");
DefaultLinkTarget.blank = new DefaultLinkTarget("blank");

const urlValidatorRegex = /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z0-9\u00a1-\uffff][a-z0-9\u00a1-\uffff_-]{0,62})?[a-z0-9\u00a1-\uffff]\.)+(?:[a-z\u00a1-\uffff]{2,}\.?))(?::\d{2,5})?(?:[/?#]\S*)?$/i;
/**
 * @throws InvalidUrlError
 */
async function urlValidator(control) {
  const value = control.value;
  if (value !== null && value !== undefined) {
    if (typeof value === "string" && (value.length === 0 || urlValidatorRegex.test(value))) {
      return;
    }
    throw new InvalidUrlError();
  }
}
class InvalidUrlError extends FormValidationError {
  constructor() {
    super(intl.message `ionx/LinkEditor#InvalidUrlError|message`);
  }
}

class DefaultLinkScheme extends Enum {
  constructor(name) {
    super(name);
    this.name = name;
    this.label = new MessageRef("ionx/LinkEditor", `${name}SchemeLabel`);
    this.valueComponent = "ion-input";
    if (name === "www") {
      this.valueComponentProps = { type: "url" };
    }
    else if (name === "sms") {
      this.valueComponentProps = { type: "tel" };
    }
    else {
      this.valueComponentProps = { type: name };
    }
    if (name === "www") {
      this.valueValidators = [urlValidator];
      this.valueLabel = new MessageRef("ionx/LinkEditor", "Web page url");
    }
    if (name === "email") {
      this.valueValidators = [validEmail];
      this.valueLabel = new MessageRef("ionx/LinkEditor", "E-mail address");
    }
    if (name === "tel" || name === "sms") {
      this.valueLabel = new MessageRef("ionx/LinkEditor", "Phone number");
      this.valueHint = new MessageRef("ionx/LinkEditor", "phoneNumberHint");
    }
  }
  static values() {
    return super.values();
  }
  static valueOf(value) {
    return super.valueOf(value);
  }
  static fromJSON(value) {
    return super.fromJSON(value);
  }
  valueTargets() {
    if (this.name === "www") {
      return DefaultLinkTarget.values();
    }
  }
  buildHref(value) {
    if (!value) {
      return;
    }
    if (this.name === "www") {
      return value;
    }
    else if (this.name === "tel") {
      return `tel:${value}`;
    }
    else if (this.name === "sms") {
      return `sms:${value}`;
    }
    else if (this.name === "email") {
      return `mailto:${value}`;
    }
    return value;
  }
  parseLink(link) {
    let scheme;
    let target;
    let value;
    const href = typeof link === "string" ? link : link.href;
    const prefixes = {
      "http:": DefaultLinkScheme.www,
      "https:": DefaultLinkScheme.www,
      "tel:": DefaultLinkScheme.tel,
      "sms:": DefaultLinkScheme.sms,
      "mailto:": DefaultLinkScheme.email
    };
    const lowerCasedHref = href.trim().toLowerCase();
    for (const prefix of Object.keys(prefixes)) {
      if (prefixes[prefix] === this && lowerCasedHref.startsWith(prefix)) {
        scheme = prefixes[prefix];
        value = href.trim();
        if (prefixes[prefix] !== DefaultLinkScheme.www) {
          value = value.substring(prefix.length).trim();
        }
      }
    }
    if (typeof link === "object" && link.target && scheme === DefaultLinkScheme.www) {
      if (link.target === "_blank") {
        target = DefaultLinkTarget.blank;
      }
    }
    else {
      target = undefined;
    }
    if (scheme) {
      const l = { scheme, target, value };
      if (!l.target) {
        delete l.target;
      }
      return l;
    }
  }
}
DefaultLinkScheme.www = new DefaultLinkScheme("www");
DefaultLinkScheme.email = new DefaultLinkScheme("email");
DefaultLinkScheme.tel = new DefaultLinkScheme("tel");
DefaultLinkScheme.sms = new DefaultLinkScheme("sms");

let loaded = [];
async function importJson() {
  const locale = intl.locale;
  switch (locale) {case "cs": return (await import('./cs.js')).default;
case "da": return (await import('./da.js')).default;
case "de": return (await import('./de.js')).default;
case "en": return (await import('./en.js')).default;
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
  setGlobalValues("ionx/LinkEditor", intl.locale, await importJson());
  loaded.push(intl.locale);
}

async function showLinkEditor(props, dialogOptions) {
  defineIonxDialog();
  const dialog = await showDialog({
    component: "ionx-link-editor-dialog",
    componentProps: { editorProps: props },
    animated: dialogOptions?.animated !== false,
    leaveAnimation: dialogOptions?.animated === "onlyEnter" ? (_baseEl) => createAnimation() : undefined
  });
  const result = await dialog.onDidDismiss();
  if (result.role === "ok") {
    return result.data;
  }
}

const unknownScheme = new class {
  constructor() {
    this.label = new MessageRef("ionx/LinkEditor", "unknownSchemeLabel");
    this.valueComponent = "ion-input";
    this.valueLabel = new MessageRef("ionx/LinkEditor", "Link");
  }
  buildHref(value) {
    return value;
  }
  parseLink(link) {
    return { scheme: this, value: typeof link === "string" ? link : link.href };
  }
};

const LinkEditor$1 = "ionx-link-editor";

const linkEditorCss = ".sc-ionx-link-editor-h{display:block}.sc-ionx-link-editor-h ionx-form-field.sc-ionx-link-editor:not(:first-child){margin-top:16px}ionx-form-field.sc-ionx-link-editor-h,ionx-form-field .sc-ionx-link-editor-h{margin:16px}";

var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _LinkEditor_buildLink;
defineIonxForms();
defineIonxSelect();
defineIonxFormsTooltipErrorPresenter();
let LinkEditor = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.ionChange = createEvent(this, "ionChange", 7);
    this.data = new FormController({
      scheme: { value: null, validators: [required] },
      value: { value: null, validators: [required, this.valueValidator.bind(this)] },
      target: { value: null }
    });
    /**
     * Builds a link without validation. Returns undefined if invalid link.
     */
    _LinkEditor_buildLink.set(this, () => {
      const href = this.data.controls.scheme.value?.buildHref(this.data.controls.value.value);
      const target = this.data.controls.target.value?.target;
      if (href) {
        return { href, target };
      }
    });
  }
  async formValidate() {
    // we assume, that any inner validation is required, when scheme is chosen
    // if not chosen, than it means undefined is returned by editor
    if (this.data.controls.scheme.value) {
      await this.data.validate({ preventFocus: true, preventScroll: true });
      if (this.data.invalid) {
        throw new FormValidationError();
      }
    }
  }
  async setFocus(options) {
    if (this.data.invalid) {
      await this.data.validate();
    }
    else {
      this.element.focus(options);
    }
  }
  async valueValidator(control) {
    const validators = this.data.controls.scheme.value.valueValidators;
    if (validators) {
      for (const v of validators) {
        await v(control);
      }
    }
  }
  async buildLink() {
    if (await this.data.validate()) {
      return __classPrivateFieldGet(this, _LinkEditor_buildLink, "f").call(this);
    }
  }
  onChanges(ev) {
    if (ev.target !== this.element) {
      ev.stopPropagation();
      ev.stopImmediatePropagation();
      ev.preventDefault();
    }
  }
  prepare() {
    let link;
    if (this.value) {
      for (const item of (this.schemes ?? DefaultLinkScheme.values()).concat(unknownScheme)) {
        const asOption = item;
        const scheme = asOption.value ?? item;
        if (scheme.parseLink) {
          link = scheme.parseLink(this.value);
          if (link) {
            break;
          }
        }
      }
    }
    this.data.controls.scheme.setValue(link?.scheme);
    this.data.controls.value.setValue(link ? link.value : (typeof this.value === "string" ? this.value : this.value?.href));
    this.data.controls.target.setValue(link?.target);
    this.data.bindRenderer(this);
    this.data.controls.scheme.onStateChange(state => {
      if (state.current.value !== state.previous?.value) {
        this.data.controls.value.setValue(undefined);
        this.data.controls.target.setValue(undefined);
      }
    });
    this.data.controls.value.onStateChange(state => {
      if (state.current.value !== state.previous?.value) {
        const targets = this.data.controls.scheme.value?.valueTargets?.(state.current.value);
        if (!targets?.includes(this.data.controls.target.value)) {
          this.data.controls.target.setValue(undefined);
        }
      }
    });
    this.data.onStateChange(({ value }) => {
      if (value) {
        const link = __classPrivateFieldGet(this, _LinkEditor_buildLink, "f").call(this);
        if (JSON.stringify(this.value || null) !== JSON.stringify(link || null)) {
          this.value = link;
          this.ionChange.emit({ value: link });
        }
      }
    });
  }
  async componentWillLoad() {
    await loadIntlMessages();
  }
  connectedCallback() {
    this.prepare();
    if (this.element.closest("ionx-link-editor-dialog")) {
      this.errorPresenter = "ionx-form-tooltip-error-presenter";
    }
  }
  render() {
    let schemes;
    if (this.schemes) {
      schemes = this.schemes.map(scheme => scheme.value ? scheme : { value: scheme, label: intl.message(scheme.label) });
    }
    else {
      schemes = DefaultLinkScheme.values().concat(unknownScheme).map(type => ({
        value: type,
        label: intl.message(type.label)
      }));
    }
    if (this.data.controls.scheme.value === unknownScheme) {
      schemes.push({ value: unknownScheme, label: intl.message(unknownScheme.label) });
    }
    const scheme = this.data.controls.scheme.value;
    const ValueComponent = this.data.controls.scheme.value?.valueComponent;
    const targets = scheme?.valueTargets?.(this.data.controls.value.value);
    const ErrorPresenter = this.errorPresenter;
    return h(Host, null, h("ionx-form", { controller: this.data }, ErrorPresenter && h(ErrorPresenter, null), h("ionx-form-field", { error: !this.errorPresenter && this.data.controls.scheme.error, label: intl.message `ionx/LinkEditor#Link type` }, h("ionx-select", { disabled: this.disabled, readonly: this.readonly, ref: this.data.controls.scheme.attach(), empty: false, placeholder: intl.message `ionx/LinkEditor#Choose...`, options: schemes })), ValueComponent && h("ionx-form-field", { error: !this.errorPresenter && this.data.controls.value.error, label: scheme.valueLabel ? intl.message(scheme.valueLabel) : intl.message `ionx/LinkEditor#Link` }, h(ValueComponent, { ...scheme.valueComponentProps, disabled: this.disabled, readonly: this.readonly, ref: this.data.controls.value.attach() }), scheme.valueHint && h("span", { slot: "hint" }, intl.message(scheme.valueHint))), this.targetVisible !== false && targets?.length > 0 && (!this.readonly || this.data.controls.target.value) && h("ionx-form-field", { error: !this.errorPresenter && this.data.controls.target.error, label: intl.message `ionx/LinkEditor#Open in|link target` }, h("ionx-select", { disabled: this.disabled, readonly: this.readonly, ref: this.data.controls.target.attach(), placeholder: intl.message `ionx/LinkEditor#defaultTargetLabel`, options: targets.map(target => ({ value: target, label: intl.message(target.label) })) }))));
  }
  get element() { return this; }
  static get style() { return linkEditorCss; }
};
_LinkEditor_buildLink = new WeakMap();

let LinkEditorDialog = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
  }
  async ok() {
    const editor = this.element.querySelector("ionx-link-editor");
    const link = await editor.buildLink();
    if (link) {
      return link;
    }
    else {
      throw new Error();
    }
  }
  render() {
    return h("ionx-dialog-content", null, h("ionx-link-editor", { ...this.editorProps, slot: "message" }), h("ionx-dialog-buttons", { slot: "footer", buttons: [
        { label: intl.message `@co.mmons/js-intl#Cancel`, role: "cancel" },
        { label: intl.message `@co.mmons/js-intl#Ok`, role: "ok", valueHandler: this.ok.bind(this) }
      ] }));
  }
  get element() { return this; }
};

const IonxLinkEditor = /*@__PURE__*/proxyCustomElement(LinkEditor, [2,"ionx-link-editor",{"value":[1025],"schemes":[16],"targetVisible":[4,"target-visible"],"readonly":[4],"disabled":[4]},[[0,"ionChange","onChanges"]]]);
const IonxLinkEditorDialog = /*@__PURE__*/proxyCustomElement(LinkEditorDialog, [2,"ionx-link-editor-dialog",{"editorProps":[16]}]);
const defineIonxLinkEditor = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      IonxLinkEditor,
  IonxLinkEditorDialog
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};
defineIonxLinkEditor();

export { DefaultLinkScheme, DefaultLinkTarget, IonxLinkEditor, IonxLinkEditorDialog, LinkEditor$1 as LinkEditor, defineIonxLinkEditor, loadIntlMessages as loadIonxLinkEditorIntl, showLinkEditor, unknownScheme, urlValidator };
