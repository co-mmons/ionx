import {MessageRef} from "@co.mmons/js-intl";
import {SelectValueItem} from "ionx/Select";

export const unspecifiedTimeZoneSelectValue = {
    value: undefined,
    label: new MessageRef("ionx/DateTimeInput", "Unspecified|time zone")
} as SelectValueItem;
