import { waitTill } from "@co.mmons/js-utils/core";
import { isHydrated } from "./isHydrated";
export async function waitTillHydrated(element, options) {
    try {
        await waitTill(() => isHydrated(element, options), (options === null || options === void 0 ? void 0 : options.interval) || 100, options === null || options === void 0 ? void 0 : options.timeout);
        return true;
    }
    catch (_a) {
        return false;
    }
}
