import {TimeZoneDate} from "@co.mmons/js-utils/core";

export interface DateTimeInputProps {
    placeholder?: string;

    /**
     * The value, that will be initialy set when user opens date/time picker.
     */
    initialValue?: TimeZoneDate;

    /**
     * If only date can be chosen. Change will cause change of the value (if present), but ionChange event is not fired.
     */
    dateOnly?: boolean;

    /**
     * Whether timezone cannot be changed.
     */
    timeZoneDisabled?: boolean;

    /**
     * Timezone, that will be set, when new value is picked from picker.
     * By default, time zone of current device will be used.
     */
    defaultTimeZone?: string | "current";

    /**
     * If time zone must be chosen, by default true.
     */
    timeZoneRequired?: boolean;

    clearButtonVisible?: boolean;

    clearButtonIcon?: string;

    readonly?: boolean;

    disabled?: boolean;

    formatOptions?: Intl.DateTimeFormatOptions;

    value?: TimeZoneDate;

}
