import {intl} from "@co.mmons/js-intl";
import {Component, ComponentInterface, h, Method, Prop} from "@stencil/core";
import {defineIonxForms, FormControl, FormController, required} from "ionx/forms";
import {defineIonxFormsTooltipErrorPresenter} from "ionx/forms/TooltipErrorPresenter";
import {defineIonxSelect, SelectOption} from "ionx/Select";
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
export class LinkEditor implements LinkEditorProps, ComponentInterface {

    @Prop()
    link: string | Link;

    @Prop()
    schemes?: SelectOption[] | LinkScheme[];

    @Prop()
    targetVisible: boolean;

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

    @Method()
    async buildLink(): Promise<Link> {
        if (await this.data.validate()) {
            return {
                href: this.data.controls.scheme.value.buildHref(this.data.controls.value.value),
                target: this.data.controls.target.value?.target
            }
        }
    }

    async componentWillLoad() {
        await loadIntlMessages();
    }

    connectedCallback() {

        if (this.link) {
            let link: LinkScheme.ParsedLink;
            for (const item of (this.schemes ?? DefaultLinkScheme.values())) {
                const asOption = (item as SelectOption);
                const scheme = asOption.value as LinkScheme ?? (item as LinkScheme);
                if (scheme.parseLink) {
                    link = scheme.parseLink(this.link);
                    if (link) {
                        break;
                    }
                }
            }

            this.data.controls.scheme.setValue(link?.scheme || unknownScheme);
            this.data.controls.value.setValue(link ? link.value : (typeof this.link === "string" ? this.link : this.link.href));
            this.data.controls.target.setValue(link?.target);
        }

        this.data.bindRenderer(this);

        this.data.controls.scheme.onStateChange(state => {
            if (state.current.value !== state.previous?.value) {
                this.data.controls.value.setValue(undefined);
                this.data.controls.target.setValue(undefined);
            }
        });

        this.data.controls.value.onStateChange(state => {
            if (state.current.value !== state.previous?.value) {
                const targets = this.data.controls.scheme.value.valueTargets(state.current.value);
                if (!targets?.includes(this.data.controls.target.value)) {
                    this.data.controls.target.setValue(undefined);
                }
            }
        });
    }

    render() {

        let schemes: SelectOption[];
        if (this.schemes) {
            schemes = (this.schemes as []).map(scheme => (scheme as SelectOption).value ? scheme as SelectOption : {value: scheme, label: intl.message((scheme as LinkScheme).label)});
        } else {
            schemes = DefaultLinkScheme.values().map(type => ({
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

        return <ionx-form-controller controller={this.data}>

            <ionx-form-tooltip-error-presenter/>

            <ionx-form-field label={intl.message`ionx/LinkEditor#Link type`}>
                <ionx-select
                    ref={this.data.controls.scheme.attach()}
                    empty={false}
                    placeholder={intl.message`ionx/LinkEditor#Choose...`}
                    options={schemes}/>
            </ionx-form-field>

            {ValueComponent && <ionx-form-field
                label={scheme.valueLabel ? intl.message(scheme.valueLabel) : intl.message`ionx/LinkEditor#Link`}>

                <ValueComponent
                    {...scheme.valueComponentProps}
                    ref={this.data.controls.value.attach()}/>

                {scheme.valueHint && <span slot="hint">{intl.message(scheme.valueHint)}</span>}

            </ionx-form-field>}

            {this.targetVisible !== false && targets?.length > 0 && <ionx-form-field
                label={intl.message`ionx/LinkEditor#Open in|link target`}>
                <ionx-select
                    ref={this.data.controls.target.attach()}
                    placeholder={intl.message`ionx/LinkEditor#Choose...`}
                    options={targets.map(target => ({value: target, label: intl.message(target.label)}))}/>
            </ionx-form-field>}

        </ionx-form-controller>;
    }
}
