import {addEventListener} from "ionx/utils";
import {ContextMenuItem} from "./ContextMenuItem";
import {showContextMenu} from "./showContextMenu";
import {ShowContextMenuOptions} from "./ShowContextMenuOptions";

const internalProp = "__ionxContextMenuToggle";

export function contextMenuToggleButton(items: ContextMenuItem[], options?: ShowContextMenuOptions) {

    // returns anonymous function, which will:
    // 1. create __ionxContextMenuToggle prop in a button element, this will be onClick unlisten function
    // 2. create __ionxContextMenuToggle prop on a function itself, with onClick unlisten function
    const func = function (el: HTMLElement) {

        if (!el) {
            this[internalProp]?.();

        } else {

            // already initialized by other ref call
            if (typeof el[internalProp] === "function") {
                el[internalProp]();
                delete el[internalProp];
            }

            const checkedItems = items.filter(item => !!item);

            if (checkedItems.length > 0) {
                el.removeAttribute("hidden");
                this[internalProp] = el[internalProp] = addEventListener(el, "click", ev => showContextMenu(ev, items, options));
            } else {
                el.setAttribute("hidden", "");
            }
        }
    }

    return func.bind(func);
}
