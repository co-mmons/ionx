export interface TimeZone {
  id: string;
  label: string;
  date: string;
}
export declare namespace TimeZone {
  function get(tz: string, date?: Date): {
    id: string;
    label: string;
    date: string;
  };
}
