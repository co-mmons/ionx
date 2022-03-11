import { ComponentInterface } from "@stencil/core";
import { InsertMenuItem } from "./InsertMenuItem";
export declare class InsertMenu implements ComponentInterface {
  editor: HTMLIonxHtmlEditorElement;
  items: InsertMenuItem[];
  handleItem(item: InsertMenuItem): Promise<void>;
  render(): any;
}
