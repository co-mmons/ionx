import {routerPathToChain} from "./utils/matching";
import {readRoutes} from "./utils/parser";

export function matchRoute(router: HTMLIonRouterElement, urlOrPath: string) {

    const url = new URL(urlOrPath.startsWith("http") ? urlOrPath : `http://dummy${urlOrPath}`);
    const routes = readRoutes(router);

    let segments = url.pathname.split("/").map(s => s.trim()).filter(s => s.length > 0);
    if (segments.length === 0) {
        segments = [""];
    }

    const matches = routerPathToChain(segments, routes);
    if (matches?.length > 0) {
        return matches[0];
    }
}
