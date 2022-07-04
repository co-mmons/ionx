import {intl} from "@co.mmons/js-intl";
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
import {
    defineIonxForms,
    Form,
    FormControl,
    FormControlElement,
    FormController,
    FormField,
    FormValidationError,
    required
} from "ionx/forms";
import {defineIonxFormsTooltipErrorPresenter} from "ionx/forms/TooltipErrorPresenter";
import {defineIonxSelect, Select, SelectOption} from "ionx/Select";
import {WidthBreakpointsContainer} from "ionx/WidthBreakpoints";
import {DefaultLinkScheme} from "./DefaultLinkScheme";
import {loadIntlMessages} from "./intl/loadIntlMessages";
import {Link} from "./Link";
import {LinkEditorProps} from "./LinkEditorProps";
import {LinkScheme} from "./LinkScheme";
import {LinkTarget} from "./LinkTarget";
import {unknownScheme} from "./unknownScheme";

defineIonxForms();
defineIonxSelect();
defineIonxFormsTooltipErrorPresenter();

@Component({
    tag: "ionx-link-editor",
    scoped: true,
    styleUrl: "LinkEditor.scss"
})
export class LinkEditor implements LinkEditorProps, ComponentInterface, FormControlElement {

    @Element()
    element: HTMLElement;

    @Prop({mutable: true})
    value: string | Link;

    @Prop()
    schemes?: SelectOption[] | LinkScheme[];

    @Prop()
    targetVisible: boolean;

    @Prop()
    readonly: boolean;

    @Prop()
    disabled: boolean;

    @Event()
    ionChange: EventEmitter<{value: Link}>;

    errorPresenter: string | FunctionalComponent;

    breakpoints: WidthBreakpointsContainer;

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

        const validators = this.data.controls.scheme.value.valueValidators;
        if (validators) {
            for (const v of validators) {
                await v(control);
            }
        }
    }

    data = new FormController({
        scheme: {value: null as LinkScheme, validators: [required]},
        value: {value: null as any, validators: [required, this.valueValidator.bind(this)]},
        target: {value: null as LinkTarget}
    });

    /**
     * Builds a link without validation. Returns undefined if invalid link.
     */
    #buildLink = () => {

        const href = this.data.controls.scheme.value?.buildHref(this.data.controls.value.value);
        const target = this.data.controls.target.value?.target;

        if (href) {
            return {href, target};
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

        let link: LinkScheme.ParsedLink;

        if (this.value) {
            for (const item of ((this.schemes ?? DefaultLinkScheme.values()) as Array<LinkScheme | SelectOption>).concat(unknownScheme)) {
                const asOption = (item as SelectOption);
                const scheme = asOption.value as LinkScheme ?? (item as LinkScheme);
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

        this.data.onStateChange(({value}) => {
            if (value) {
                const link = this.#buildLink();
                if (JSON.stringify(this.value || null) !== JSON.stringify(link || null)) {
                    this.value = link;
                    this.ionChange.emit({value: link});
                }
            }
        })
    }

    async componentWillLoad() {
        await loadIntlMessages();
    }

    disconnectedCallback() {
        this.breakpoints.disconnect();
        this.breakpoints = undefined;
    }

    connectedCallback() {

        this.breakpoints = new WidthBreakpointsContainer(this.element);

        this.prepare();

        if (this.element.closest("ionx-link-editor-dialog")) {
            this.errorPresenter = "ionx-form-tooltip-error-presenter";
        }
    }

    render() {

        let schemes: SelectOption[];
        if (this.schemes) {
            schemes = (this.schemes as []).map(scheme => (scheme as SelectOption).value ? scheme as SelectOption : {value: scheme, label: intl.message((scheme as LinkScheme).label)});
        } else {
            schemes = (DefaultLinkScheme.values() as LinkScheme[]).concat(unknownScheme).map(type => ({
                value: type,
                label: intl.message(type.label)
            }));
        }

        if (this.data.controls.scheme.value === unknownScheme) {
            schemes.push({value: unknownScheme, label: intl.message(unknownScheme.label)});
        }

        const scheme = this.data.controls.scheme.value;
        const ValueComponent: any = this.data.controls.scheme.value?.valueComponent;
        const targets = scheme?.valueTargets?.(this.data.controls.value.value);

        const ErrorPresenter = this.errorPresenter;

        return <Host>

            <Form controller={this.data}>

                {ErrorPresenter && <ErrorPresenter/>}

                <FormField
                    error={!this.errorPresenter && this.data.controls.scheme.error}
                    label={intl.message`ionx/LinkEditor#Link type`}>
                    <Select
                        disabled={this.disabled}
                        readonly={this.readonly}
                        ref={this.data.controls.scheme.attach()}
                        empty={false}
                        placeholder={intl.message`ionx/LinkEditor#Choose...`}
                        options={schemes}/>
                </FormField>

                {ValueComponent && <FormField
                    error={!this.errorPresenter && this.data.controls.value.error}
                    label={scheme.valueLabel ? intl.message(scheme.valueLabel) : intl.message`ionx/LinkEditor#Link`}>

                    <ValueComponent
                        {...scheme.valueComponentProps}
                        disabled={this.disabled}
                        readonly={this.readonly}
                        ref={this.data.controls.value.attach()}/>

                    {scheme.valueHint && <span slot="hint">{intl.message(scheme.valueHint)}</span>}

                </FormField>}

                {this.targetVisible !== false && targets?.length > 0 && (!this.readonly || this.data.controls.target.value) && <FormField
                    error={!this.errorPresenter && this.data.controls.target.error}
                    label={intl.message`ionx/LinkEditor#Open in|link target`}>
                    <Select
                        disabled={this.disabled}
                        readonly={this.readonly}
                        ref={this.data.controls.target.attach()}
                        placeholder={intl.message`ionx/LinkEditor#defaultTargetLabel`}
                        options={targets.map(target => ({value: target, label: intl.message(target.label)}))}/>
                </FormField>}

            </Form>
        </Host>;
    }
}
