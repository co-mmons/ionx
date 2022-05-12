import {DateTimeInputTypeLocalDateTime} from "./DateTimeInputType";

export function isLocalDateTimeType(type: string | string[]) {
    return (typeof type === "string" && type === DateTimeInputTypeLocalDateTime) || (Array.isArray(type) && type.includes(DateTimeInputTypeLocalDateTime));
}
