import {SelectValueItem} from "ionx/Select";
import {noTimeZoneSelectValue} from "./noTimeZoneSelectValue";
import {TimeZone} from "./TimeZone";

export function timeZoneSelectItemsLoader(required: boolean, date?: Date) {

    return async (values?: string[]) => {

        if (!date) {
            date = new Date();
        }

        if (values) {
            return values.map(timeZone => (timeZone && {value: timeZone, label: TimeZone.get(timeZone)?.label} as SelectValueItem) ?? noTimeZoneSelectValue);
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
            items.push(noTimeZoneSelectValue);
        }

        return items.concat(
            unsorted.sort((a, b) => a.date.localeCompare(b.date)).map(t => ({value: t.id, label: t.label}) as SelectValueItem<string>)
        );
    }

}
