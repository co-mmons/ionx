import { ComponentInterface } from "@stencil/core";
export declare class InsertMenu implements ComponentInterface {
  editor: HTMLIonxHtmlEditorElement;
  selectionEmpty: boolean;
  link(): Promise<void>;
  didDismiss(): void;
  componentWillLoad(): Promise<void>;
  render(): any;
}
