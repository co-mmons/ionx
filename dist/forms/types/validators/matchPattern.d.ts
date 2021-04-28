import { FormControl } from "../FormControl";
export declare function matchPattern(pattern: RegExp, message?: string): (control: FormControl<string>) => Promise<void>;
