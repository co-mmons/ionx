import { MessageRef } from "@co.mmons/js-intl";
import { FormControlState } from "./FormControlState";
import { FormValidationError } from "./FormValidationError";
export declare class FormItem {
  /**
   * This attributes determines the background and border color of the form item.
   * By default, items have a clear background and no border.
   */
  fill: "clear" | "solid" | "outline";
  control?: FormControlState;
  error?: string | FormValidationError | MessageRef | Error;
  errorMessage: string;
  watchControl(): void;
  watchError(): void;
  buildErrorMessage(): void;
  hint: string;
  /**
   * @deprecated
   */
  partProps: {
    item?: Partial<import("@stencil/core/internal").JSXBase.HTMLAttributes> & Partial<import("@ionic/core/components").Components.IonItem>;
  };
  itemProps: Partial<import("@stencil/core/internal").JSXBase.HTMLAttributes> & Partial<import("@ionic/core/components").Components.IonItem>;
  itemStyle?: {
    [key: string]: string;
  };
  componentWillLoad(): Promise<void>;
  render(): any;
}
