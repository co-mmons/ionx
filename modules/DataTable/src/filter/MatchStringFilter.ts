import {Filter} from "./Filter";

export class MatchStringFilter extends Filter {

    constructor(public readonly value: string) {
        super();
    }

    test(value: any) {
        if (typeof value === "string" && value.indexOf(this.value) > -1) {
            return true;
        }

        return false;
    }

}
