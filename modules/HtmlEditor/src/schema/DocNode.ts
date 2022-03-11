import {NodeSpecExtended} from "./NodeSpecExtended";
import {OrderedSchemaSpec} from "./OrderedSchemaSpec";

export class DocNode extends NodeSpecExtended {
    readonly name: string = "doc";
    content = "block+";

    setContent(content: string | string[]): this {
        this.content = typeof content === "string" ? content : content.join(" ");
        return this;
    }

    configure(schema: OrderedSchemaSpec) {

        for (const mark of ["alignment"]) {
            if (schema.marks.get(mark)) {
                this.allowMark(mark);
            }
        }

    }
}
