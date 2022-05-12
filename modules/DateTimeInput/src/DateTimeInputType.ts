type localDateTime = "local-date-time";
type dateTime = "date-time";
type date = "date";

export const DateTimeInputTypeDate = "date";
export const DateTimeInputTypeDateTime = "date-time";
export const DateTimeInputTypeLocalDateTime = "local-date-time";

export type DateTimeInputType = date | localDateTime | dateTime | [date] | [localDateTime] | [dateTime] | [localDateTime, dateTime] | [dateTime, localDateTime];
