import {tagNameExpandingSearchbar} from "./tagNameExpandingSearchbar";

export async function expandChildSearchbar(element: HTMLElement) {
    await element.querySelector(tagNameExpandingSearchbar)?.expand();
}
