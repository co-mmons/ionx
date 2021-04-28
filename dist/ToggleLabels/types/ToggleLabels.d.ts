import { EventEmitter } from "@stencil/core";
export declare class ToggleLabels {
  element: HTMLElement;
  on: string;
  off: string;
  readonly: boolean;
  disabled: boolean;
  value: boolean;
  ionChange: EventEmitter<{
    value: boolean;
  }>;
  initialToggleState: {
    checked: boolean;
    disabled: boolean;
  };
  private get toggle();
  switchToggle(state: "on" | "off"): void;
  toggleChanged(): void;
  valueChanged(): void;
  syncToggle(): void;
  connectedCallback(): void;
  render(): any;
}
