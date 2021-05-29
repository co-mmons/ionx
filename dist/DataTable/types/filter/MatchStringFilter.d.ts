import { Filter } from "./Filter";
export declare class MatchStringFilter extends Filter {
  readonly value: string;
  constructor(value: string);
  test(value: any): boolean;
}
