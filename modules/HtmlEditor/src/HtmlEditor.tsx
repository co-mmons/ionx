import {waitTill} from "@co.mmons/js-utils/core";
import {Component, ComponentInterface, Element, Event, EventEmitter, h, Host, Method, Prop, Watch} from "@stencil/core";
import {loadIonxLinkEditorIntl} from "ionx/LinkEditor";
import {Keymap} from "prosemirror-commands";
import {history} from "prosemirror-history";
import {keymap} from "prosemirror-keymap";
import {DOMParser, DOMSerializer, Schema} from "prosemirror-model";
import {EditorState, Plugin, Transaction} from "prosemirror-state";
import {EditorView} from "prosemirror-view";
import {loadIntlMessages} from "./intl/loadIntlMessages";
import {undoRedoKeymap} from "./keymaps";
import {MarkSpecExtended, NodeSpecExtended} from "./schema";
import {ToolbarItem} from "./toolbar/ToolbarItem";
import {findScrollParent} from "./utils/findScrollParent";
import {fixIonItemOverflow} from "./utils/fixIonItemOverflow";
import {scrollIntoView} from "./utils/scrollIntoView";
import {scrollToCaret} from "./utils/scrollToCaret";

@Component({
    tag: "ionx-html-editor",
    styleUrl: "HtmlEditor.scss",
    assetsDirs: ["assets"]
})
export class HtmlEditor implements ComponentInterface {

    @Element()
    element: HTMLElement;

    @Prop()
    readonly: boolean;

    @Prop()
    disabled: boolean;

    @Prop({mutable: true})
    value: string;

    @Prop()
    schema: Schema;

    @Prop()
    plugins: Plugin[];

    @Prop()
    keymap: Keymap | Keymap[];

    @Prop()
    historyDisabled: boolean;

    @Prop()
    toolbarItems: ToolbarItem[];

    /**
     * @internal
     */
    @Event()
    editorSelectionChange: EventEmitter<any>;

    @Event()
    ionChange: EventEmitter<{value: string}>;

    @Method()
    async getView() {
        return this.view;
    }

    @Method()
    async getState(): Promise<EditorState<Schema>> {
        return this.view.state;
    }

    @Method()
    async getScheme(): Promise<Schema> {
        return this.view.state.schema;
    }

    @Method()
    async setFocus() {

        if (!this.scrollParent) {
            this.scrollParent = findScrollParent(this.element);
        }

        (this.view.dom as HTMLElement).focus({preventScroll: true});

        const pos = this.view.domAtPos(this.view.state.selection.to);
        if (pos.node) {
            if (pos.node.nodeType === Node.TEXT_NODE) {
                scrollToCaret(this.scrollParent);
            } else {
                scrollIntoView(this.view.dom.querySelector(".ionx--selected") || pos.node as HTMLElement, this.scrollParent);
            }
        }
    }

    /**
     * Set to true, when value changed by user to make sure, that
     * ProseMirror will not be notified about this change.
     * @private
     */
    private valueChangedByProseMirror: boolean;

    private scrollParent: HTMLElement;

    private view: EditorView<Schema>;

    @Watch("value")
    protected valueChanged(value: string, old: string) {

        if (value !== old) {
            console.debug("[ionx-html-editor]", "value changed");

            if (this.view && !this.valueChangedByProseMirror) {

                const state = EditorState.create({
                    schema: this.view.state.schema,
                    plugins: this.view.state.plugins,
                    doc: this.editorDocument(value || "<div></div>")
                });

                this.view.updateState(state);
            }
        }

        this.valueChangedByProseMirror = false;
    }

    @Watch("disabled")
    @Watch("readonly")
    protected applyProseMirrorStatus() {
        if (this.view) {
            const thiz = this;
            this.view.setProps({editable: () => !thiz.readonly && !thiz.disabled});
        }
    }

