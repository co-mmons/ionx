import { hydratablePrefixes, hydratableTagNames } from "./hydratables";
export function markTagNameAsHydratable(...tagName) {
    for (let name of tagName) {
        name = name.toUpperCase();
        if (!hydratableTagNames.includes(name)) {
            hydratableTagNames.push(name);
        }
    }
}
export function markTagPrefixAsHydratable(...tagPrefix) {
    for (let prefix of tagPrefix) {
        prefix = prefix.toUpperCase();
        if (!hydratablePrefixes.includes(prefix)) {
            hydratablePrefixes.push(prefix);
        }
    }
}
