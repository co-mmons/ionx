import { ComponentInterface } from "@stencil/core";
import { FormControlAttachOptions } from "./FormControlAttachOptions";
import { FormController } from "./FormController";
import { FormControllerPublicApi, FormControllerValidateOptions } from "./FormControllerPublicApi";
export declare class FormComponent implements ComponentInterface, FormControllerPublicApi {
  controller: FormController;
  /**
   * If controller should be disconnected when component is disconnected from the DOM.
   * By default is true, but you can set to false when you expect that form controller component
   * can be connected/disconnected to DOM multiple times (e.g. when conditional rendering takes place).
   */
  disconnect?: boolean;
  attach(name: string, options?: FormControlAttachOptions): Promise<void>;
  validate(options?: FormControllerValidateOptions): Promise<boolean>;
  componentWillLoad(): Promise<void>;
  render(): any;
  disconnectedCallback(): void;
}
