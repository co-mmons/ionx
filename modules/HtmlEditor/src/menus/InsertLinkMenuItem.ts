import {MessageRef} from "@co.mmons/js-intl";
import {defineIonxLinkEditor, showLinkEditor} from "ionx/LinkEditor";
import {toggleMark} from "prosemirror-commands";
import {findMarksInSelection} from "../prosemirror/utils/findMarksInSelection";
import {LinkMark} from "../schema";
import {InsertMenuItemFactory} from "./InsertMenuItemFactory";

defineIonxLinkEditor();

export const InsertLinkMenuItem: InsertMenuItemFactory = (view) => {

    const {schema, selection} = view.state;
    const linkMark = schema.marks.link;

    if (!linkMark) {
        return;
    }

    return {
        iconName: "link-outline",
        label: new MessageRef("ionx/LinkEditor", "Link"),
        sublabel: selection.empty ? new MessageRef("ionx/HtmlEditor", "selectTextToInsertLink") : undefined,

        handler: async () => {

            const markSpec = linkMark.spec;

            let href: string;
            let target: string;

            for (const mark of findMarksInSelection(view.state, linkMark)) {
                const h = mark.attrs.href;
                const t = mark.attrs.target;
                if (h) {
                    href = h;
                    target = t;
                    break;
                }
            }

            const schemes = markSpec instanceof LinkMark ? markSpec.schemes : undefined;

            const link = await showLinkEditor({value: href ? {href, target} : undefined, schemes});
            if (link) {
                toggleMark(linkMark, link)(view.state, view.dispatch);
            }

        }
    } as const

}
