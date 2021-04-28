import { Command } from "../command";
import { MarkType } from "prosemirror-model";
/**
 * A wrapper over the default toggleMark, except when we have a selection
 * we only toggle marks on text nodes rather than inline nodes.
 */
export declare const toggleMark: (markType: MarkType, attrs?: {
  [key: string]: any;
}) => Command;
