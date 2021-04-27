import {MessageRef} from "@co.mmons/js-intl";
import {Enum, EnumFromJSONValue, EnumValueName, EnumValueOfValue} from "@co.mmons/js-utils/core";
import {FormValidator, validEmail} from "ionx/forms";
import {DefaultLinkTarget} from "./DefaultLinkTarget";
import {Link} from "./Link";
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

    private constructor(public readonly name: EnumValueName<typeof DefaultLinkScheme>) {
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
    }

    readonly label: MessageRef;

    readonly valueComponent: string;

    readonly valueComponentProps: {[key: string]: any};

    readonly valueValidators: FormValidator[];

    readonly valueLabel: MessageRef;

    readonly valueHint: MessageRef;

    valueTargets() {
        if (this.name === "www") {
            return DefaultLinkTarget.values();
        }
    }

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

    parseLink(link: string | Link): LinkScheme.ParsedLink {

        let scheme: LinkScheme;
        let target: LinkTarget;
        let value: string;

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
        } else {
            target = undefined;
        }

        if (scheme) {
            const l = {scheme, target, value};
            if (!l.target) {
                delete l.target;
            }
            return l;
        }
    }

}
