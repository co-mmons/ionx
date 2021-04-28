import { IsHydratedOptions } from "./IsHydratedOptions";
export declare function waitTillHydrated(element: Element, options?: IsHydratedOptions & {
    interval?: number;
    timeout?: number;
}): Promise<boolean>;
