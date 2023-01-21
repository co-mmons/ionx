import {AssignableType} from "@co.mmons/js-utils/core";
import OrderedMap from "orderedmap";
import {Schema} from "prosemirror-model";
import {DocNode} from "./DocNode";
import {MarkSpecExtended} from "./MarkSpecExtended";
import {NodeSpecExtended} from "./NodeSpecExtended";
import {OrderedSchemaSpec} from "./OrderedSchemaSpec";
import {TextNode} from "./TextNode";

export type MarkSpecOrNodeSpec = NodeSpecExtended | MarkSpecExtended | AssignableType<NodeSpecExtended> | AssignableType<MarkSpecExtended>;

export function buildSchemaWithOptions(options: {topNode?: string}, ...specs: MarkSpecOrNodeSpec[]): Schema {

    let marks: OrderedMap<MarkSpecExtended> = OrderedMap.from({});
    let nodes: OrderedMap<NodeSpecExtended> = OrderedMap.from({});

    for (let spec of specs) {

        if (!spec) {
            continue;
        }

        if (!(spec instanceof NodeSpecExtended || spec instanceof MarkSpecExtended)) {
            spec = new spec();
        }

        if (spec instanceof NodeSpecExtended) {
            nodes = nodes.addToEnd(spec.name, spec);
        } else if (spec instanceof MarkSpecExtended) {
            marks = marks.addToEnd(spec.name, spec);
        }
    }

    if ((!options.topNode || options.topNode === "doc") && !nodes.get("doc")) {
        nodes = nodes.addToStart("doc", new DocNode());
    }

    if (!nodes.get("text")) {
        nodes = nodes.addToStart("text", new TextNode());
    }

    const spec: OrderedSchemaSpec = {marks, nodes, topNode: options.topNode};

    nodes.forEach((_name, node) => {
        node.configure?.(spec);
    })

    marks.forEach((_name, mark) => {
        mark.configure?.(spec);
    });

    return new Schema(spec);
}
