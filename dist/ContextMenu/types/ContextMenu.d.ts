import { ContextMenuItem } from "./ContextMenuItem";
export declare class ContextMenu {
  element: HTMLElement;
  items: ContextMenuItem[];
  itemClicked(item: ContextMenuItem): Promise<void>;
  render(): any;
}
