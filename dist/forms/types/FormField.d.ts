import { MessageRef } from "@co.mmons/js-intl";
import { ComponentInterface } from "@stencil/core";
import { FormControlState } from "./FormControlState";
import { FormValidationError } from "./FormValidationError";
export declare class FormField implements ComponentInterface {
  label?: string;
  flexContent?: boolean;
  expanded?: boolean;
  collapsible?: boolean;
  control?: FormControlState;
  error?: string | FormValidationError | MessageRef | Error;
  errorMessage: string;
  toggleExpanded(): Promise<void>;
  setExpanded(expanded: boolean): Promise<void>;
  watchErrorProps(): void;
  private buildErrorMessage;
  componentWillLoad(): Promise<void>;
  render(): any;
}
