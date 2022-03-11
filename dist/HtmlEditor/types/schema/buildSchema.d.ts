/// <reference types="orderedmap" />
import { MarkSpecOrNodeSpec } from "./buildSchemaWithOptions";
export declare function buildSchema(...specs: Array<MarkSpecOrNodeSpec>): import("prosemirror-model").Schema<keyof import("orderedmap")<import("./NodeSpecExtended").NodeSpecExtended>, keyof import("orderedmap")<import("./MarkSpecExtended").MarkSpecExtended>>;
