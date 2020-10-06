import {isEqualValue} from "./isEqualValue";
import {SelectOption} from "./SelectOption";
import {ValueComparator} from "./ValueComparator";

export function valueLabel(options: SelectOption[], value: any, props: {comparator: ValueComparator, formatter?: (value: any) => string}) {

    for (let i = 0; i < options.length; i++) {

        if (isEqualValue(value, options[i].value, props.comparator)) {
            return options[i].label ?? (props.formatter ? props.formatter(value) : `${value}`);
        }
    }

    return props.formatter ? props.formatter(value) : `${value}`;
}
