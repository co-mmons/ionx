import { Node } from "prosemirror-model";
import { EditorView, NodeView } from "prosemirror-view";
export declare function createYoutubeIframe(id: string, start?: string): HTMLIFrameElement;
export declare class YoutubeNodeView implements NodeView {
  protected view: EditorView;
  constructor(node: Node, view: EditorView);
  private deleteUnlisten;
  dom: HTMLElement;
  deleteNode(): void;
  selectNode(): void;
  deselectNode(): void;
  update(_node: Node): boolean;
  destroy(): void;
  stopEvent(_event: Event): boolean;
  ignoreMutation(): boolean;
}
