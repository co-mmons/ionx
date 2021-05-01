import { ContextMenuItem } from "./ContextMenuItem";
export declare function showContextMenu(target: HTMLElement | Event, items: ContextMenuItem[], options?: {
  showBackdrop?: boolean;
}): Promise<void>;
