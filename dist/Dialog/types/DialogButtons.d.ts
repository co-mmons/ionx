import { DialogButton } from "./DialogButton";
export declare class DialogButtons {
  element: HTMLElement;
  buttons: DialogButton[];
  /**
   * @internal
   */
  prefetch: boolean;
  buttonClicked(button: DialogButton): Promise<void>;
  componentDidLoad(): void;
  render(): any;
}
