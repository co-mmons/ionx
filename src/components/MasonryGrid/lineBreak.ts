export const lineBreakAttribute = "ionx-masonry-grid-line-break";

export function lineBreak(beforeOrAfter: "before" | "after" | boolean = "before") {
    if (!beforeOrAfter) {
        return {};
    } else {
        return {[lineBreakAttribute]: beforeOrAfter === "before" || beforeOrAfter === true ? "before" : "after"}
    }
}
