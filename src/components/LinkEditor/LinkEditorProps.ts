import {SelectOption} from "../Select/SelectOption";
import {Link} from "./Link";
import {LinkScheme} from "./LinkScheme";
import {LinkTarget} from "./LinkTarget";

export interface LinkEditorProps {
    link: string | Link;
    schemes?: SelectOption[];
    normalizeFn?: (link: string | Link) => {scheme: LinkScheme, value: string, target?: LinkTarget};
}