    private async initEditor() {

        const container = this.element.getElementsByClassName("ionx--prosemirror");
        await waitTill(() => container.length > 0, 1);

        const plugins = [

            ...Object.values(this.schema.nodes)
                .filter(node => node.spec instanceof NodeSpecExtended && node.spec.keymap)
                .map(node => keymap((node.spec as NodeSpecExtended).keymap(this.schema))),

            ...Object.values(this.schema.marks)
                .filter(mark => mark.spec instanceof MarkSpecExtended && mark.spec.keymap)
                .map(mark => keymap((mark.spec as MarkSpecExtended).keymap(this.schema))),

            ...(!this.historyDisabled ? [keymap(undoRedoKeymap)] : []),
            ...(Array.isArray(this.keymap) ? this.keymap.map(km => keymap(km)) : (this.keymap ? [keymap(this.keymap)] : [])),
            ...(this.plugins ?? []),
            ...(!this.historyDisabled ? [history()] : [])
        ];

        const state = EditorState.create({
            schema: this.schema,
            plugins: plugins,
            doc: this.editorDocument(this.value ? this.value : "<div></div>")
        });

        this.view = new EditorView(container[0], {
            state,
            dispatchTransaction: transaction => this.onEditorTransaction(transaction),
            handleScrollToSelection: view => this.handleEditorScroll(view),
            nodeViews: Object.assign({},
                ...Object.values(this.schema.nodes).filter(node => node.spec instanceof NodeSpecExtended && node.spec.render)
                    .map(node => ({[node.name]: node.spec.render.bind(node.spec)})),
                ...Object.values(this.schema.marks)
                    .filter(mark => mark.spec instanceof MarkSpecExtended && mark.spec.render)
                    .map(mark => mark.spec as MarkSpecExtended)
                    .map(mark => ({[mark.name]: mark.render.bind(mark)}))
                )
        });

        this.applyProseMirrorStatus();
    }

    private handleEditorScroll(view: EditorView) {

        if (!this.scrollParent) {
            this.scrollParent = findScrollParent(this.element);
        }

        const pos = view.domAtPos(view.state.selection.to);
        if (pos.node) {
            if (pos.node.nodeType === Node.TEXT_NODE) {
                scrollToCaret(this.scrollParent);
            } else {
                scrollIntoView(view.dom.querySelector(".ionx--selected") || pos.node as HTMLElement, this.scrollParent);
            }
        }

        return false;
    }

    private editorDocument(html: string) {

        const node = document.createElement("div");
        node.innerHTML = html;
        // this.prepareInputValue(node);

        return DOMParser.fromSchema(this.schema).parse(node);
    }

    private editorValue(): string {
        if (this.view) {
            const value = DOMSerializer.fromSchema(this.schema).serializeFragment(this.view.state.doc.content);
            const tmp = document.createElement("div");
            tmp.appendChild(value);

            if (!tmp.innerText) {
                return null;
            } else {
                return tmp.innerHTML; // this.prepareOutputValue(tmp);
            }

        } else {
            return this.value;
        }
    }

    private onEditorTransaction(transaction: Transaction) {

        (this.view.dom as HTMLElement).focus({preventScroll: true});

        this.view.updateState(this.view.state.apply(transaction));

        // this.setFocus();
        this.editorSelectionChange.emit();

        if (transaction.docChanged) {
            const value = this.editorValue();
            if (this.value !== value) {
                this.valueChangedByProseMirror = true;
                this.value = value;
                this.ionChange.emit({value});
            }
        }
    }

    async componentWillLoad() {
        await loadIntlMessages();
        await loadIonxLinkEditorIntl();
    }

    connectedCallback() {
        this.initEditor();
        fixIonItemOverflow(this.element);
    }

    disconnectedCallback() {
        this.view?.destroy();
        this.view = undefined;
    }

    render() {
        return <Host>

            {!this.readonly && <ionx-html-editor-toolbar
                items={this.toolbarItems}
                historyDisabled={this.historyDisabled}/>}

            <div class="ionx--prosemirror"/>
        </Host>
    }

}
