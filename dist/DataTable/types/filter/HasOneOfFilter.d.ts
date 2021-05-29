import { Filter } from "./Filter";
export declare class HasOneOfFilter extends Filter {
  readonly values: any[];
  constructor(values: any[]);
  test(value: any): boolean;
}
