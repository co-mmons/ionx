import {SelectDivider} from "./SelectDivider";
import {SelectItem} from "./SelectItem";
import {SelectValue} from "./SelectValue";
import {ValueComparator} from "./ValueComparator";

export interface SelectOverlayProps {

    overlay: "modal" | "popover";

    overlayTitle?: string;

    sortable?: boolean;

    searchTest?: (query: string, value: any, label: string) => boolean;

    /**
     * Copy of {@link Select.items}.
     */
    items: SelectItem[];

    lazyItems?: (values?: any[]) => Promise<Array<SelectValue | SelectDivider>>;

    multiple?: boolean;

    values?: any[];

    empty?: boolean;

    comparator?: ValueComparator;

    checkValidator?: (value: any, checked: boolean, otherCheckedValues: any[]) => any[];

    labelFormatter?: (value: any) => string;

}
