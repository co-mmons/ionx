import {TextFieldTypes} from "@ionic/core";
import {Component, Host, h, Prop, Element, State, EventEmitter, Event} from "@stencil/core";

@Component({
    tag: "ionx-tags-input",
    styleUrl: "TagsInput.scss",
    scoped: true
})
export class TagsInput {

    @Element()
    element: HTMLElement;

    @Prop({reflect: true})
    readonly: boolean = false;

    @Prop()
    hideRemove: boolean;

    @Prop()
    maxTags: number = -1;

    @Prop()
    placeholder: string = "+Tag";

    @Prop()
    type: TextFieldTypes = "text";

    @Prop()
    separator: string = ",";

    @Prop()
    canEnterAdd: boolean = true;

    @Prop()
    canBackspaceRemove: boolean = false;

    @Prop()
    verifyFn: (tagSrt: string) => boolean;

    @Prop()
    sortFn: (a: string, b: string) => number;

    @Prop()
    sortable: boolean;

    @Prop()
    unique: boolean = true;

    #focused: boolean = false;

    @Prop()
    required?: boolean;

    @Prop()
    value: string[] = [];

    @State()
    currentTag: string = "";

    get input() {
        return this.element.shadowRoot.querySelector("input");
    }

    @Event()
    ionChange: EventEmitter<{value: string[]}>;

    setBlur() {

        if (this.currentTag) {
            this.pushTag(this.currentTag);
        }

        if (this.#focused) {
            this.#focused = false;
            // this.ionBlur.emit(this._tags);
        }

        this.input?.blur();
    }

    setFocus(): any {
        if (!this.#focused) {
            this.#focused = true;

            this.input?.focus();

            // this.ionFocus.emit(this._tags);
        }
    }

    isUnique(tag: string) {

        if (this.value.length === 0) {
            return true;
        }

        return !this.value.includes(tag);
    }

    verifyTag(tagStr: string): boolean {

        if (typeof this.verifyFn === "function") {
            if (!this.verifyFn(tagStr)) {
                this.currentTag = "";
                return false;
            } else {
                return true;
            }
        }

        if (!tagStr.trim()) {
            this.currentTag = "";
            return false;
        } else {
            return true;
        }
    }

    sortTags() {
        if (this.sortable && this.value) {
            if (this.sortFn) {
                this.value.sort((a, b) => this.sortFn(a, b));
            } else {
                this.value.sort((a, b) => a.localeCompare(b));
            }
        }
    }

    pushTag(tagStr: string): any {

        if (!this.value) {
            this.value = [];
        }

        if (this.value.indexOf(tagStr) > -1) {
            return;
        }

        if (this.maxTags !== -1 && this.value.length >= this.maxTags) {
            this.currentTag = "";
            return;
        }


        this.value.push(tagStr.trim());
        this.sortTags();

        this.ionChange.emit({value: this.value.slice()});
        this.currentTag = "";
    }

    onKeyUp(ev: KeyboardEvent) {

        this.currentTag = (ev.target as HTMLInputElement).value;


        if (this.separator && this.currentTag.indexOf(this.separator) > -1) {

            const tags = this.currentTag.split(this.separator);

            for (let i = 0; i < tags.length; i++) {
                const tag = tags[i].trim();

                if (i < tags.length - 1) {
                    if (this.verifyTag(tag) && (!this.unique || this.isUnique(tag))) {
                        this.pushTag(tag);
                    }

                } else {
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

        } else if (ev.key === "Backspace") {

            if (!this.canBackspaceRemove) {
                return;
            }

            if (this.currentTag === "") {
                this.removeTag(-1);
                this.currentTag = "";
            }
        }
    }

    removeTag(index: number): any {

        if (this.value && this.value.length > 0) {
            if (index === -1) {
                this.value = this.value.splice(0, this.value.length - 1);
                this.ionChange.emit({value: this.value.slice()});
            } else if (index > -1) {
                this.value = this.value.slice();
                this.value.splice(index, 1);
                this.ionChange.emit({value: this.value.slice()});
            }
        }
    }

    render() {
        return <Host>

            <div class="ionx-tags-input-wrapper">
                {this.value.map((tag, index) => <ion-chip outline={true} class={{"ion-activatable": false}}>
                    <div>{tag}</div>
                    {!this.hideRemove && !this.readonly && <ion-icon
                        name="close"
                        class={{"ion-activatable": !this.readonly}}
                        onClick={() => this.removeTag(index)}/>}
                </ion-chip>)}
            </div>

            {!this.readonly && <ion-input
                disabled={this.readonly}
                required={this.required}
                class={{"ionx-tags-input-input": true}}
                type={this.type}
                value={this.currentTag}
                placeholder={this.placeholder}
                onKeyUp={ev => this.onKeyUp(ev)}/>}

        </Host>
    }
}
