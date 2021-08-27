import {SelectDivider} from "./SelectDivider";
import {SelectGroup} from "./SelectGroup";
import {SelectValue} from "./SelectValue";

export interface SelectItem extends Partial<SelectValue>, Partial<SelectDivider>, Partial<SelectGroup> {
}
