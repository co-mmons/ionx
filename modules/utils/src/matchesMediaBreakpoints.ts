import {forceUpdate} from "@stencil/core";
import {
    addComponentDisconnectHook,
    ComponentDisconnectHook,
    getComponentDisconnectHook
} from "./componentDisconnectHooks";
import {addEventListener} from "./addEventListener";
import {EventUnlisten} from "./EventUnlisten";
import {MediaBreakpoint, MediaBreakpointName} from "./MediaBreakpoint";

const breakpointsMinWidth = {
    "xs": `(min-width: ${MediaBreakpoint.xs.minWidth}px)`,
    "sm": `(min-width: ${MediaBreakpoint.sm.minWidth}px)`,
    "md": `(min-width: ${MediaBreakpoint.md.minWidth}px)`,
    "lg": `(min-width: ${MediaBreakpoint.lg.minWidth}px)`,
    "xl": `(min-width: ${MediaBreakpoint.xl.minWidth}px)`,
    "xxl": `(min-width: ${MediaBreakpoint.xxl.minWidth}px)`,
};

const allBreakpoints = MediaBreakpoint.values().map(b => b.name) as MediaBreakpointName[];

const hookNamePrefix = "ionx/utils/matchesMediaBreakpoints:";

type MatchedBreakpoints<T extends MediaBreakpointName = MediaBreakpointName> = {readonly [key in T]: boolean};

export function matchesMediaBreakpoint(breakpoint: MediaBreakpoint): boolean;

export function matchesMediaBreakpoint(component: any, breakpoint: MediaBreakpointName): boolean;

export function matchesMediaBreakpoint(componentOrBreakpoint: any | MediaBreakpoint, breakpoint?: MediaBreakpointName): boolean {
    const component = typeof componentOrBreakpoint === "string" ? null : componentOrBreakpoint;
    const r = matchesMediaBreakpoints(component, [typeof componentOrBreakpoint === "string" ? componentOrBreakpoint as MediaBreakpointName : breakpoint]);
    return r[breakpoint];
}

export function matchesMediaBreakpoints(): MatchedBreakpoints<MediaBreakpointName>;

export function matchesMediaBreakpoints<T extends MediaBreakpointName>(breakpoints: T[]): MatchedBreakpoints<T>;

export function matchesMediaBreakpoints<T extends MediaBreakpointName>(component: any, breakpoints: MediaBreakpointName[]): MatchedBreakpoints<T>;

export function matchesMediaBreakpoints(component: any): MatchedBreakpoints;

export function matchesMediaBreakpoints(componentOrBreakpoints?: any | MediaBreakpointName[], breakpoints?: MediaBreakpointName[]): MatchedBreakpoints {

    const component = Array.isArray(componentOrBreakpoints) ? null : componentOrBreakpoints;

    if (!component) {
        breakpoints = componentOrBreakpoints;
    }

    const hookName = hookNamePrefix + (breakpoints?.length ? breakpoints.filter(bp => !!bp).join(",") : "all");

    if (!breakpoints || !breakpoints.length) {
        breakpoints = allBreakpoints;
    }

    let matcher: BreakpointMatcher;

    if (component) {
        matcher = getComponentDisconnectHook<BreakpointMatcher>(component, hookName);
        if (!matcher) {
            addComponentDisconnectHook(component, hookName, matcher = new BreakpointMatcher(component, breakpoints));
        }
    } else {
        matcher = new BreakpointMatcher(null, breakpoints);
    }

    return Object.assign({}, matcher.matches) as MatchedBreakpoints;
}

class BreakpointMatcher implements ComponentDisconnectHook {

    constructor(private component: any, breakpoints: MediaBreakpointName[]) {

        for (const bp of breakpoints) {

            const media = window.matchMedia(breakpointsMinWidth[bp]);
            this.matches[bp] = media.matches;

            if (component) {

                if (!this.unlisten) {
                    this.unlisten = [];
                }

                this.unlisten.push(addEventListener(media, "change", this.onChange.bind(this)));
            }
        }
    }

    matches: {[breakpoint: string]: boolean} = {};

    unlisten: EventUnlisten[];

    onChange(event: MediaQueryListEvent) {

        for (const bp in breakpointsMinWidth) {
            if (breakpointsMinWidth[bp] === event.media) {
                this.matches[bp] = event.matches;
                break;
            }
        }

        console.debug("[ionx/utils/matchesMediaBreakpoints] changed breakpoint", event.media, event.matches);

        forceUpdate(this.component);
    }

    disconnect() {
        this.component = undefined;

        if (this.unlisten) {
            for (const un of this.unlisten) {
                un();
            }

            this.unlisten = undefined;
        }
    }
}
