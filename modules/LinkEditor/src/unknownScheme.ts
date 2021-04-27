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

    parseLink(_link: string | Link): LinkScheme.ParsedLink {
        // unknown cannot be parsed and this is why is unknown :-)
        return undefined;
    }

}
