import { SelectItem } from "./SelectItem";
import { ValueComparator } from "./ValueComparator";
export declare function valueLabel(items: SelectItem[], value: any, props: {
  comparator: ValueComparator;
  formatter?: (value: any) => string;
}): any;
