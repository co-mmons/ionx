import {Schema} from "prosemirror-model";
import {EditorView} from "prosemirror-view";
import {InsertMenuItem} from "./InsertMenuItem";

export type InsertMenuItemFactory = (view: EditorView<Schema>) => InsertMenuItem | InsertMenuItem[] | undefined;
