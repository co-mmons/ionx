import {DefaultLinkScheme} from "./DefaultLinkScheme";
import {DefaultLinkTarget} from "./DefaultLinkTarget";
import {Link} from "./Link";
import {LinkScheme} from "./LinkScheme";
import {LinkTarget} from "./LinkTarget";

export function normalizeLink(link: string | Link) {

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
        if (lowerCasedHref.startsWith(prefix)) {

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
    }

    if (!scheme) {
        value = href;
    }

    return {scheme, target, value};
}
