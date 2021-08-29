import {MessageRef} from "@co.mmons/js-intl";
import {SelectValueItem} from "ionx/Select";

export const noTimeZoneSelectValue = {
    value: undefined,
    label: new MessageRef("ionx/DateTime", "No time zone")
} as SelectValueItem;
