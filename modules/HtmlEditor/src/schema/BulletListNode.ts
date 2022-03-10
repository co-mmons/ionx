import {DOMOutputSpecArray} from "prosemirror-model";
import {NodeSpecExtended} from "./NodeSpecExtended";

const ul = "ul";
const domSpec = [ul, 0] as DOMOutputSpecArray;

export class BulletListNode extends NodeSpecExtended {
    readonly name: string = "ul";

    content = "listItem+";
    group = "block";

    parseDOM = [{tag: ul}];

    toDOM() {
        return domSpec
    }
}
