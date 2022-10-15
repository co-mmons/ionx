import {isEqualValue} from "./isEqualValue";
import {SelectItem} from "./SelectItem";
import {SelectValueItem} from "./SelectValueItem";
import {ValueComparator} from "./ValueComparator";

export async function findSelectValueItem(items: SelectItem[], value: any, comparator?: ValueComparator): Promise<SelectValueItem> {

    for (const item of items) {
        if ("value" in item && isEqualValue(item.value, value, comparator)) {
            return item as SelectValueItem;
        }
    }

    for (const item of items) {
        if (item.group) {
            const subitems = typeof item.items === "function" ? await item.items([value]) : item.items;
            if (subitems) {
                const i = findSelectValueItem(subitems, value, comparator);
                if (i) {
                    return i;
                }
            }
        }
    }
}
