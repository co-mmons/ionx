import {DOMOutputSpecArray, ParseRule} from "prosemirror-model";
import {NodeSpecExtended} from "./NodeSpecExtended";

export class HeadingNode extends NodeSpecExtended {

    readonly name: string = "heading";

    attrs = {level: {default: 1}};
    content = "inline*";
    group = "block";
    defining = true;

    parseDOM: ParseRule[] = [
        {tag: "h1", attrs: {level: 1}},
        {tag: "h2", attrs: {level: 2}},
        {tag: "h3", attrs: {level: 3}},
        {tag: "h4", attrs: {level: 4}},
        {tag: "h5", attrs: {level: 5}},
        {tag: "h6", attrs: {level: 6}}
    ]

    toDOM(node) {
        return ["h" + node.attrs.level, 0] as DOMOutputSpecArray
    }
}
