import { HTMLElement, createEvent, h, Host, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';

const tagsInputCss = ".sc-ionx-tags-input-h{display:block}.sc-ionx-tags-input-h ion-chip.sc-ionx-tags-input{margin:4px 4px 4px 0;height:30px}.sc-ionx-tags-input-h ion-chip.chip-disabled.sc-ionx-tags-input{opacity:1}.sc-ionx-tags-input-h ion-input.sc-ionx-tags-input{--padding-start:0;--padding-end:0}.item-label-stacked.sc-ionx-tags-input-h,.item-label-stacked .sc-ionx-tags-input-h{width:100%}ionx-form-field [slot-container=default]>.sc-ionx-tags-input-h{margin-left:16px;margin-right:16px;min-height:38px}";

let TagsInput = class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.ionChange = createEvent(this, "ionChange", 7);
    this.readonly = false;
    this.maxTags = -1;
    this.placeholder = "+Tag";
    this.type = "text";
    this.separator = ",";
    this.canEnterAdd = true;
    this.canBackspaceRemove = false;
    this.unique = true;
    this.value = [];
    this.currentTag = "";
  }
  get input() {
    return this.element.querySelector("input");
  }
  setBlur() {
    if (this.currentTag) {
      this.pushTag(this.currentTag);
    }
    this.input?.blur();
  }
  async setFocus() {
    this.input?.focus();
  }
  isUnique(tag) {
    if (!this.value?.length) {
      return true;
    }
    return !this.value.includes(tag);
  }
  verifyTag(tagStr) {
    if (typeof this.verifyFn === "function") {
      if (!this.verifyFn(tagStr)) {
        this.currentTag = "";
        return false;
      }
      else {
        return true;
      }
    }
    if (!tagStr.trim()) {
      this.currentTag = "";
      return false;
    }
    else {
      return true;
    }
  }
  sortTags() {
    if (this.sortable && this.value) {
      if (this.sortFn) {
        this.value.sort((a, b) => this.sortFn(a, b));
      }
      else {
        this.value.sort((a, b) => a.localeCompare(b));
      }
    }
  }
  pushTag(tag) {
    if (tag) {
      tag = tag.trim();
    }
    if (!tag) {
      return;
    }
    if (!this.value) {
      this.value = [];
    }
    if (this.unique && !this.isUnique(tag)) {
      return;
    }
    if (this.maxTags !== -1 && this.value.length >= this.maxTags) {
      this.currentTag = "";
      return;
    }
    const value = this.value.slice();
    value.push(tag);
    this.value = value;
    this.sortTags();
    this.currentTag = "";
    this.ionChange.emit({ value });
  }
  onKeyUp(ev) {
    this.currentTag = ev.target.value;
    if (this.separator && this.currentTag.indexOf(this.separator) > -1) {
      const tags = this.currentTag.split(this.separator);
      for (let i = 0; i < tags.length; i++) {
        const tag = tags[i].trim();
        if (i < tags.length - 1) {
          if (this.verifyTag(tag) && (!this.unique || this.isUnique(tag))) {
            this.pushTag(tag);
          }
        }
        else {
          this.currentTag = tag;
        }
      }
      return;
    }
    if (ev.key === "Enter") {
      const tagStr = this.currentTag.trim();
      if (!this.canEnterAdd) {
        return;
      }
      if (!this.verifyTag(tagStr)) {
        return;
      }
      if (this.unique && !this.isUnique(tagStr)) {
        this.currentTag = "";
        return;
      }
      this.pushTag(tagStr);
    }
    else if (ev.key === "Backspace") {
      if (!this.canBackspaceRemove) {
        return;
      }
      if (this.currentTag === "") {
        this.removeTag(-1);
        this.currentTag = "";
      }
    }
  }
  removeTag(index) {
    if (this.value && this.value.length > 0) {
      if (index === -1) {
        this.value = this.value.splice(0, this.value.length - 1);
        this.ionChange.emit({ value: this.value.slice() });
      }
      else if (index > -1) {
        this.value = this.value.slice();
        this.value.splice(index, 1);
        this.ionChange.emit({ value: this.value.slice() });
      }
    }
  }
  render() {
    return h(Host, null, h("div", { class: "ionx-tags-input-wrapper" }, this.value?.map((tag, index) => h("ion-chip", { outline: true, disabled: this.readonly }, h("div", null, tag), !this.hideRemove && !this.readonly && h("ion-icon", { name: "close", onClick: () => this.removeTag(index) })))), !this.readonly && h("ion-input", { disabled: this.readonly, required: this.required, class: { "ionx-tags-input-input": true }, type: this.type, value: this.currentTag, placeholder: this.placeholder, onIonBlur: () => this.pushTag(this.currentTag?.trim()), onIonChange: ev => [ev.stopPropagation(), ev.stopImmediatePropagation()], onKeyUp: ev => this.onKeyUp(ev) }));
  }
  get element() { return this; }
  static get style() { return tagsInputCss; }
};

const IonxTagsInput = /*@__PURE__*/proxyCustomElement(TagsInput, [2,"ionx-tags-input",{"readonly":[516],"hideRemove":[4,"hide-remove"],"maxTags":[2,"max-tags"],"placeholder":[1],"type":[1],"separator":[1],"canEnterAdd":[4,"can-enter-add"],"canBackspaceRemove":[4,"can-backspace-remove"],"verifyFn":[16],"sortFn":[16],"sortable":[4],"unique":[4],"required":[4],"value":[16],"currentTag":[32]}]);
const defineIonxTagsInput = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      IonxTagsInput
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};

export { IonxTagsInput, defineIonxTagsInput };
