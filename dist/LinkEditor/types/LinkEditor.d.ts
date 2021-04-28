import { ComponentInterface } from "@stencil/core";
import { FormControl, FormController, required } from "ionx/forms";
import { SelectOption } from "ionx/Select";
import { Link } from "./Link";
import { LinkEditorProps } from "./LinkEditorProps";
import { LinkScheme } from "./LinkScheme";
import { LinkTarget } from "./LinkTarget";
export declare class LinkEditor implements LinkEditorProps, ComponentInterface {
  link: string | Link;
  schemes?: SelectOption[] | LinkScheme[];
  targetVisible: boolean;
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
  componentWillLoad(): Promise<void>;
  connectedCallback(): void;
  render(): any;
}
