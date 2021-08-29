import {TimeZoneDate} from "@co.mmons/js-utils/core";

export interface DateTimeInputProps {
    placeholder?: string;
    dateOnly?: boolean;

    /**
     * Whether timezone cannot be changed.
     */
    timeZoneDisabled?: boolean;

    /**
     * Timezone, that will be set, when new value is picked from picker.
     * By default  time zone of current device will be used.
     */
    defaultTimeZone?: string | "current";

    /**
     * If time zone must be chosen, by default true.
     */
    timeZoneRequired?: boolean;

    clearButtonVisible?: boolean;

    clearButtonIcon?: string;

    clearButtonText?: string;

    readonly?: boolean;

    disabled?: boolean;

    formatOptions?: Intl.DateTimeFormatOptions;

    value?: TimeZoneDate;

}
