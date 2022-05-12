export const defaultDateTimeFormat: Intl.DateTimeFormatOptions = {
    year: "numeric", month: "numeric", day: "numeric",
    hour: "2-digit", minute: "2-digit", second: undefined
};

export const onlyDateDefaultFormat: Intl.DateTimeFormatOptions = {
    year: "numeric", month: "numeric", day: "numeric"
};

export const onlyDateForceFormat: Intl.DateTimeFormatOptions = {
    timeZone: "UTC",
    timeZoneName: undefined
}
