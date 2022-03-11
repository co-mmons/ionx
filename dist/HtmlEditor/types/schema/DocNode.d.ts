import { NodeSpecExtended } from "./NodeSpecExtended";
import { OrderedSchemaSpec } from "./OrderedSchemaSpec";
export declare class DocNode extends NodeSpecExtended {
  readonly name: string;
  content: string;
  setContent(content: string | string[]): this;
  configure(schema: OrderedSchemaSpec): void;
}
