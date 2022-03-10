import {NodeSpecExtended} from "./NodeSpecExtended";
import {OrderedSchemaSpec} from "./OrderedSchemaSpec";

export class DocNode extends NodeSpecExtended {
    readonly name: string = "doc";
    content = "block+";

    configure(schema: OrderedSchemaSpec) {

        for (const mark of ["alignment"]) {
            if (schema.marks.get(mark)) {
                this.allowMark(mark);
            }
        }

    }
}
