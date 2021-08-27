import {MessageRef} from "@co.mmons/js-intl";

export interface SelectValueItem<T = any> {
    icon?: string;
    label?: string | MessageRef;

    /**
     * Data, that will be searched if user search for an item. By default only label is matched for search query.
     * It can be useful if your items are tagged, add "#some-tag-name" and user will be able to search for this tag.
     */
    search?: string[];

    value: T;
}
