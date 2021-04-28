import { Enum, EnumFromJSONValue, EnumValueName, EnumValueOfValue } from "@co.mmons/js-utils/core";
export declare class MediaBreakpoint extends Enum {
    readonly minWidth: number;
    static readonly xs: MediaBreakpoint;
    static readonly sm: MediaBreakpoint;
    static readonly md: MediaBreakpoint;
    static readonly lg: MediaBreakpoint;
    static readonly xl: MediaBreakpoint;
    static values(): MediaBreakpoint[];
    static valueOf(value: EnumValueOfValue): MediaBreakpoint;
    static fromJSON(value: EnumFromJSONValue): MediaBreakpoint;
    constructor(name: EnumValueName<typeof MediaBreakpoint>, minWidth: number);
}
export declare type MediaBreakpointName = EnumValueName<typeof MediaBreakpoint>;
