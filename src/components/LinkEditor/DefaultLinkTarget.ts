import {MessageRef} from "@co.mmons/js-intl";
import {Enum, EnumFromJSONValue, EnumValueName, EnumValueOfValue} from "@co.mmons/js-utils/core";
import {LinkTarget} from "./LinkTarget";

export class DefaultLinkTarget extends Enum implements LinkTarget {

    static readonly self = new DefaultLinkTarget("self");
    static readonly blank = new DefaultLinkTarget("blank");

    static values() {
        return super.values() as DefaultLinkTarget[];
    }

    static valueOf(value: EnumValueOfValue) {
        return super.valueOf(value) as DefaultLinkTarget;
    }

    static fromJSON(value: EnumFromJSONValue) {
        return super.fromJSON(value) as DefaultLinkTarget;
    }

    constructor(public readonly name: EnumValueName<typeof DefaultLinkTarget>) {
        super(name);
        this.label = new MessageRef("ionx/LinkEditor", `${name}TargetLabel`);
        this.target = `_${name}`;
    }

    readonly label: MessageRef;

    readonly target: string;

}
