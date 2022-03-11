import {MessageRef} from "@co.mmons/js-intl";
import {findParentNode} from "prosemirror-utils";
import {toggleList} from "../prosemirror/list-commands";
import {InsertMenuItem} from "./InsertMenuItem";
import {InsertMenuItemFactory} from "./InsertMenuItemFactory";

export const InsertListMenuItems: InsertMenuItemFactory = () => {

    return [
        {
            iconSrc: "/assets/ionx.HtmlEditor/icons/list-bulleted.svg",
            label: new MessageRef("ionx/HtmlEditor", "listMenu/Bulleted list"),
            handler(view) {

                const {state} = view;
                const {schema, selection} = state;

                if (!findParentNode(predicate => predicate.hasMarkup(schema.nodes.bulletList))(selection)) {
                    toggleList(state, t => view.dispatch(t), view, "bulletList");
                }
            }
        },
        {
            iconSrc: "/assets/ionx.HtmlEditor/icons/list-numbered.svg",
            label: new MessageRef("ionx/HtmlEditor", "listMenu/Numbered list"),
            handler(view) {

                const {state} = view;
                const {schema, selection} = state;

                if (!findParentNode(predicate => predicate.hasMarkup(schema.nodes.orderedList))(selection)) {
                    toggleList(state, t => view.dispatch(t), view, "orderedList");
                }
            }
        },
    ] as InsertMenuItem[]
}
