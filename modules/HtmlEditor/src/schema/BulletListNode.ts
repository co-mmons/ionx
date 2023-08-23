import {DOMOutputSpec} from "prosemirror-model";
import {NodeSpecExtended} from "./NodeSpecExtended";

const ul = "ul";
const domSpec = [ul, 0] as DOMOutputSpec;

export class BulletListNode extends NodeSpecExtended {
    readonly name: string = "bulletList";

    content = "listItem+";
    group = "block";

    parseDOM = [{tag: ul}];

    toDOM() {
        return domSpec
    }
}
