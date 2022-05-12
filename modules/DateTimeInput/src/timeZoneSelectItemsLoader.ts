import {SelectValueItem} from "ionx/Select";
import {localTimeZoneSelectValue} from "./localTimeZoneSelectValue";
import {TimeZone} from "./TimeZone";
import {unspecifiedTimeZoneSelectValue} from "./unspecifiedTimeZoneSelectValue";

export function timeZoneSelectItemsLoader(required: boolean, localAllowed: boolean, date?: Date) {

    return async (values?: string[]) => {

        if (!date) {
            date = new Date();
        }

        if (values) {
            return values.map(timeZone => timeZone === "local" ? localTimeZoneSelectValue : (timeZone && {value: timeZone, label: TimeZone.get(timeZone)?.label} as SelectValueItem));
        }

        const {timeZones} = await import("./timeZones");

        const unsorted: TimeZone[] = [];

        for (const tz of timeZones) {
            try {
                unsorted.push(TimeZone.get(tz, date));
            } catch (error) {
                // console.warn(error);
            }
        }

        const items: SelectValueItem[] = [];

        if (!required) {
            items.push(unspecifiedTimeZoneSelectValue);
        }

        if (localAllowed) {
            items.push(localTimeZoneSelectValue);
        }

        return items.concat(
            unsorted.sort((a, b) => a.date.localeCompare(b.date)).map(t => ({value: t.id, label: t.label}) as SelectValueItem<string>)
        );
    }

}
