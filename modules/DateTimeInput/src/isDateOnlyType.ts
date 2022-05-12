import {DateTimeInputType, DateTimeInputTypeDate} from "./DateTimeInputType";

export function isDateOnlyType(type: DateTimeInputType) {
    return (typeof type === "string" ? type : type[0]) === DateTimeInputTypeDate;
}
