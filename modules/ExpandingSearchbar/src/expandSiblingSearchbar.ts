import {tagNameExpandingSearchbar} from "./tagNameExpandingSearchbar";

export async function expandSiblingSearchbar(evOrElement: Event) {
    await (evOrElement instanceof HTMLElement ? evOrElement : evOrElement.currentTarget as HTMLElement)
        .parentElement.querySelector(tagNameExpandingSearchbar)?.expand();
}
