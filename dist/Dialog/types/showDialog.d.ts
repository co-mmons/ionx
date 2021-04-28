import { ModalOptions } from "@ionic/core";
import { DialogOptions } from "./DialogOptions";
export declare function showDialog(options: DialogOptions & Exclude<Partial<ModalOptions>, "component" | "componentProps">): Promise<HTMLIonxDialogElement>;
export declare namespace showDialog {
  const prefetchComponents: ReadonlyArray<string>;
}
