import { DialogButton } from "./DialogButton";
export declare class DialogButtons {
  element: HTMLElement;
  buttons: DialogButton[];
  buttonClicked(button: DialogButton): Promise<void>;
  render(): any;
}
