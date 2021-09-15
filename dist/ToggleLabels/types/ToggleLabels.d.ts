import { EventEmitter } from "@stencil/core";
export declare class ToggleLabels {
  element: HTMLElement;
  on: string;
  off: string;
  /**
   * If default toggle should be created instead of user-defined.
   */
  defaultToggle: boolean;
  readonly: boolean;
  disabled: boolean;
  value: boolean;
  /**
   * @internal
   */
  prefetch: boolean;
  ionChange: EventEmitter<{
    value: boolean;
  }>;
  initialToggleState: {
    checked: boolean;
    disabled: boolean;
  };
  private get toggle();
  switchToggle(state: "on" | "off"): void;
  toggleChanged(ev: CustomEvent): void;
  valueChanged(): void;
  syncToggle(): void;
  componentDidLoad(): void;
  connectedCallback(): void;
  render(): any;
}
