import DateTimeFormatOptions = Intl.DateTimeFormatOptions;

let currentLocale: string;

export interface TimeZoneInfo {
    id: string;
    label: string;
    date: string;
}

export function timeZoneInfo(tz: string, date?: Date) {

    if (!date) {
        date = new Date();
    }

    const format1 = {hour12: false, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", timeZone: tz} as DateTimeFormatOptions;
    const format2 = {hour12: false, year: "numeric", month: "numeric", day: "numeric", hour: "numeric", minute: "numeric", timeZoneName: "short", timeZone: tz} as DateTimeFormatOptions;

    if (!currentLocale) {
        currentLocale = new Intl.DateTimeFormat().resolvedOptions().locale;
    }

    try {
        const d = new Intl.DateTimeFormat(currentLocale, format1).format(date);
        const o = new Intl.DateTimeFormat(currentLocale, format2).format(date).replace(d, "").trim();

        return {id: tz, label: tz.replace("_", " ") + " (" + o + ")", date: d};

    } catch (error) {
        throw new Error("Invalid time zone. " + error);
        // console.log(error);
    }
}
