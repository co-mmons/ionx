import {forceUpdate} from "@stencil/core";
import {
    addComponentDisconnectHook,
    ComponentDisconnectHook,
    getComponentDisconnectHook
} from "./componentDisconnectHooks";
import {addEventListener} from "./addEventListener";
import {EventUnlisten} from "./EventUnlisten";

const hookNamePrefix = "ionx/utils/matchesMediaQuery:";

export function matchesMediaQuery(query: string): boolean;

export function matchesMediaQuery(component: any, query: string): boolean;

export function matchesMediaQuery(componentOrQuery: any | string, query?: string): boolean {

    const component = typeof componentOrQuery === "string" ? null : componentOrQuery;

    if (!component) {
        query = componentOrQuery;
    }

    const hookName = hookNamePrefix + query;

    let matcher: QueryMatcher;

    if (component) {
        matcher = getComponentDisconnectHook<QueryMatcher>(component, hookName);
        if (!matcher) {
            addComponentDisconnectHook(component, hookName, matcher = new QueryMatcher(component, query));
        }
    } else {
        matcher = new QueryMatcher(null, query);
    }

    return matcher.matches;
}

class QueryMatcher implements ComponentDisconnectHook {

    constructor(private component: any, query: string) {

        const media = window.matchMedia(query);
        this.matches = media.matches;

        if (component) {
            this.unlisten = addEventListener(media, "change", ev => this.onChange(ev as any));
        }
    }

    matches: boolean;

    unlisten: EventUnlisten;

    onChange(event: MediaQueryListEvent) {

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
