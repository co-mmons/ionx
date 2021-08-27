import {waitTill} from "@co.mmons/js-utils/core";
import Sortable from "sortablejs";
import {sortableItemClass} from "./sortableItemClass";
import {Select} from "./Select";

export async function initSortable(this: Select) {

    const container = this.element.getElementsByClassName("ionx--text");

    await waitTill(() => container.length === 1);

    const sortable = Sortable.get(container[0] as HTMLElement);
    if (sortable) {
        return sortable;
    }

    return Sortable.create(container[0] as HTMLElement, {
        scroll: true,
        // group: {name: `StructuralValueInput${this.internalId}`},
        sort: true,
        draggable: `.${sortableItemClass}`,

        onEnd: (ev) => {

            const values = this.valueAsArray.slice();
            const item = values[ev.oldDraggableIndex];
            values.splice(ev.oldDraggableIndex, 1);
            values.splice(ev.newDraggableIndex, 0, item);

            this.valueChanging = true;
            this.value = values;
        },

    })

}
