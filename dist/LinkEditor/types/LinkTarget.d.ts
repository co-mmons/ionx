import { MessageRef } from "@co.mmons/js-intl";
export interface LinkTarget {
  label: MessageRef | string;
  /**
   * Returns string representation of the target for use in {@link Link}.
   */
  target: string;
}
