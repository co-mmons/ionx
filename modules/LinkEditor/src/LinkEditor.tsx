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
import {Select, SelectOption} from "ionx/Select";
import {innerProp} from "ionx/utils";
import {WidthBreakpointsContainer} from "ionx/WidthBreakpoints";
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
        scheme: {value: undefined as LinkScheme, validators: [async (ctrl) => !this.empty && required(ctrl)]},
        value: {value: undefined as any, validators: [required, this.valueValidator.bind(this)]},
        params: {value: undefined},
        target: {value: undefined as LinkTarget}
    });

    /**
     * Builds a link without validation. Returns undefined if invalid link.
     */
    #buildLink = () => {

        const {data} = this;
        const scheme = data.controls.scheme.value;

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
        this.data.controls.params.setValue(link?.scheme);

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
            this.errorPresenter = TooltipErrorPresenter;
        }
    }

    render() {

        let schemes: SelectOption[];
        if (this.schemes) {
            schemes = (this.schemes as []).map(scheme => (scheme as SelectOption).value ? scheme as SelectOption : {
                value: scheme,
                label: ((scheme as LinkScheme).label instanceof MessageRef && translate((scheme as LinkScheme).label)) || (scheme as LinkScheme).label
            });
        } else {
            schemes = (DefaultLinkScheme.values() as LinkScheme[]).concat(unknownScheme).map(type => ({
                value: type,
                label: translate(type.label)
            }));
        }

        const {disabled, readonly} = this;
        const controls = this.data.controls;

        if (controls.scheme.value === unknownScheme) {
            schemes.push({value: unknownScheme, label: translate(unknownScheme.label)});
        }

        const scheme = controls.scheme.value;
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
                        placeholder={translate("ionx/LinkEditor#Choose...")}
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
