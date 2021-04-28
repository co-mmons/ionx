import { Command } from "../../command";
/**
 * Creates a filter that checks if the node at a given number of parents above the current
 * selection is of the correct node type.
 * @param nodeType The node type to compare the nth parent against
 * @param depthAway How many levels above the current node to check against. 0 refers to
 * the current selection"s parent, which will be the containing node when the selection
 * is usually inside the text content.
 */
export declare function isNthParentOfType(nodeType: string, depthAway: number): Command;
