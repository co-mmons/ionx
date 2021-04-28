import { SelectOption } from "./SelectOption";
import { ValueComparator } from "./ValueComparator";
export declare function valueLabel(options: SelectOption[], value: any, props: {
  comparator: ValueComparator;
  formatter?: (value: any) => string;
}): any;
