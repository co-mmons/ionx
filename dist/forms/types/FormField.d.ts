import { MessageRef } from "@co.mmons/js-intl";
import { ComponentInterface } from "@stencil/core";
import { FormControlState } from "./FormControlState";
import { FormValidationError } from "./FormValidationError";
export declare class FormField implements ComponentInterface {
  label?: string;
  flexContent?: boolean;
  control?: FormControlState;
  error?: string | FormValidationError | MessageRef | Error;
  errorMessage: string;
  watchErrorProps(): void;
  private buildErrorMessage;
  componentWillLoad(): Promise<void>;
  render(): any;
}
