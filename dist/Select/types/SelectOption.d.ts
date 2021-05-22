import { MessageRef } from "@co.mmons/js-intl";
export interface SelectOption {
  icon?: string;
  label?: string | MessageRef;
  value?: any;
  divider?: boolean;
  group?: boolean;
  options?: SelectOption[];
  lazyOptions?: () => Promise<SelectOption>;
}
