import { LinkEditorProps } from "./LinkEditorProps";
export declare class LinkEditorDialog {
  element: HTMLElement;
  editorProps: LinkEditorProps;
  ok(): Promise<import("./Link").Link>;
  render(): any;
}
