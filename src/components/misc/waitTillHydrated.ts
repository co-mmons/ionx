import {waitTill} from "@co.mmons/js-utils/core";
import {isHydrated} from "./isHydrated";
import {IsHydratedOptions} from "./IsHydratedOptions";

export function waitTillHydrated(element: Element, options?: IsHydratedOptions & {interval?: number, timeout?: number}) {
   return waitTill(() => isHydrated(element, options), options?.interval || 100, options?.timeout);
}
