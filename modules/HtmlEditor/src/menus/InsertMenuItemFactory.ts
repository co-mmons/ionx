import {EditorView} from "prosemirror-view";
import {InsertMenuItem} from "./InsertMenuItem";

export type InsertMenuItemFactory = (view: EditorView) => InsertMenuItem | InsertMenuItem[] | undefined;
