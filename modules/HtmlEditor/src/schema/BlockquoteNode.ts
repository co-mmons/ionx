import {DOMOutputSpec, ParseRule} from "prosemirror-model";
import {NodeSpecExtended} from "./NodeSpecExtended";

const blockquote = "blockquote";
const blockquoteDOM: DOMOutputSpec = [blockquote, 0];

export class BlockquoteNode extends NodeSpecExtended {
    readonly name: string = blockquote;

    content = "block+";
    group = "block";
    defining = true;

    parseDOM = [{tag: blockquote}] as ParseRule[];

    toDOM() {
        return blockquoteDOM
    }

}
