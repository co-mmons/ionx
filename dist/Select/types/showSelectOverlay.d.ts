import { OverlayEventDetail } from "@ionic/core";
import { SelectOverlayProps } from "./SelectOverlayProps";
import { SelectValueItem } from "./SelectValueItem";
export declare function showSelectOverlay<T = any>(overlay: SelectOverlayProps, event?: Event): Promise<{
  willDismiss: Promise<OverlayEventDetail<{
    values: T[];
    items: SelectValueItem[];
  }>>;
  didDismiss: Promise<OverlayEventDetail<{
    values: T[];
    items: SelectValueItem[];
  }>>;
}>;
