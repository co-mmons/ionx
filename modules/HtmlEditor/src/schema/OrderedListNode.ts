import {NodeSpecExtended} from "./NodeSpecExtended";

const olDOM = ["ol", 0];

export class OrderedListNode extends NodeSpecExtended {
    readonly name: string = "orderedList";

    content = "listItem+";
    group = "block";

    attrs = {order: {default: 1}};

    parseDOM = [
        {
            tag: "ol",
            getAttrs(dom) {
                return {order: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1}
            }
        }
    ]

    toDOM(node) {
        return node.attrs.order == 1 ? olDOM : ["ol", {start: node.attrs.order}, 0]
    }
}
