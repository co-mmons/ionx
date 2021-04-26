import {waitTill} from "@co.mmons/js-utils/core";

export async function fixIonItemOverflow(editor: HTMLElement) {

    const item = editor.closest("ion-item");
    if (item) {
        await waitTill(() => !!item.shadowRoot && !!item.shadowRoot.querySelector(".item-inner"));

        item.style.overflow = "initial";

        const style = document.createElement("style");
        style.innerHTML = `.item-native, .item-inner, .input-wrapper { overflow: initial !important; }`;
        item.shadowRoot.appendChild(style);
    }
}
