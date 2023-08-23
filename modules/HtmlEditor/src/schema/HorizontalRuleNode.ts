import {DOMOutputSpec} from "prosemirror-model";
import {NodeSpecExtended} from "./NodeSpecExtended";

const hr = "hr";
const hrDOM: DOMOutputSpec = [hr];

export class HorizontalRuleNode extends NodeSpecExtended {

    readonly name = "horizontalRule";

    group = "block";
    parseDOM = [{tag: hr}];

    toDOM() {
        return hrDOM
    }
}
