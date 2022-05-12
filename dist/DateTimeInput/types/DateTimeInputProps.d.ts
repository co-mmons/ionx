import { DateTimeInputType } from "./DateTimeInputType";
import { DateTimeInputValue } from "./DateTimeInputValue";
export interface DateTimeInputProps {
  type?: DateTimeInputType;
  placeholder?: string;
  readonly?: boolean;
  disabled?: boolean;
  /**
   * The value, that will be initially set when user opens date/time picker.
   */
  initialValue?: DateTimeInputValue;
  value?: DateTimeInputValue;
  /**
   * Jeżeli wartością może być date-time to czy możliwość wyboru strefy czasowej jest zablokowana.
   * Jeżeli true to strefa czasowa będzie taka jak określona w {@link value}, {@link initialValue} lub {@link defaultTimeZone}.
   */
  timeZoneDisabled?: boolean;
  /**
   * If time zone must be chosen, by default true.
   */
  timeZoneRequired?: boolean;
  /**
   * Timezone, that will be set, when new value is picked from picker.
   */
  defaultTimeZone?: string;
  clearButtonVisible?: boolean;
  clearButtonIcon?: string;
  formatOptions?: Intl.DateTimeFormatOptions;
}
