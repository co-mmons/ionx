import { OverlayEventDetail } from "@ionic/core";
import { SelectOverlayProps } from "./SelectOverlayProps";
export declare function showSelectOverlay<T = any>(overlay: SelectOverlayProps, event?: Event): Promise<{
  willDismiss: Promise<OverlayEventDetail<T[]>>;
  didDismiss: Promise<OverlayEventDetail<T[]>>;
}>;
