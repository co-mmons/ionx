import { ComponentInterface, EventEmitter, FunctionalComponent } from "@stencil/core";
import { FormControl, FormControlElement, FormController, required } from "ionx/forms";
import { SelectOption } from "ionx/Select";
import { Link } from "./Link";
import { LinkEditorProps } from "./LinkEditorProps";
import { LinkScheme } from "./LinkScheme";
import { LinkTarget } from "./LinkTarget";
export declare class LinkEditor implements LinkEditorProps, ComponentInterface, FormControlElement {
  #private;
  element: HTMLElement;
  value: string | Link;
  schemes?: SelectOption[] | LinkScheme[];
  targetVisible: boolean;
  readonly: boolean;
  disabled: boolean;
  ionChange: EventEmitter<{
    value: Link;
  }>;
  errorPresenter: string | FunctionalComponent;
  formValidate(): Promise<void>;
  setFocus(options?: FocusOptions): Promise<void>;
  valueValidator(control: FormControl): Promise<void>;
  data: FormController<{
    scheme: {
      value: LinkScheme;
      validators: (typeof required)[];
    };
    value: {
      value: any;
      validators: any[];
    };
    target: {
      value: LinkTarget;
    };
  }>;
  buildLink(): Promise<Link>;
  onChanges(ev: CustomEvent): void;
  prepare(): void;
  componentWillLoad(): Promise<void>;
  connectedCallback(): void;
  render(): any;
}
