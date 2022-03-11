import { joinDown, joinUp, lift, selectAll, selectParentNode } from "prosemirror-commands";
export declare let pcBaseKeymap: {
  Backspace: <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
  "Mod-Backspace": <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
  "Shift-Backspace": <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
  Delete: <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
  "Mod-Delete": <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
  "Mod-a": typeof selectAll;
  "Alt-ArrowUp": typeof joinUp;
  "Alt-ArrowDown": typeof joinDown;
  "Mod-BracketLeft": typeof lift;
  Escape: typeof selectParentNode;
};
export declare let macBaseKeymap: {
  "Ctrl-h": <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
  "Alt-Backspace": <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
  "Ctrl-d": <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
  "Ctrl-Alt-Backspace": <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
  "Alt-Delete": <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
  "Alt-d": <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
};
export declare let baseKeymap: {
  Backspace: <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
  "Mod-Backspace": <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
  "Shift-Backspace": <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
  Delete: <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
  "Mod-Delete": <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
  "Mod-a": typeof selectAll;
  "Alt-ArrowUp": typeof joinUp;
  "Alt-ArrowDown": typeof joinDown;
  "Mod-BracketLeft": typeof lift;
  Escape: typeof selectParentNode;
} | {
  "Ctrl-h": <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
  "Alt-Backspace": <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
  "Ctrl-d": <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
  "Ctrl-Alt-Backspace": <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
  "Alt-Delete": <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
  "Alt-d": <S extends import("prosemirror-model").Schema<any, any> = any>(state: import("prosemirror-state").EditorState<S>, dispatch?: (tr: import("prosemirror-state").Transaction<S>) => void, view?: import("prosemirror-view").EditorView<S>) => boolean;
};
