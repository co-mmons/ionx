import { Enum } from "@co.mmons/js-utils/core";
export class MediaBreakpoint extends Enum {
    constructor(name, minWidth) {
        super(name);
        this.minWidth = minWidth;
    }
    static values() {
        return super.values();
    }
    static valueOf(value) {
        return super.valueOf(value);
    }
    static fromJSON(value) {
        return super.fromJSON(value);
    }
}
MediaBreakpoint.xs = new MediaBreakpoint("xs", 0);
MediaBreakpoint.sm = new MediaBreakpoint("sm", 576);
MediaBreakpoint.md = new MediaBreakpoint("md", 768);
MediaBreakpoint.lg = new MediaBreakpoint("lg", 992);
MediaBreakpoint.xl = new MediaBreakpoint("xl", 1200);
