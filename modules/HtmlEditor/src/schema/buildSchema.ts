import {buildSchemaWithOptions, MarkSpecOrNodeSpec} from "./buildSchemaWithOptions";

export function buildSchema(...specs: Array<MarkSpecOrNodeSpec>) {
    return buildSchemaWithOptions({}, ...specs);
}
