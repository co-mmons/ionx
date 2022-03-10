import {Schema} from "prosemirror-model";
import {splitListItem} from "prosemirror-schema-list";
import {NodeSpecExtended} from "./NodeSpecExtended";
import {OrderedSchemaSpec} from "./OrderedSchemaSpec";

const liDOM = ["li", 0];

export class ListItemNode extends NodeSpecExtended {

    readonly name = "listItem";
    defining: true

    content = "block*";

    parseDOM = [{tag: "li"}];

    toDOM() {
        return liDOM;
    }

    keymap(schema: Schema) {
        return {"Enter": splitListItem(schema.nodes[this.name])};
    }

    configure(schema: OrderedSchemaSpec) {

        for (const mark of ["alignment"]) {
            if (schema.marks.get(mark)) {
                this.allowMark(mark);
            }
        }

        for (const node of ["paragraph"]) {
            if (schema.nodes[node]) {
                this.allowContent(node);
            }
        }
    }
}
