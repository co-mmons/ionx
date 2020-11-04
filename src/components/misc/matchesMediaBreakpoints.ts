import {forceUpdate} from "@stencil/core";
import {
    addComponentDisconnectHook,
    ComponentDisconnectHook,
    getComponentDisconnectHook
} from "../componentDisconnectHooks";
import {addEventListener} from "./addEventListener";
import {EventUnlisten} from "./EventUnlisten";

const breakpointsMinWidth = {
    "xs": "(min-width: 0px)",
    "sm": "(min-width: 576px)",
    "md": "(min-width: 768px)",
    "lg": "(min-width: 992px)",
    "xl": "(min-width: 1200px)",
};

export type MediaBreakpoint = keyof typeof breakpointsMinWidth;

const allBreakpoints = Object.keys(breakpointsMinWidth) as MediaBreakpoint[];

const hookNamePrefix = "ionx/misc/matchesMediaBreakpoints:";

type MatchedBreakpoints<T extends MediaBreakpoint = MediaBreakpoint> = {readonly [key in T]: boolean};

export function matchesMediaBreakpoint(breakpoint: MediaBreakpoint): boolean;

export function matchesMediaBreakpoint(component: any, breakpoint: MediaBreakpoint): boolean;

export function matchesMediaBreakpoint(componentOrBreakpoint: any | MediaBreakpoint, breakpoint?: MediaBreakpoint): boolean {
    const component = typeof componentOrBreakpoint === "string" ? null : componentOrBreakpoint;
    const r = matchesMediaBreakpoints(component, [typeof componentOrBreakpoint === "string" ? componentOrBreakpoint as MediaBreakpoint : breakpoint]);
    return r[breakpoint];
}

export function matchesMediaBreakpoints(): MatchedBreakpoints<MediaBreakpoint>;

export function matchesMediaBreakpoints<T extends MediaBreakpoint>(breakpoints: T[]): MatchedBreakpoints<T>;

export function matchesMediaBreakpoints<T extends MediaBreakpoint>(component: any, breakpoints: MediaBreakpoint[]): MatchedBreakpoints<T>;

export function matchesMediaBreakpoints(component: any): MatchedBreakpoints;

export function matchesMediaBreakpoints(componentOrBreakpoints?: any | MediaBreakpoint[], breakpoints?: MediaBreakpoint[]): MatchedBreakpoints {

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

    constructor(private component: any, breakpoints: MediaBreakpoint[]) {

        for (const bp of breakpoints) {

            const media = window.matchMedia(breakpointsMinWidth[bp]);
            this.matches[bp] = media.matches;

            if (component) {

                if (!this.unlisten) {
                    this.unlisten = [];
                }

                this.unlisten.push(addEventListener(media, "change", ev => this.onChange(ev as any)));
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

        console.debug("[ionx/misc/matchesMediaBreakpoints] changed breakpoint", event.media, event.matches);

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
