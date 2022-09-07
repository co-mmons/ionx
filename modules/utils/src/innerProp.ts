import {HtmlString} from "@co.mmons/js-utils/core";

export function innerProp(inner: any | HtmlString) {
    if (inner instanceof HtmlString) {
        return {innerHTML: inner.toString()};
    } else {
        return {innerText: inner};
    }
}
