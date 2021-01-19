import {waitTill} from "@co.mmons/js-utils/core";
import {isHydrated} from "./isHydrated";
import {IsHydratedOptions} from "./IsHydratedOptions";

export async function waitTillHydrated(element: Element, options?: IsHydratedOptions & {interval?: number, timeout?: number}): Promise<boolean> {
   try {
       await waitTill(() => isHydrated(element, options), options?.interval || 100, options?.timeout);
       return true;
   } catch {
       return false;
   }
}
