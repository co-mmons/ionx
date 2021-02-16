import {MessageRef} from "@co.mmons/js-intl";
import {LinkScheme} from "./LinkScheme";

export const unknownScheme = new class implements LinkScheme {

    readonly label = new MessageRef("ionx/LinkEditor", `unknownSchemeLabel`);
    readonly valueComponent = "ion-input";

    buildHref(value: any): string {
        return value;
    }

}
