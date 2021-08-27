import {intl, MessageRef} from "@co.mmons/js-intl";
import {isEqualValue} from "./isEqualValue";
import {SelectItem} from "./SelectItem";
import {ValueComparator} from "./ValueComparator";

export function valueLabel(items: SelectItem[], value: any, props: {comparator: ValueComparator, formatter?: (value: any) => string}) {

    if (!items) {
        return;
    }

    for (let i = 0; i < items.length; i++) {

        if (isEqualValue(value, items[i].value, props.comparator)) {

            if (items[i].label) {
                return items[i].label instanceof MessageRef ? intl.message(items[i].label) : items[i].label;
            }

            return props.formatter ? props.formatter(value) : `${value}`;
        }
    }

    return props.formatter ? props.formatter(value) : `${value}`;
}
