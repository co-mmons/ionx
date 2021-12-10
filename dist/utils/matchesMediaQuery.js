import { forceUpdate } from "@stencil/core";
import { addComponentDisconnectHook, getComponentDisconnectHook } from "./componentDisconnectHooks";
import { addEventListener } from "./addEventListener";
const hookNamePrefix = "ionx/utils/matchesMediaQuery:";
export function matchesMediaQuery(componentOrQuery, query) {
    const component = typeof componentOrQuery === "string" ? null : componentOrQuery;
    if (!component) {
        query = componentOrQuery;
    }
    const hookName = hookNamePrefix + query;
    let matcher;
    if (component) {
        matcher = getComponentDisconnectHook(component, hookName);
        if (!matcher) {
            addComponentDisconnectHook(component, hookName, matcher = new QueryMatcher(component, query));
        }
    }
    else {
        matcher = new QueryMatcher(null, query);
    }
    return matcher.matches;
}
class QueryMatcher {
    constructor(component, query) {
        this.component = component;
        const media = window.matchMedia(query);
        this.matches = media.matches;
        if (component) {
            this.unlisten = addEventListener(media, "change", ev => this.onChange(ev));
        }
    }
    onChange(event) {
        this.matches = event.matches;
        console.debug("[ionx/utils/matchesMediaQuery] changed", event.media, event.matches);
        forceUpdate(this.component);
    }
    disconnect() {
        this.component = undefined;
        this.unlisten?.();
        this.unlisten = undefined;
    }
}
