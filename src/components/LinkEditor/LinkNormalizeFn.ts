import {Link} from "./Link";
import {LinkScheme} from "./LinkScheme";
import {LinkTarget} from "./LinkTarget";

export interface LinkNormalizeFn {
    (link: string | Link): {scheme: LinkScheme, value: any, target?: LinkTarget};
}
