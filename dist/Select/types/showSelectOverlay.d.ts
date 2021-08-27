import { OverlayEventDetail } from "@ionic/core";
import { SelectOverlayProps } from "./SelectOverlayProps";
import { SelectValue } from "./SelectValue";
export declare function showSelectOverlay<T = any>(overlay: SelectOverlayProps, event?: Event): Promise<{
  willDismiss: Promise<OverlayEventDetail<{
    values: T[];
    items: SelectValue[];
  }>>;
  didDismiss: Promise<OverlayEventDetail<{
    values: T[];
    items: SelectValue[];
  }>>;
}>;
