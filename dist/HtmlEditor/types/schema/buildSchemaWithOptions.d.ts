import { AssignableType } from "@co.mmons/js-utils/core";
import OrderedMap from "orderedmap";
import { Schema } from "prosemirror-model";
import { MarkSpecExtended } from "./MarkSpecExtended";
import { NodeSpecExtended } from "./NodeSpecExtended";
export declare type MarkSpecOrNodeSpec = NodeSpecExtended | MarkSpecExtended | AssignableType<NodeSpecExtended> | AssignableType<MarkSpecExtended>;
export declare function buildSchemaWithOptions(options: {
  topNode?: string;
}, ...specs: MarkSpecOrNodeSpec[]): Schema<keyof OrderedMap<NodeSpecExtended>, keyof OrderedMap<MarkSpecExtended>>;
