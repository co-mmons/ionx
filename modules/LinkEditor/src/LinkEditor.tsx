import {MessageRef, translate} from "@co.mmons/js-intl";
import {
    Component,
    ComponentInterface,
    Element,
    Event,
    EventEmitter,
    FunctionalComponent,
    h,
    Host,
    Listen,
    Method,
    Prop
} from "@stencil/core";
import {deepEqual} from "fast-equals";
import {
    Form,
    FormControl,
    FormControlElement,
    FormController,
    FormField,
    FormValidationError,
    required
} from "ionx/forms";
import {TooltipErrorPresenter} from "ionx/forms/TooltipErrorPresenter";
import {Select, SelectItem, SelectOption} from "ionx/Select";
import {innerProp} from "ionx/utils";
import {DefaultLinkScheme} from "./DefaultLinkScheme";
import {loadIntlMessages} from "./intl/loadIntlMessages";
import {Link} from "./Link";
import {LinkEditorProps} from "./LinkEditorProps";
import {LinkScheme} from "./LinkScheme";
import {LinkTarget} from "./LinkTarget";
import {unknownScheme} from "./unknownScheme";

@Component({
    tag: "ionx-link-editor",
    scoped: true,
    styleUrl: "LinkEditor.scss"
})
export class LinkEditor implements LinkEditorProps, ComponentInterface, FormControlElement {

    @Element()
    element: HTMLElement;

    @Prop()
    empty: boolean;

    @Prop({mutable: true})
    value: string | Link;

    @Prop()
    schemes?: SelectItem[] | LinkScheme[];

    @Prop()
    targetVisible: boolean;

    @Prop()
    placeholder: string;

    @Prop()
    readonly: boolean;

    @Prop()
    disabled: boolean;

    @Event()
    ionChange: EventEmitter<{value: Link}>;

    errorPresenter: string | FunctionalComponent;

    async formValidate() {

        // we assume, that any inner validation is required, when scheme is chosen
        // if not chosen, than it means undefined is returned by editor
        if (this.data.controls.scheme.value) {
            await this.data.validate({preventFocus: true, preventScroll: true});
            if (this.data.invalid) {
                throw new FormValidationError();
            }
        }

    }

    async setFocus(options?: FocusOptions) {
        if (this.data.invalid) {
            await this.data.validate();
        } else {
            this.element.focus(options);
        }
    }

    async valueValidator(control: FormControl) {
        const {data, empty} = this;
        const {controls} = data;

        if (!controls.scheme.value || !controls.scheme.value.valueComponent) {
            return;
        }

        if (!empty && !control.value) {
            return required(control);
        }

        const validators = controls.scheme.value.valueValidators;
        if (validators) {
            for (const v of validators) {
                await v(control);
            }
        }
    }

    data = new FormController({
        scheme: {value: undefined as LinkScheme, validators: [async (ctrl) => !this.empty && required(ctrl)]},
        value: {value: undefined as any, validators: [this.valueValidator.bind(this)]},
        params: {value: undefined},
        target: {value: undefined as LinkTarget}
    });

    /**
     * Builds a link without validation. Returns undefined if invalid link.
     */
    #buildLink = () => {

        const {data} = this;
        const scheme = data.controls.scheme.value;

        if (!scheme) {
            return;
        }

        if (scheme.buildLink) {
            return scheme.buildLink(data.controls.value.value, data.controls.params.value, data.controls.target.value);
        }

        if (!scheme.buildHref) {
            throw new Error("Link scheme implementation missing buildHref or buildLink");
        }

        const href = scheme.buildHref(data.controls.value.value);

