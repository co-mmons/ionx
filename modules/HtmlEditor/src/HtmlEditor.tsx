import {sleep} from "@co.mmons/js-utils/core";
import {Component, ComponentInterface, Element, h, Host, Method} from "@stencil/core";
import {baseKeymap} from "prosemirror-commands";
import {gapCursor} from "prosemirror-gapcursor";
import {history} from "prosemirror-history";
import {keymap} from "prosemirror-keymap";
import {Schema} from "prosemirror-model";
import {EditorState, Plugin} from "prosemirror-state";
import {EditorView} from "prosemirror-view";
import {loadIntlMessages} from "./intl/loadIntlMessages";
import {buildKeymap} from "./prosemirror/keymap";
import {schema} from "./prosemirror/schema";

@Component({
    tag: "ionx-html-editor",
    styleUrl: "HtmlEditor.scss",
    scoped: true,
    assetsDirs: ["assets"]
})
export class HtmlEditor implements ComponentInterface {

    @Element()
    element: HTMLElement;

    private schema: Schema;

    private plugins: Plugin[];

    view: EditorView;

    @Method()
    async getView() {
        return this.view;
    }

    async initEditor() {

        this.schema = schema;

        this.plugins = [
            keymap(buildKeymap(schema)),
            keymap(baseKeymap),
            gapCursor(),
            history()
        ];

        const state = EditorState.create({
            schema: this.schema,
            plugins: this.plugins,
            // doc: /*this.editorDoc(this.uninitializedValue ? this.uninitializedValue : */ "<div></div>"
        });

        let container: HTMLElement;
        while (!(container = this.element.querySelector("[ionx--prosemirror]"))) {
            await sleep(50);
        }

        this.view = new EditorView(container, {
            state,
            // dispatchTransaction: (transaction) => this.editorTransaction(transaction),
            // handleScrollToSelection: (view) => this.handleScroll(view),

            nodeViews: {
                // youtube: (node, view) => new YoutubeNodeView(node, view, this.eventManager)
            }
        });

    }

    async componentWillLoad() {
        await loadIntlMessages();
    }

    connectedCallback() {
        this.initEditor();
    }

    render() {
        return <Host>
            <ionx-html-editor-toolbar/>
            <div ionx--prosemirror/>
        </Host>
    }

}
