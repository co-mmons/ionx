import {intl, MessageRef} from "@co.mmons/js-intl";
import {isEqualValue} from "./isEqualValue";
import {SelectOption} from "./SelectOption";
import {ValueComparator} from "./ValueComparator";

export function valueLabel(options: SelectOption[], value: any, props: {comparator: ValueComparator, formatter?: (value: any) => string}) {

    if (!options) {
        return;
    }

    for (let i = 0; i < options.length; i++) {

        if (isEqualValue(value, options[i].value, props.comparator)) {

            if (options[i].label) {
                return options[i].label instanceof MessageRef ? intl.message(options[i].label) : options[i].label;
            }

            return props.formatter ? props.formatter(value) : `${value}`;
        }
    }

    return props.formatter ? props.formatter(value) : `${value}`;
}
