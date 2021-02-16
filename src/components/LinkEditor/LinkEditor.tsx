import {intl} from "@co.mmons/js-intl";
import {Component, h, Method, Prop} from "@stencil/core";
import {FormControl, FormController} from "../forms";
import {required} from "../forms/validators";
import {SelectOption} from "../Select/SelectOption";
import {DefaultLinkScheme} from "./DefaultLinkScheme";
import {Link} from "./Link";
import {LinkEditorProps} from "./LinkEditorProps";
import {LinkNormalizeFn} from "./LinkNormalizeFn";
import {LinkScheme} from "./LinkScheme";
import {LinkTarget} from "./LinkTarget";
import {normalizeLink} from "./normalizeLink";
import {unknownScheme} from "./unknownScheme";

@Component({
    tag: "ionx-link-editor",
    scoped: true,
    styleUrl: "LinkEditor.scss"
})
export class LinkEditor implements LinkEditorProps {

    @Prop()
    link: string | Link;

    @Prop()
    schemes?: SelectOption[];

    @Prop()
    normalizeFn?: LinkNormalizeFn;

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
            return {href: this.data.controls.value.value, target: this.data.controls.target.value?.target};
        }
    }

    connectedCallback() {

        if (this.link) {
            const normalized = this.normalizeFn ? this.normalizeFn(this.link) : normalizeLink(this.link);

            this.data.controls.scheme.setValue(normalized.scheme || unknownScheme);
            this.data.controls.value.setValue(normalized.value);
        }

        this.data.bindRenderer(this);

        this.data.controls.scheme.onStateChange(state => state.current.value !== state.previous?.value && [this.data.controls.value.validate()]);
    }

    disconnectedCallback() {
        this.data.disconnect();
    }

    render() {

        const schemes: SelectOption[] = this.schemes?.slice() ?? DefaultLinkScheme.values().map(type => ({
            value: type,
            label: intl.message(type.label)
        }));

        if (this.data.controls.scheme.value === unknownScheme) {
            this.schemes.push({value: unknownScheme, label: intl.message(unknownScheme.label)});
        }

        const scheme = this.data.controls.scheme.value;
        const ValueComponent: any = this.data.controls.scheme.value?.valueComponent;

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
                label={intl.message(scheme.valueLabel)}>

                <ValueComponent
                    {...scheme.valueComponentProps}
                    ref={this.data.controls.value.attach()}/>

                {scheme.valueHint && <span slot="hint">{intl.message(scheme.valueHint)}</span>}

            </ionx-form-field>}

            {scheme?.targets?.length > 0 && <ionx-form-field label={intl.message`ionx/LinkEditor#Open in|link target`}>
                <ionx-select
                    ref={this.data.controls.target.attach()}
                    empty={false}
                    placeholder={intl.message`ionx/LinkEditor#Choose...`}
                    options={this.data.controls.scheme.value.targets.map(target => ({value: target, label: intl.message(target.label)}))}/>
            </ionx-form-field>}

        </ionx-form-controller>;
    }
}
