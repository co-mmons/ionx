import { SelectValueItem } from "ionx/Select";
export declare function timeZoneSelectItemsLoader(required: boolean, localAllowed: boolean, date?: Date): (values?: string[]) => Promise<SelectValueItem<any>[]>;
