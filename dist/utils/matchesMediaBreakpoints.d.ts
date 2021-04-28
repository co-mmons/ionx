import { MediaBreakpoint, MediaBreakpointName } from "./MediaBreakpoint";
declare type MatchedBreakpoints<T extends MediaBreakpointName = MediaBreakpointName> = {
    readonly [key in T]: boolean;
};
export declare function matchesMediaBreakpoint(breakpoint: MediaBreakpoint): boolean;
export declare function matchesMediaBreakpoint(component: any, breakpoint: MediaBreakpointName): boolean;
export declare function matchesMediaBreakpoints(): MatchedBreakpoints<MediaBreakpointName>;
export declare function matchesMediaBreakpoints<T extends MediaBreakpointName>(breakpoints: T[]): MatchedBreakpoints<T>;
export declare function matchesMediaBreakpoints<T extends MediaBreakpointName>(component: any, breakpoints: MediaBreakpointName[]): MatchedBreakpoints<T>;
export declare function matchesMediaBreakpoints(component: any): MatchedBreakpoints;
export {};
