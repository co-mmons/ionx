import { MessageRef } from "@co.mmons/js-intl";
import { InsertMenuItem, InsertMenuItemFactory } from "../menus";
import { ToolbarItem } from "./ToolbarItem";
export declare class InsertMenuToolbarItem extends ToolbarItem {
  constructor(...items: Array<InsertMenuItem | InsertMenuItemFactory>);
  protected readonly items: Array<InsertMenuItem | InsertMenuItemFactory>;
  label: MessageRef;
  menuComponent: string;
  menuComponentProps(view: any): {
    items: InsertMenuItem[];
  };
}
