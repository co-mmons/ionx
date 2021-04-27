import {deepEqual} from "fast-equals";
import {ValueComparator} from "./ValueComparator";

export function isEqualValue(a: any, b: any, comparator: ValueComparator) {

    if (comparator === "toString") {
        if (a !== undefined && a !== null && b !== undefined && b !== null) {
            return a.toString() === b.toString();
        } else {
            return a == b;
        }

    } else if (comparator === "deepEqual") {
        return deepEqual(a, b);

    } else if (comparator) {
        const r = this.comparator(a, b);
        return r === 0 || r === true;
    }

    return a === b;
}
