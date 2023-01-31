import {benc, unbenc} from "@appspltfrm/shared/benc";
import {LinkScheme} from "ionx/LinkEditor";
import {DOMOutputSpecArray} from "prosemirror-model";
import {MarkSpecExtended} from "./MarkSpecExtended";

export class LinkMark extends MarkSpecExtended {

    constructor(options?: {schemes: LinkScheme[]}) {
        super();

        this.schemes = options?.schemes;
    }

    readonly name: string = "link";

    schemes?: LinkScheme[];

    attrs = {
        href: {},
        target: {default: null},
        title: {default: null},
        value: {default: null}
    }

    inclusive = false;

    parseDOM = [
        {
            tag: "a[href]",
            getAttrs(dom: HTMLElement | string) {
                if (dom instanceof HTMLElement) {
                    return {
                        href: dom.getAttribute("href"),
                        target: dom.getAttribute("target"),
                        title: dom.getAttribute("title"),
                        value: unbenc(dom.getAttribute("benc:value"))
                    }
                }
            }
        }
    ]

    toDOM(node): DOMOutputSpecArray {
        const {href, title, target, value} = node.attrs;
        return ["a", {href, title, target, value: value ? `benc:${benc(value)}` : undefined}, 0]
    }
}
