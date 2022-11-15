import {Link} from "../Link";
import {LinkScheme} from "../LinkScheme";
import {LinkTarget} from "../LinkTarget";

export class TestScheme implements LinkScheme {
    readonly label = "test";
    readonly valueComponent = "ion-input";

    buildLink(value: any, _params?: any, target?: LinkTarget): Link {
        return {href: "ola:" + value, target: target?.target};
    }

    parseLink(link: string | Link): LinkScheme.ParsedLink {

        const href = typeof link === "string" ? link : link.href;

        if (href.startsWith("ola:")) {
            return {scheme: this, value: href.substring(4), target: undefined};
        }

        return undefined;
    }

}
