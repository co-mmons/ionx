import {Enum, EnumFromJSONValue, EnumValueName, EnumValueOfValue} from "@co.mmons/js-utils/core";

export class MediaBreakpoint extends Enum {

    static readonly xs = new MediaBreakpoint("xs", 0);
    static readonly sm = new MediaBreakpoint("xs", 576);
    static readonly md = new MediaBreakpoint("md", 768);
    static readonly lg = new MediaBreakpoint("lg", 992);
    static readonly xl = new MediaBreakpoint("xl", 1200);

    static values() {
        return super.values() as MediaBreakpoint[];
    }

    static valueOf(value: EnumValueOfValue) {
        return super.valueOf(value) as MediaBreakpoint;
    }

    static fromJSON(value: EnumFromJSONValue) {
        return super.fromJSON(value) as MediaBreakpoint;
    }

    constructor(name: EnumValueName<typeof MediaBreakpoint>, public readonly minWidth: number) {
        super(name);
    }
}

export type MediaBreakpointName = EnumValueName<typeof MediaBreakpoint>;
