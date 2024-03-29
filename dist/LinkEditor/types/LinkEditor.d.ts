import { ComponentInterface, EventEmitter, FunctionalComponent } from "@stencil/core";
import { FormControl, FormControlElement, FormController } from "ionx/forms";
import { SelectItem } from "ionx/Select";
import { Link } from "./Link";
import { LinkEditorProps } from "./LinkEditorProps";
import { LinkScheme } from "./LinkScheme";
import { LinkTarget } from "./LinkTarget";
export declare class LinkEditor implements LinkEditorProps, ComponentInterface, FormControlElement {
  #private;
  element: HTMLElement;
  empty: boolean;
  value: string | Link;
  schemes?: SelectItem[] | LinkScheme[];
  targetVisible: boolean;
  placeholder: string;
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
      validators: ((ctrl: FormControl<any>) => Promise<void>)[];
    };
    value: {
      value: any;
      validators: any[];
    };
    params: {
      value: any;
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
