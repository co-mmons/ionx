import { EditorView } from "prosemirror-view";
import { InsertMenuItem } from "./InsertMenuItem";
export declare type InsertMenuItemFactory = (view: EditorView) => InsertMenuItem | InsertMenuItem[] | undefined;
