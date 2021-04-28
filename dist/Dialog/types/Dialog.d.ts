import { HtmlString } from "@co.mmons/js-utils/core";
import { OverlayEventDetail } from "@ionic/core";
import { DialogButton } from "./DialogButton";
import { DialogOptions } from "./DialogOptions";
export declare class Dialog implements DialogOptions {
  #private;
  element: HTMLElement;
  /**
   * @inheritDoc
   */
  header?: string;
  /**
   * @inheritDoc
   */
  subheader?: string;
  /**
   * @inheritDoc
   */
  component?: string;
  /**
   * @inheritDoc
   */
  componentProps?: {
    [prop: string]: any;
  };
  /**
   * @inheritDoc
   */
  message?: string | HtmlString;
  /**
   * @inheritDoc
   */
  messageComponent?: string;
  /**
   * @inheritDoc
   */
  messageComponentProps?: {
    [prop: string]: any;
  };
  /**
   * @inheritDoc
   */
  buttons?: DialogButton[];
  clickButton(role: string): Promise<void>;
  /**
   * @internal
   */
  prefetch: boolean;
  /**
   * A promise resolved when dialog was fully presented.
   */
  onDidEnter(): Promise<true>;
  ionDidEnter(): void;
  onDidDismiss(): Promise<OverlayEventDetail<any>>;
  onWillDismiss(): Promise<OverlayEventDetail<any>>;
  componentDidLoad(): void;
  render(): any;
}
