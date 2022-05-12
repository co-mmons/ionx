declare type localDateTime = "local-date-time";
declare type dateTime = "date-time";
declare type date = "date";
export declare const DateTimeInputTypeDate = "date";
export declare const DateTimeInputTypeDateTime = "date-time";
export declare const DateTimeInputTypeLocalDateTime = "local-date-time";
export declare type DateTimeInputType = date | localDateTime | dateTime | [date] | [localDateTime] | [dateTime] | [localDateTime, dateTime] | [dateTime, localDateTime];
export {};
