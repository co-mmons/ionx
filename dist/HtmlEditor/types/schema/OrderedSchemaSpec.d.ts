import OrderedMap from "orderedmap";
import { SchemaSpec } from "prosemirror-model";
import { MarkSpecExtended } from "./MarkSpecExtended";
import { NodeSpecExtended } from "./NodeSpecExtended";
export interface OrderedSchemaSpec<N extends string = any, M extends string = any> extends SchemaSpec<N, M> {
  nodes: OrderedMap<NodeSpecExtended>;
  marks?: OrderedMap<MarkSpecExtended>;
}
