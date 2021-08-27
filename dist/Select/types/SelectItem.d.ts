import { SelectDividerItem } from "./SelectDividerItem";
import { SelectGroupItem } from "./SelectGroupItem";
import { SelectValueItem } from "./SelectValueItem";
export interface SelectItem extends Partial<SelectValueItem>, Partial<SelectDividerItem>, Partial<SelectGroupItem> {
}
