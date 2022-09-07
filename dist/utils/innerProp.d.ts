import { HtmlString } from "@co.mmons/js-utils/core";
export declare function innerProp(inner: any | HtmlString): {
    innerHTML: string;
    innerText?: undefined;
} | {
    innerText: any;
    innerHTML?: undefined;
};
