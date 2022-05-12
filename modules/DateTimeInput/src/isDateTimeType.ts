import {DateTimeInputTypeDateTime} from "./DateTimeInputType";

export function isDateTimeType(type: string | string[]) {
    return (typeof type === "string" && type === DateTimeInputTypeDateTime) || (Array.isArray(type) && type.includes(DateTimeInputTypeDateTime));
}
