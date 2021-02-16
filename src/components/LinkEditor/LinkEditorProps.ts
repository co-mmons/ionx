import {SelectOption} from "../Select/SelectOption";
import {Link} from "./Link";
import {LinkScheme} from "./LinkScheme";

export interface LinkEditorProps {
    link: string | Link;
    schemes?: SelectOption[] | LinkScheme[];
    targetVisible?: boolean;
}