        if (href) {
            return {href, target: data.controls.target.value?.target, params: data.controls.params.value};
        }
    }

    @Method()
    async buildLink(): Promise<Link> {
        if (await this.data.validate()) {
            return this.#buildLink();
        }
    }

    @Listen("ionChange")
    onChanges(ev: CustomEvent) {

        if (ev.target !== this.element) {
            ev.stopPropagation();
            ev.stopImmediatePropagation();
            ev.preventDefault();
        }
    }

    prepare() {

        const {data, value} = this;
        const {controls} = data;

        if (value) {
            for (const item of ((this.schemes ?? DefaultLinkScheme.values()) as Array<LinkScheme | SelectOption>).concat(unknownScheme)) {
                const asOption = (item as SelectOption);
                const scheme = asOption.value as LinkScheme ?? (item as LinkScheme);
                if (scheme.parseLink) {
                    const link = scheme.parseLink(value);
                    if (link) {
                        controls.scheme.setValue(link.scheme);
                        controls.value.setValue(link.value);
                        controls.target.setValue(link.target);
                        controls.params.setValue(undefined);
                        break;
                    }
                }
            }
        }

        data.bindRenderer(this);

        controls.scheme.onStateChange(state => {
            if (!deepEqual(state.current.value, state.previous?.value)) {
                controls.value.setValue(undefined);
                controls.target.setValue(undefined);
            }
        });

        controls.value.onStateChange(state => {
            if (state.current.value !== state.previous?.value) {
                const targets = controls.scheme.value?.valueTargets?.(state.current.value);
                if (!targets?.includes(controls.target.value)) {
                    controls.target.setValue(undefined);
                }
            }
        });

        data.onStateChange(({value}) => {
            if (value) {
                const link = this.#buildLink();
                if (!deepEqual(link, this.value)) {
                    this.value = link;
                    this.ionChange.emit({value: link});
                }
            }
        })
    }

    async componentWillLoad() {
        await loadIntlMessages();
    }

    connectedCallback() {
        this.prepare();

        if (this.element.closest("ionx-link-editor-dialog")) {
            this.errorPresenter = TooltipErrorPresenter;
        }
    }

    render() {

        const {disabled, readonly, data} = this;
        const {controls} = data;
        const scheme = controls.scheme.value;

        let schemes: SelectItem[];
        if (this.schemes) {
            schemes = (this.schemes as []).map(s => (s as SelectItem).value ? s as SelectItem : {
                value: s,
                label: ((s as LinkScheme).label instanceof MessageRef && translate((s as LinkScheme).label)) || (s as LinkScheme).label
            });
        } else {
            schemes = (DefaultLinkScheme.values() as LinkScheme[]).concat(unknownScheme).map(type => ({
                value: type,
                label: translate(type.label)
            }));
        }

        if (scheme === unknownScheme && !schemes.find(o => o.value === unknownScheme)) {
            schemes.push({value: unknownScheme, label: translate(unknownScheme.label)});
        }

        const ValueComponent: any = controls.scheme.value?.valueComponent;
        const targets = scheme?.valueTargets?.(controls.value.value);

        const ErrorPresenter = this.errorPresenter;

        return <Host>

            <Form controller={this.data}>

                {ErrorPresenter && <ErrorPresenter/>}

                <FormField
                    error={!ErrorPresenter && controls.scheme.error}
                    label={translate("ionx/LinkEditor#Link type")}>
                    <Select
                        disabled={disabled}
                        readonly={readonly}
                        ref={controls.scheme.attach()}
                        empty={this.empty}
                        placeholder={this.placeholder ?? translate("ionx/LinkEditor#Choose...")}
                        options={schemes}/>
                </FormField>

                {ValueComponent && <FormField
                    error={!ErrorPresenter && controls.value.error}
                    label={(scheme.valueLabel instanceof MessageRef && translate(scheme.valueLabel)) || (typeof scheme.valueLabel === "string" && scheme.valueLabel) || translate("ionx/LinkEditor#Link")}>

                    <ValueComponent
                        {...scheme.valueComponentProps}
                        disabled={disabled}
                        readonly={readonly}
                        ref={controls.value.attach()}/>

                    {scheme.valueHint && <span slot="hint" {...innerProp((scheme.valueHint instanceof MessageRef && translate(scheme.valueHint)) || scheme.valueHint)}/>}

                </FormField>}

                {this.targetVisible !== false && targets?.length > 0 && (!readonly || controls.target.value) && <FormField
                    error={!ErrorPresenter && controls.target.error}
                    label={translate("ionx/LinkEditor#Open in|link target")}>
                    <Select
                        disabled={disabled}
                        readonly={readonly}
                        ref={controls.target.attach()}
                        placeholder={translate("ionx/LinkEditor#defaultTargetLabel")}
                        options={targets.map(target => ({value: target, label: (target instanceof MessageRef && translate(target.label)) || target.label}))}/>
                </FormField>}

            </Form>
        </Host>;
    }
}
