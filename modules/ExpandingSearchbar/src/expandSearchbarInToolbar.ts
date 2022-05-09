import {tagNameExpandingSearchbar} from "./tagNameExpandingSearchbar";

export async function expandSearchbarInToolbar(evOrElement: Event) {
    await (evOrElement instanceof HTMLElement ? evOrElement : evOrElement.currentTarget as HTMLElement)
        .closest("ion-toolbar").querySelector(tagNameExpandingSearchbar)?.expand();
}
