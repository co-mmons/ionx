import { SelectItem } from "./SelectItem";
import { SelectProps } from "./SelectProps";
import { ValueComparator } from "./ValueComparator";
export declare function valueLabel(items: SelectItem[], value: any, props: {
  comparator: ValueComparator;
  formatter?: SelectProps.LabelFormatterFn;
}): any;
