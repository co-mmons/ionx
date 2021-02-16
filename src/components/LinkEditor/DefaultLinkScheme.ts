import {MessageRef} from "@co.mmons/js-intl";
import {Enum, EnumFromJSONValue, EnumValueName, EnumValueOfValue} from "@co.mmons/js-utils/core";
import {FormValidator} from "../forms";
import {validEmail} from "../forms/validators";
import {DefaultLinkTarget} from "./DefaultLinkTarget";
import {LinkScheme} from "./LinkScheme";
import {LinkTarget} from "./LinkTarget";
import {urlValidator} from "./urlValidator";

export class DefaultLinkScheme extends Enum implements LinkScheme {

    static readonly www = new DefaultLinkScheme("www");
    static readonly email = new DefaultLinkScheme("email");
    static readonly tel = new DefaultLinkScheme("tel");
    static readonly sms = new DefaultLinkScheme("sms");

    static values() {
        return super.values() as DefaultLinkScheme[];
    }

    static valueOf(value: EnumValueOfValue) {
        return super.valueOf(value) as DefaultLinkScheme;
    }

    static fromJSON(value: EnumFromJSONValue) {
        return super.fromJSON(value) as DefaultLinkScheme;
    }

    constructor(public readonly name: EnumValueName<typeof DefaultLinkScheme>) {
        super(name);

        this.label = new MessageRef("ionx/LinkEditor", `${name}SchemeLabel`);
        this.valueComponent = "ion-input";

        if (name === "www") {
            this.valueComponentProps = {type: "url"};
        } else if (name === "sms") {
            this.valueComponentProps = {type: "tel"};
        } else {
            this.valueComponentProps = {type: name};
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

        if (name === "www") {
            this.targets = DefaultLinkTarget.values();
        }
    }

    readonly label: MessageRef;

    readonly valueComponent: string;

    readonly valueComponentProps: {[key: string]: any};

    readonly valueValidators: FormValidator[];

    readonly valueLabel: MessageRef;

    readonly valueHint: MessageRef;

    readonly targets: LinkTarget[];

    buildHref(value: string) {

        if (this.name === "www") {
            return value;
        } else if (this.name === "tel") {
            return `tel:${value}`;
        } else if (this.name === "sms") {
            return `sms:${value}`;
        } else if (this.name === "email") {
            return `mailto:${value}`;
        }

        return value;
    }

}
