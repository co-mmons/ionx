import {Node} from "prosemirror-model";
import {NodeSpecExtended} from "../schema";

const tagName = "ionx-html-editor-custom-render";

export class TestCustomRenderNode extends NodeSpecExtended {
    name = tagName;
    inline = true;
    group = "inline";

    attrs = {
        props: {default: ""}
    }

    parseDOM = [
        {
            tag: tagName,
            getAttrs(node: HTMLElement) {
                const props = node.getAttribute("props");
                return {props};
            }
        }
    ]

    toDOM(node: Node) {
        return [tagName, {props: node.attrs.props}];
    }

    render(_node) {

        const span = document.createElement("span");
        span.innerText = _node.attrs.props;
        span.style.border = "1px dotted";

        return {
            dom: span
        }
    }
}
