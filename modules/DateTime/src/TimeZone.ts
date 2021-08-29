let currentLocale: string;

export interface TimeZone {
    id: string;
    label: string;
    date: string;
}

export namespace TimeZone {

    export function get(tz: string, date?: Date) {

        if (!date) {
            date = new Date();
        }

        const fullFormat = {
            hour12: false, year: "numeric",
            month: "numeric", day: "numeric",
            hour: "numeric", minute: "numeric",
            timeZone: tz
        } as Intl.DateTimeFormatOptions;

        const shortFormat = {
            hour12: false, year: "numeric",
            month: "numeric", day: "numeric",
            hour: "numeric", minute: "numeric",
            timeZoneName: "short", timeZone: tz
        } as Intl.DateTimeFormatOptions;

        if (!currentLocale) {
            currentLocale = new Intl.DateTimeFormat().resolvedOptions().locale;
        }

        try {
            const full = new Intl.DateTimeFormat(currentLocale, fullFormat).format(date);
            const short = new Intl.DateTimeFormat(currentLocale, shortFormat).format(date).replace(full, "").trim();

            return {id: tz, label: tz.replace("_", " ") + " (" + short + ")", date: full};

        } catch (error) {
            throw new Error("Invalid time zone. " + error);
            // console.log(error);
        }
    }

}

