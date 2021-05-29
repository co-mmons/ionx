import {Filter} from "./Filter";

export class HasOneOfFilter extends Filter {

    constructor(public readonly values: any[]) {
        super();
    }

    test(value: any) {
        for (const v of this.values) {
            if (v === value) {
                return true;
            }
        }

        return false;
    }

}
