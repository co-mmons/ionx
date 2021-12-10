import { waitTill } from "@co.mmons/js-utils/core";
import { isHydrated } from "./isHydrated";
export async function waitTillHydrated(element, options) {
    try {
        await waitTill(() => isHydrated(element, options), options?.interval || 100, options?.timeout);
        return true;
    }
    catch {
        return false;
    }
}
