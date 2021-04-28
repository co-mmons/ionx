import { forceUpdate } from "@stencil/core";
import { addComponentDisconnectHook, getComponentDisconnectHook } from "./componentDisconnectHooks";
import { addEventListener } from "./addEventListener";
import { MediaBreakpoint } from "./MediaBreakpoint";
const breakpointsMinWidth = {
    "xs": `(min-width: ${MediaBreakpoint.xs.minWidth}px)`,
    "sm": `(min-width: ${MediaBreakpoint.sm.minWidth}px)`,
    "md": `(min-width: ${MediaBreakpoint.md.minWidth}px)`,
    "lg": `(min-width: ${MediaBreakpoint.lg.minWidth}px)`,
    "xl": `(min-width: ${MediaBreakpoint.xl.minWidth}px)`,
};
const allBreakpoints = MediaBreakpoint.values().map(b => b.name);
const hookNamePrefix = "ionx/utils/matchesMediaBreakpoints:";
export function matchesMediaBreakpoint(componentOrBreakpoint, breakpoint) {
    const component = typeof componentOrBreakpoint === "string" ? null : componentOrBreakpoint;
    const r = matchesMediaBreakpoints(component, [typeof componentOrBreakpoint === "string" ? componentOrBreakpoint : breakpoint]);
    return r[breakpoint];
}
export function matchesMediaBreakpoints(componentOrBreakpoints, breakpoints) {
    const component = Array.isArray(componentOrBreakpoints) ? null : componentOrBreakpoints;
    if (!component) {
        breakpoints = componentOrBreakpoints;
    }
    const hookName = hookNamePrefix + ((breakpoints === null || breakpoints === void 0 ? void 0 : breakpoints.length) ? breakpoints.filter(bp => !!bp).join(",") : "all");
    if (!breakpoints || !breakpoints.length) {
        breakpoints = allBreakpoints;
    }
    let matcher;
    if (component) {
        matcher = getComponentDisconnectHook(component, hookName);
        if (!matcher) {
            addComponentDisconnectHook(component, hookName, matcher = new BreakpointMatcher(component, breakpoints));
        }
    }
    else {
        matcher = new BreakpointMatcher(null, breakpoints);
    }
    return Object.assign({}, matcher.matches);
}
class BreakpointMatcher {
    constructor(component, breakpoints) {
        this.component = component;
        this.matches = {};
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
    onChange(event) {
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
