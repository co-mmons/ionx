import {MessageRef} from "@co.mmons/js-intl";
import {Link} from "./Link";
import {LinkScheme} from "./LinkScheme";

export const unknownScheme = new class implements LinkScheme {

    readonly label = new MessageRef("ionx/LinkEditor", "unknownSchemeLabel");
    readonly valueComponent = "ion-input";
    readonly valueLabel = new MessageRef("ionx/LinkEditor", "Link");

    buildHref(value: any): string {
        return value;
    }

    parseLink(link: string | Link): LinkScheme.ParsedLink {
        return {scheme: this, value: typeof link === "string"  ? link : link.href, params: typeof link === "object" ? link.params : undefined};
    }

}
