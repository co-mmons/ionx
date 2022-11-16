import {Link} from "../Link";
import {LinkScheme} from "../LinkScheme";
import {LinkTarget} from "../LinkTarget";

export class TestScheme implements LinkScheme {
    readonly label = "test";
    readonly valueComponent = undefined;

    buildLink(_value: any, _params?: any, _target?: LinkTarget): Link {
        return {href: "ola:"};
    }

    parseLink(link: string | Link): LinkScheme.ParsedLink {

        const href = typeof link === "string" ? link : link.href;

        if (href.startsWith("ola:")) {
            return {scheme: this, value: "ola:", target: undefined};
        }

        return undefined;
    }

}
