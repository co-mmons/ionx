import {isEqualValue} from "./isEqualValue";
import {SelectItem} from "./SelectItem";
import {SelectValueItem} from "./SelectValueItem";
import {ValueComparator} from "./ValueComparator";

export function findValueItem(items: SelectItem[], value: any, comparator?: ValueComparator): SelectValueItem {
    if (items) {
        for (const item of items) {
            if ("value" in item && isEqualValue(item.value, value, comparator)) {
                return item as SelectValueItem;
            }
        }
    }
}
