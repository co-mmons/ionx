export interface TimeZoneInfo {
  id: string;
  label: string;
  date: string;
}
export declare function timeZoneInfo(tz: string, date?: Date): {
  id: string;
  label: string;
  date: string;
};
