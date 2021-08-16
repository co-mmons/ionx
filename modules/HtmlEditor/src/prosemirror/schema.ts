import {MarkSpec, NodeSpec, Schema} from "prosemirror-model";
import {marks as basicMarks, nodes as basicNodes} from "prosemirror-schema-basic";
import {bulletList, listItem, orderedList} from "prosemirror-schema-list";
import {alignment} from "./marks/alignment";
import {fontSize} from "./marks/font-size";
import {textColor} from "./marks/textColor";
import {youtube} from "./nodes/youtube";
import {paragraph} from "./nodes/paragraph";

export const nodes = {
    doc: {
        content: "block+",
        marks: "alignment",
    },

    paragraph,
    blockquote: basicNodes.blockquote,
    horizontalRule: basicNodes.horizontal_rule,
    heading: basicNodes.heading,
    text: basicNodes.text,
    hardBreak: basicNodes.hard_break,

    bulletList: Object.assign({}, bulletList, {
        content: "listItem+",
        group: "block"
    }) as NodeSpec,

    orderedList: Object.assign({}, orderedList, {
        content: "listItem+",
        group: "block"
    }) as NodeSpec,

    listItem: Object.assign({}, listItem, {
        content: "paragraph block*",
        marks: "alignment"
    }) as NodeSpec,

    youtube
};

export const marks = {
    link: {
        attrs: {
            href: {},
            target: {default: null},
            title: {default: null}
        },
        inclusive: false,
        parseDOM: [{
            tag: "a[href]",
            getAttrs(dom: HTMLElement | string) {
                if (dom instanceof HTMLElement) {
                    return {href: dom.getAttribute("href"), target: dom.getAttribute("target"), title: dom.getAttribute("title")}
                }
            }
        }],
        toDOM(node) {
            const {href, title, target} = node.attrs;
            return ["a", {href, title, target}, 0]
        }
    } as MarkSpec,
    em: basicMarks.em,
    strong: basicMarks.strong,
    alignment,
    fontSize,
    textColor,

    underline: {
        parseDOM: [{tag: "u"}, {style: "text-decoration=underline"}],
        toDOM() {
            return ["u", 0];
        }
    } as MarkSpec
};

export const schema = new Schema<keyof typeof nodes, keyof typeof marks>({nodes, marks});

