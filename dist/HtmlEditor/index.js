import { HTMLElement as HTMLElement$1, createEvent, h, Host, Fragment as Fragment$1, forceUpdate, proxyCustomElement } from '@stencil/core/internal/client';
export { setAssetPath, setPlatformOptions } from '@stencil/core/internal/client';
import * as baseCommand from 'prosemirror-commands';
import { toggleMark, chainCommands, deleteSelection, joinBackward, selectNodeBackward, joinForward, selectNodeForward, selectAll, joinUp, joinDown, lift, selectParentNode, newlineInCode, createParagraphNear, liftEmptyBlock, splitBlock, exitCode, setBlockType } from 'prosemirror-commands';
import * as baseListCommand from 'prosemirror-schema-list';
import { splitListItem } from 'prosemirror-schema-list';
import { MarkType, Schema, Slice, Fragment, NodeRange, DOMParser, DOMSerializer } from 'prosemirror-model';
export { Schema } from 'prosemirror-model';
import OrderedMap from 'orderedmap';
import { MessageRef, intl, setGlobalValues, translate } from '@co.mmons/js-intl';
import { TextSelection, NodeSelection, EditorState } from 'prosemirror-state';
import { findParentNode, findParentNodeOfType, findPositionOfNodeBefore, hasParentNodeOfType } from 'prosemirror-utils';
import { defineIonxLinkEditor, showLinkEditor, loadIonxLinkEditorIntl } from 'ionx/LinkEditor';
import { deepEqual, shallowEqual } from 'fast-equals';
import { GapCursor } from 'prosemirror-gapcursor';
import { ReplaceAroundStep, liftTarget } from 'prosemirror-transform';
import { undo, redo, history, undoDepth, redoDepth } from 'prosemirror-history';
import { undoInputRule } from 'prosemirror-inputrules';
import { waitTill, Enum } from '@co.mmons/js-utils/core';
import { keymap } from 'prosemirror-keymap';
import { EditorView } from 'prosemirror-view';
import { popoverController, isPlatform, createAnimation } from '@ionic/core';
import { addEventListener } from 'ionx/utils';

class MarkSpecExtended {
}

class AlignmentMark extends MarkSpecExtended {
  constructor() {
    super(...arguments);
    this.name = "alignment";
    this.excludes = this.name;
    this.group = "alignment";
    this.attrs = { align: {} };
    this.parseDOM = [
      {
        tag: "div[data-align]",
        getAttrs: dom => {
          const align = dom.getAttribute("data-align");
          return align ? { align } : false;
        }
      }
    ];
  }
  toDOM(mark) {
    return [
      "div",
      {
        style: `text-align: ${mark.attrs.align}`,
        "data-align": mark.attrs.align,
      },
      0
    ];
  }
}

class NodeSpecExtended {
  allowMark(mark) {
    const marks = new Set(this.marks ? this.marks.split(" ") : []);
    if (mark instanceof MarkSpecExtended) {
      mark = mark.name;
    }
    marks.add(mark);
    this.marks = [...marks.values()].join(" ");
  }
  allowContent(node) {
    const content = new Set(this.content ? this.content.split(" ") : []);
    if (node instanceof NodeSpecExtended) {
      node = node.name;
    }
    content.add(node);
    this.content = [...content.values()].join(" ");
  }
}

const blockquote = "blockquote";
const blockquoteDOM = [blockquote, 0];
class BlockquoteNode extends NodeSpecExtended {
  constructor() {
    super(...arguments);
    this.name = blockquote;
    this.content = "block+";
    this.group = "block";
    this.defining = true;
    this.parseDOM = [{ tag: blockquote }];
  }
  toDOM() {
    return blockquoteDOM;
  }
}

const ul = "ul";
const domSpec$1 = [ul, 0];
class BulletListNode extends NodeSpecExtended {
  constructor() {
    super(...arguments);
    this.name = "bulletList";
    this.content = "listItem+";
    this.group = "block";
    this.parseDOM = [{ tag: ul }];
  }
  toDOM() {
    return domSpec$1;
  }
}

class DocNode extends NodeSpecExtended {
  constructor() {
    super(...arguments);
    this.name = "doc";
    this.content = "block+";
  }
  setContent(content) {
    this.content = typeof content === "string" ? content : content.join(" ");
    return this;
  }
  configure(schema) {
    for (const mark of ["alignment"]) {
      if (schema.marks.get(mark)) {
        this.allowMark(mark);
      }
    }
  }
}

const em = "em";
const emDOM = [em, 0];
class EmphasisMark extends MarkSpecExtended {
  constructor() {
    super(...arguments);
    this.name = "emphasis";
    this.group = "textFormat";
    this.parseDOM = [
      { tag: "i" },
      { tag: em },
      { style: "font-style=italic" }
    ];
  }
  toDOM() {
    return emDOM;
  }
  keymap(schema) {
    const cmd = toggleMark(schema.marks[this.name]);
    return {
      "Mod-i": cmd,
      "Mod-I": cmd
    };
  }
}

class FontSizeMark extends MarkSpecExtended {
  constructor() {
    super(...arguments);
    this.name = "fontSize";
    this.group = "textFormat";
    this.attrs = { fontSize: {} };
    this.parseDOM = [
      {
        style: "font-size",
        getAttrs: fontSize => {
          return { fontSize };
        }
      }
    ];
  }
  toDOM(mark) {
    return ["span", { style: `font-size: ${mark.attrs.fontSize}` }, 0];
  }
}

const isApple = typeof navigator !== "undefined" ? /Mac|iP(hone|[oa]d)/.test(navigator.platform) :
  (typeof window["os"] !== "undefined" ? window["os"].platform() === "darwin" : false);

const br = "br";
const brDOM = [br];
class HardBreakNode extends NodeSpecExtended {
  constructor() {
    super(...arguments);
    this.name = "hardBreak";
    this.inline = true;
    this.group = "inline";
    this.selectable = false;
    this.parseDOM = [{ tag: br }];
  }
  toDOM() {
    return brDOM;
  }
  keymap(schema) {
    const node = schema.nodes[this.name];
    const cmd = (state, dispatch) => {
      dispatch(state.tr.replaceSelectionWith(node.create()).scrollIntoView());
      return true;
    };
    return {
      "Mod-Enter": cmd,
      "Shift-Enter": cmd,
      ...(isApple ? { "Ctrl-Enter": cmd } : {})
    };
  }
}

class HeadingNode extends NodeSpecExtended {
  constructor() {
    super(...arguments);
    this.name = "heading";
    this.attrs = {
      level: { default: 1 },
      indent: { default: null }
    };
    this.content = "inline*";
    this.group = "block";
    this.defining = true;
    this.parseDOM = [
      { tag: "h1", getAttrs: this.getAttrs },
      { tag: "h2", getAttrs: this.getAttrs },
      { tag: "h3", getAttrs: this.getAttrs },
      { tag: "h4", getAttrs: this.getAttrs },
      { tag: "h5", getAttrs: this.getAttrs },
      { tag: "h6", getAttrs: this.getAttrs }
    ];
  }
  getAttrs(node) {
    const level = parseInt(node.tagName.substring(1));
    const indent = node.style.textIndent || null;
    return { level, indent: indent && !indent.startsWith("0") ? indent : null };
  }
  toDOM(node) {
    const { indent } = node.attrs;
    const attrs = {};
    const style = [];
    if (indent) {
      style.push(`text-indent: ${indent}`);
    }
    if (style.length) {
      attrs["style"] = style.join(";");
    }
    return [`h${node.attrs.level}`, attrs, 0];
  }
}

const hr = "hr";
const hrDOM = [hr];
class HorizontalRuleNode extends NodeSpecExtended {
  constructor() {
    super(...arguments);
    this.name = "horizontalRule";
    this.group = "block";
    this.parseDOM = [{ tag: hr }];
  }
  toDOM() {
    return hrDOM;
  }
}

class LinkMark extends MarkSpecExtended {
  constructor(options) {
    super();
    this.name = "link";
    this.attrs = {
      href: {},
      target: { default: null },
      title: { default: null }
    };
    this.inclusive = false;
    this.parseDOM = [
      {
        tag: "a[href]",
        getAttrs(dom) {
          if (dom instanceof HTMLElement) {
            return {
              href: dom.getAttribute("href"),
              target: dom.getAttribute("target"),
              title: dom.getAttribute("title")
            };
          }
        }
      }
    ];
    this.schemes = options?.schemes;
  }
  toDOM(node) {
    const { href, title, target } = node.attrs;
    return ["a", { href, title, target }, 0];
  }
}

const liDOM = ["li", 0];
class ListItemNode extends NodeSpecExtended {
  constructor() {
    super(...arguments);
    this.name = "listItem";
    this.content = "block*";
    this.parseDOM = [{ tag: "li" }];
  }
  toDOM() {
    return liDOM;
  }
  keymap(schema) {
    return { "Enter": splitListItem(schema.nodes[this.name]) };
  }
  configure(schema) {
    for (const mark of ["alignment"]) {
      if (schema.marks.get(mark)) {
        this.allowMark(mark);
      }
    }
    for (const node of ["paragraph"]) {
      if (schema.nodes[node]) {
        this.allowContent(node);
      }
    }
  }
}

const olDOM = ["ol", 0];
class OrderedListNode extends NodeSpecExtended {
  constructor() {
    super(...arguments);
    this.name = "orderedList";
    this.content = "listItem+";
    this.group = "block";
    this.attrs = { order: { default: 1 } };
    this.parseDOM = [
      {
        tag: "ol",
        getAttrs(dom) {
          return { order: dom.hasAttribute("start") ? +dom.getAttribute("start") : 1 };
        }
      }
    ];
  }
  toDOM(node) {
    return node.attrs.order == 1 ? olDOM : ["ol", { start: node.attrs.order }, 0];
  }
}

function isMarkFromGroup(mark, groupName) {
  if (mark instanceof MarkType) {
    mark = mark.spec;
  }
  return mark.group && mark.group.split(" ").includes(groupName);
}

class ParagraphNode extends NodeSpecExtended {
  constructor() {
    super(...arguments);
    this.name = "paragraph";
    this.attrs = {
      indent: { default: null }
    };
    this.content = "inline*";
    this.group = "block";
    this.parseDOM = [{
        tag: "p",
        getAttrs(node) {
          const indent = node.style.textIndent || null;
          return { indent: indent && !indent.startsWith("0") ? indent : null };
        }
      }];
  }
  toDOM(node) {
    const { indent } = node.attrs;
    const attrs = {};
    const style = [];
    if (indent) {
      style.push(`text-indent: ${indent}`);
    }
    if (style.length) {
      attrs["style"] = style.join(";");
    }
    return ["p", attrs, 0];
  }
  configure(schema) {
    schema.marks.forEach((_markName, mark) => {
      if (isMarkFromGroup(mark, "textFormat") || ["link"].includes(mark.name)) {
        this.allowMark(mark);
      }
    });
  }
}

class StrikethroughMark extends MarkSpecExtended {
  constructor() {
    super(...arguments);
    this.name = "strikethrough";
    this.group = "textFormat";
    this.parseDOM = [
      { tag: "s" },
      { style: "text-decoration=line-through" },
      { style: "text-decoration-line=line-through" }
    ];
  }
  toDOM() {
    return ["s", 0];
  }
}

const strong = "strong";
const domSpec = [strong, 0];
class StrongMark extends MarkSpecExtended {
  constructor() {
    super(...arguments);
    this.name = strong;
    this.group = "textFormat";
    this.parseDOM = [
      { tag: strong },
      // This works around a Google Docs misbehavior where
      // pasted content will be inexplicably wrapped in `<b>`
      // tags with a font-weight normal.
      { tag: "b", getAttrs: node => node.style.fontWeight != "normal" && null },
      { style: "font-weight", getAttrs: value => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null }
    ];
  }
  toDOM() {
    return domSpec;
  }
  keymap(schema) {
    const cmd = toggleMark(schema.marks[this.name]);
    return {
      "Mod-b": cmd,
      "Mod-B": cmd
    };
  }
}

class SubscriptMark extends MarkSpecExtended {
  constructor() {
    super(...arguments);
    this.name = "subscript";
    this.group = "textFormat";
    this.excludes = "superscript";
    this.parseDOM = [
      { tag: "sub" }
    ];
  }
  toDOM() {
    return ["sub", 0];
  }
}

class SuperscriptMark extends MarkSpecExtended {
  constructor() {
    super(...arguments);
    this.name = "superscript";
    this.group = "textFormat";
    this.excludes = "subscript";
    this.parseDOM = [
      { tag: "sup" }
    ];
  }
  toDOM() {
    return ["sup", 0];
  }
}

class TextBackgroundColorMark extends MarkSpecExtended {
  constructor() {
    super(...arguments);
    this.name = "textBackgroundColor";
    this.group = "textFormat";
    this.attrs = {
      color: {},
    };
    this.parseDOM = [
      {
        style: "background-color",
        getAttrs: color => {
          return { color };
        }
      }
    ];
  }
  toDOM(mark) {
    return [
      "span",
      { style: `background-color: ${mark.attrs.color}` },
      0
    ];
  }
}

class TextForegroundColorMark extends MarkSpecExtended {
  constructor() {
    super(...arguments);
    this.name = "textForegroundColor";
    this.group = "textFormat";
    this.attrs = {
      color: {},
    };
    this.parseDOM = [
      {
        style: "color",
        getAttrs: color => {
          return { color };
        }
      }
    ];
  }
  toDOM(mark) {
    return [
      "span",
      { style: `color: ${mark.attrs.color}` },
      0
    ];
  }
}

class TextNode extends NodeSpecExtended {
  constructor() {
    super(...arguments);
    this.name = "text";
    this.group = "inline";
  }
}

class UnderlineMark extends MarkSpecExtended {
  constructor() {
    super(...arguments);
    this.name = "underline";
    this.group = "textFormat";
    this.parseDOM = [
      { tag: "u" },
      { style: "text-decoration=underline" }
    ];
  }
  toDOM() {
    return ["u", 0];
  }
  keymap(schema) {
    const cmd = toggleMark(schema.marks[this.name]);
    return {
      "Mod-u": cmd,
      "Mod-U": cmd
    };
  }
}

function buildSchemaWithOptions(options, ...specs) {
  let marks = OrderedMap.from({});
  let nodes = OrderedMap.from({});
  for (let spec of specs) {
    if (!(spec instanceof NodeSpecExtended || spec instanceof MarkSpecExtended)) {
      spec = new spec();
    }
    if (spec instanceof NodeSpecExtended) {
      nodes = nodes.addToEnd(spec.name, spec);
    }
    else if (spec instanceof MarkSpecExtended) {
      marks = marks.addToEnd(spec.name, spec);
    }
  }
  if ((!options.topNode || options.topNode === "doc") && !nodes.get("doc")) {
    nodes = nodes.addToStart("doc", new DocNode());
  }
  if (!nodes.get("text")) {
    nodes = nodes.addToStart("text", new TextNode());
  }
  const spec = { marks, nodes, topNode: options.topNode };
  nodes.forEach((_name, node) => {
    node.configure?.(spec);
  });
  marks.forEach((_name, mark) => {
    mark.configure?.(spec);
  });
  return new Schema(spec);
}

function buildSchema(...specs) {
  return buildSchemaWithOptions({}, ...specs);
}

function isBlockMarkActive(state, type) {
  const { from, $from, to, empty } = state.selection;
  if (empty) {
    for (const mark of $from.parent.marks) {
      if (mark.type === type) {
        return true;
      }
    }
  }
  else {
    return state.doc.rangeHasMark(from, to, type);
  }
}

class ToolbarItem {
}

class AlignmentToolbarItem extends ToolbarItem {
  constructor() {
    super(...arguments);
    this.label = new MessageRef("ionx/HtmlEditor", "Alignment");
    this.menuComponent = "ionx-html-editor-alignment-menu";
  }
  isVisible(view) {
    return !!view.state.schema.marks.alignment;
  }
  isActive(view) {
    return isBlockMarkActive(view.state, view.state.schema.marks.alignment);
  }
}

class InsertMenuToolbarItem extends ToolbarItem {
  constructor(...items) {
    super();
    this.label = new MessageRef("ionx/HtmlEditor", "Insert");
    this.menuComponent = "ionx-html-editor-insert-menu";
    this.items = items;
  }
  menuComponentProps(view) {
    const items = [];
    for (let item of this.items) {
      if (typeof item === "function") {
        const itms = item(view);
        if (Array.isArray(itms)) {
          for (const i of itms) {
            if (i) {
              items.push(i);
            }
          }
        }
        else if (itms) {
          items.push(itms);
        }
      }
      else if (item) {
        items.push(item);
      }
    }
    return { items };
  }
}

function isMarkActive(state, type) {
  const { from, $from, to, empty } = state.selection;
  if (empty) {
    return !!(type.isInSet(state.storedMarks || $from.marks()));
  }
  else {
    return state.doc.rangeHasMark(from, to, type);
  }
}
function anyMarkActive(state, types) {
  const { from, $from, to, empty } = state.selection;
  if (empty) {
    for (const type of types) {
      if (type.isInSet(state.storedMarks || $from.marks())) {
        return true;
      }
    }
  }
  else {
    for (const type of types) {
      if (state.doc.rangeHasMark(from, to, type)) {
        return true;
      }
    }
  }
  return false;
}

class LinkMenuToolbarItem extends ToolbarItem {
  constructor() {
    super(...arguments);
    this.label = new MessageRef("ionx/LinkEditor", "Link");
    this.menuComponent = "ionx-html-editor-link-menu";
  }
  isActive() {
    return true;
  }
  isVisible(view) {
    const { marks } = view.state.schema;
    return marks.link && isMarkActive(view.state, marks.link);
  }
}

class ListMenuToolbarItem extends ToolbarItem {
  constructor() {
    super(...arguments);
    this.label = new MessageRef("ionx/HtmlEditor", "listMenu/List");
    this.menuComponent = "ionx-html-editor-list-menu";
  }
  isVisible(view) {
    const { schema, selection } = view.state;
    const { nodes } = schema;
    return (nodes.orderedList || nodes.bulletList) && !!findParentNode(predicate => predicate.hasMarkup(nodes.orderedList) || predicate.hasMarkup(nodes.bulletList))(selection);
  }
  isActive() {
    return true;
  }
}

class ParagraphMenuToolbarItem extends ToolbarItem {
  constructor() {
    super(...arguments);
    this.label = new MessageRef("ionx/HtmlEditor", "Paragraph");
    this.menuComponent = "ionx-html-editor-paragraph-menu";
  }
  isVisible(view) {
    const { nodes } = view.state.schema;
    return !!nodes.heading || !!nodes.paragraph;
  }
  isActive(view) {
    const { selection, schema } = view.state;
    return !!findParentNodeOfType(schema.nodes.heading)(selection);
  }
}

const iconsPath = "/assets/ionx.HtmlEditor/icons";

class TextToolbarItem extends ToolbarItem {
  constructor(markName) {
    super();
    this.markName = markName;
    this.labelVisible = false;
  }
  isVisible(view) {
    return !!view.state.schema.marks[this.markName];
  }
  isActive(view) {
    return isMarkActive(view.state, view.state.schema.marks[this.markName]);
  }
  handler(view) {
    const { marks } = view.state.schema;
    const command = toggleMark(marks[this.markName]);
    if (command(view.state)) {
      command(view.state, t => view.dispatch(t));
    }
  }
}

class TextEmphasisToolbarItem extends TextToolbarItem {
  constructor() {
    super("emphasis");
    this.label = new MessageRef("ionx/HtmlEditor", "Italic|text");
    this.iconSrc = `${iconsPath}/italic.svg`;
  }
}

class TextStrikethroughToolbarItem extends TextToolbarItem {
  constructor() {
    super("strikethrough");
    this.label = new MessageRef("ionx/HtmlEditor", "Strikethrough|text");
    this.iconSrc = `${iconsPath}/strikethrough.svg`;
  }
}

class TextStrongToolbarItem extends TextToolbarItem {
  constructor() {
    super("strong");
    this.label = new MessageRef("ionx/HtmlEditor", "Bold|text");
    this.iconSrc = `${iconsPath}/bold.svg`;
  }
}

class TextSubscriptToolbarItem extends TextToolbarItem {
  constructor() {
    super("subscript");
    this.label = new MessageRef("ionx/HtmlEditor", "Subscript|text");
    this.iconSrc = `${iconsPath}/subscript.svg`;
  }
}

class TextSuperscriptToolbarItem extends TextToolbarItem {
  constructor() {
    super("superscript");
    this.label = new MessageRef("ionx/HtmlEditor", "Superscript|text");
    this.iconSrc = `${iconsPath}/superscript.svg`;
  }
}

class TextMenuToolbarItem extends ToolbarItem {
  constructor() {
    super(...arguments);
    this.label = new MessageRef("ionx/HtmlEditor", "Text");
    this.menuComponent = "ionx-html-editor-text-menu";
  }
  isActive(view) {
    return anyMarkActive(view.state, Object.values(view.state.schema.marks).filter(mark => isMarkFromGroup(mark, "textFormat")));
  }
}

class TextUnderlineToolbarItem extends TextToolbarItem {
  constructor() {
    super("underline");
    this.label = new MessageRef("ionx/HtmlEditor", "Underline|text");
    this.iconSrc = `${iconsPath}/underline.svg`;
  }
}

function findMarks(doc, from, to, markType, attrs) {
  const marks = [];
  doc.nodesBetween(from, to, node => {
    for (let i = 0; i < node.marks.length; i++) {
      if (node.marks[i].type === markType && (!attrs || deepEqual(node.marks[i].attrs, attrs))) {
        marks.push(node.marks[i]);
      }
    }
  });
  return marks;
}

function findMarksInSelection(state, markType, attrs) {
  const doc = state.doc;
  const { from, to } = state.selection;
  return findMarks(doc, from, to, markType, attrs);
}

defineIonxLinkEditor();
const InsertLinkMenuItem = (view) => {
  const { schema, selection } = view.state;
  const linkMark = schema.marks.link;
  if (!linkMark) {
    return;
  }
  return {
    iconName: "link-outline",
    disabled: selection.empty,
    label: new MessageRef("ionx/LinkEditor", "Link"),
    sublabel: selection.empty ? new MessageRef("ionx/HtmlEditor", "selectTextToInsertLink") : undefined,
    handler: async () => {
      const markSpec = linkMark.spec;
      let href;
      let target;
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
      const link = await showLinkEditor({ value: href ? { href, target } : undefined, schemes });
      if (link) {
        toggleMark(linkMark, link)(view.state, view.dispatch);
      }
    }
  };
};

const filter = (predicates, cmd) => {
  return function (state, dispatch, view) {
    if (!Array.isArray(predicates)) {
      predicates = [predicates];
    }
    if (predicates.some(pred => !pred(state, view))) {
      return false;
    }
    return cmd(state, dispatch, view) || false;
  };
};

const isEmptySelectionAtStart = (state) => {
  const { empty, $from } = state.selection;
  return (empty &&
    ($from.parentOffset === 0 || state.selection instanceof GapCursor));
};

const isFirstChildOfParent = (state) => {
  const { $from } = state.selection;
  return $from.depth > 1
    ? (state.selection instanceof GapCursor &&
      $from.parentOffset === 0) ||
      $from.index($from.depth - 1) === 0
    : true;
};

function liftListItem(state, selection, tr) {
  const { $from, $to } = selection;
  const nodeType = state.schema.nodes.listItem;
  let range = $from.blockRange($to, node => !!node.childCount &&
    !!node.firstChild &&
    node.firstChild.type === nodeType);
  if (!range ||
    range.depth < 2 ||
    $from.node(range.depth - 1).type !== nodeType) {
    return tr;
  }
  const end = range.end;
  const endOfList = $to.end(range.depth);
  if (end < endOfList) {
    tr.step(new ReplaceAroundStep(end - 1, endOfList, end, endOfList, new Slice(Fragment.from(nodeType.create(undefined, range.parent.copy())), 1, 0), 1, true));
    range = new NodeRange(tr.doc.resolve($from.pos), tr.doc.resolve(endOfList), range.depth);
  }
  return tr.lift(range, liftTarget(range)).scrollIntoView();
}
function liftFollowingList(state, from, to, rootListDepth, tr) {
  const { listItem } = state.schema.nodes;
  let lifted = false;
  tr.doc.nodesBetween(from, to, (node, pos) => {
    if (!lifted && node.type === listItem && pos > from) {
      lifted = true;
      let listDepth = rootListDepth + 3;
      while (listDepth > rootListDepth + 2) {
        const start = tr.doc.resolve(tr.mapping.map(pos));
        listDepth = start.depth;
        const end = tr.doc.resolve(tr.mapping.map(pos + node.textContent.length));
        const sel = new TextSelection(start, end);
        tr = liftListItem(state, sel, tr);
      }
    }
  });
  return tr;
}

// This will return (depth - 1) for root list parent of a list.
const getListLiftTarget = (schema, resPos) => {
  let target = resPos.depth;
  const { bulletList, orderedList, listItem } = schema.nodes;
  for (let i = resPos.depth; i > 0; i--) {
    const node = resPos.node(i);
    if (node.type === bulletList || node.type === orderedList) {
      target = i;
    }
    if (node.type !== bulletList &&
      node.type !== orderedList &&
      node.type !== listItem) {
      break;
    }
  }
  return target - 1;
};

// The function will list paragraphs in selection out to level 1 below root list.
function liftSelectionList(state, tr) {
  const { from, to } = state.selection;
  const { paragraph } = state.schema.nodes;
  const listCol = [];
  tr.doc.nodesBetween(from, to, (node, pos) => {
    if (node.type === paragraph) {
      listCol.push({ node, pos });
    }
  });
  for (let i = listCol.length - 1; i >= 0; i--) {
    const paragraph = listCol[i];
    const start = tr.doc.resolve(tr.mapping.map(paragraph.pos));
    if (start.depth > 0) {
      let end;
      if (paragraph.node.textContent && paragraph.node.textContent.length > 0) {
        end = tr.doc.resolve(tr.mapping.map(paragraph.pos + paragraph.node.textContent.length));
      }
      else {
        end = tr.doc.resolve(tr.mapping.map(paragraph.pos + 1));
      }
      const range = start.blockRange(end);
      if (range) {
        tr.lift(range, getListLiftTarget(state.schema, start));
      }
    }
  }
  return tr;
}

/**
 * Removes marks from nodes in the current selection that are not supported
 */
const sanitizeSelectionMarks = (state) => {
  let tr;
  const { $from, $to } = state.tr.selection;
  state.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
    node.marks.forEach(mark => {
      if (!node.type.allowsMarkType(mark.type)) {
        const filteredMarks = node.marks.filter(m => m.type !== mark.type);
        const position = pos > 0 ? pos - 1 : 0;
        tr = (tr || state.tr).setNodeMarkup(position, undefined, node.attrs, filteredMarks);
      }
    });
  });
  return tr;
};

/**
 * Step through block-nodes between $from and $to and returns false if a node is
 * found that isn"t of the specified type
 */
function isRangeOfType(doc, $from, $to, nodeType) {
  return (getAncestorNodesBetween(doc, $from, $to).filter(node => node.type !== nodeType).length === 0);
}
/**
 * Returns all top-level ancestor-nodes between $from and $to
 */
function getAncestorNodesBetween(doc, $from, $to) {
  const nodes = Array();
  const maxDepth = findAncestorPosition(doc, $from).depth;
  let current = doc.resolve($from.start(maxDepth));
  while (current.pos <= $to.start($to.depth)) {
    const depth = Math.min(current.depth, maxDepth);
    const node = current.node(depth);
    if (node) {
      nodes.push(node);
    }
    if (depth === 0) {
      break;
    }
    let next = doc.resolve(current.after(depth));
    if (next.start(depth) >= doc.nodeSize - 2) {
      break;
    }
    if (next.depth !== current.depth) {
      next = doc.resolve(next.pos + 2);
    }
    if (next.depth) {
      current = doc.resolve(next.start(next.depth));
    }
    else {
      current = doc.resolve(next.end(next.depth));
    }
  }
  return nodes;
}
/**
 * Traverse the document until an "ancestor" is found. Any nestable block can be an ancestor.
 */
function findAncestorPosition(doc, pos) {
  const nestableBlocks = ["blockquote", "bulletList", "orderedList"];
  if (pos.depth === 1) {
    return pos;
  }
  let node = pos.node(pos.depth);
  let newPos = pos;
  while (pos.depth >= 1) {
    pos = doc.resolve(pos.before(pos.depth));
    node = pos.node(pos.depth);
    if (node && nestableBlocks.indexOf(node.type.name) !== -1) {
      newPos = pos;
    }
  }
  return newPos;
}
/**
 * Compose 1 to n functions.
 * @param func first function
 * @param funcs additional functions
 */
function compose(func, ...funcs) {
  const allFuncs = [func, ...funcs];
  return function composed(raw) {
    return allFuncs.reduceRight((memo, func) => func(memo), raw);
  };
}

function findCutBefore($pos) {
  // parent is non-isolating, so we can look across this boundary
  if (!$pos.parent.type.spec.isolating) {
    // search up the tree from the pos"s *parent*
    for (let i = $pos.depth - 1; i >= 0; i--) {
      // starting from the inner most node"s parent, find out
      // if we"re not its first child
      if ($pos.index(i) > 0) {
        return $pos.doc.resolve($pos.before(i + 1));
      }
      if ($pos.node(i).type.spec.isolating) {
        break;
      }
    }
  }
  return null;
}

const maxIndentation = 5;
const deletePreviousEmptyListItem = (state, dispatch) => {
  const { $from } = state.selection;
  const { listItem } = state.schema.nodes;
  const $cut = findCutBefore($from);
  if (!$cut || !$cut.nodeBefore || !($cut.nodeBefore.type === listItem)) {
    return false;
  }
  const previousListItemEmpty = $cut.nodeBefore.childCount === 1 && $cut.nodeBefore.firstChild && $cut.nodeBefore.firstChild.nodeSize <= 2;
  if (previousListItemEmpty) {
    const { tr } = state;
    if (dispatch) {
      dispatch(tr
        .delete($cut.pos - $cut.nodeBefore.nodeSize, $from.pos)
        .scrollIntoView());
    }
    return true;
  }
  return false;
};
const joinToPreviousListItem = (state, dispatch) => {
  const { $from } = state.selection;
  const { paragraph, listItem, codeBlock, bulletList, orderedList, } = state.schema.nodes;
  const isGapCursorShown = state.selection instanceof GapCursor;
  const $cutPos = isGapCursorShown ? state.doc.resolve($from.pos + 1) : $from;
  const $cut = findCutBefore($cutPos);
  if (!$cut) {
    return false;
  }
  // see if the containing node is a list
  if ($cut.nodeBefore &&
    [bulletList, orderedList].indexOf($cut.nodeBefore.type) > -1) {
    // and the node after this is a paragraph or a codeBlock
    if ($cut.nodeAfter &&
      ($cut.nodeAfter.type === paragraph || $cut.nodeAfter.type === codeBlock)) {
      // find the nearest paragraph that precedes this node
      let $lastNode = $cut.doc.resolve($cut.pos - 1);
      while ($lastNode.parent.type !== paragraph) {
        $lastNode = state.doc.resolve($lastNode.pos - 1);
      }
      let { tr } = state;
      if (isGapCursorShown) {
        const nodeBeforePos = findPositionOfNodeBefore(tr.selection);
        if (typeof nodeBeforePos !== "number") {
          return false;
        }
        // append the codeblock to the list node
        const list = $cut.nodeBefore.copy($cut.nodeBefore.content.append(Fragment.from(listItem.createChecked({}, $cut.nodeAfter))));
        tr.replaceWith(nodeBeforePos, $from.pos + $cut.nodeAfter.nodeSize, list);
      }
      else {
        // take the text content of the paragraph and insert after the paragraph up until before the the cut
        tr = state.tr.step(new ReplaceAroundStep($lastNode.pos, $cut.pos + $cut.nodeAfter.nodeSize, $cut.pos + 1, $cut.pos + $cut.nodeAfter.nodeSize - 1, state.tr.doc.slice($lastNode.pos, $cut.pos), 0, true));
      }
      // find out if there"s now another list following and join them
      // as in, [list, p, list] => [list with p, list], and we want [joined list]
      const $postCut = tr.doc.resolve(tr.mapping.map($cut.pos + $cut.nodeAfter.nodeSize));
      if ($postCut.nodeBefore &&
        $postCut.nodeAfter &&
        $postCut.nodeBefore.type === $postCut.nodeAfter.type &&
        [bulletList, orderedList].indexOf($postCut.nodeBefore.type) > -1) {
        tr = tr.join($postCut.pos);
      }
      if (dispatch) {
        dispatch(tr.scrollIntoView());
      }
      return true;
    }
  }
  return false;
};
const isInsideListItem = (state) => {
  const { $from } = state.selection;
  const { listItem, paragraph } = state.schema.nodes;
  if (state.selection instanceof GapCursor) {
    return $from.parent.type === listItem;
  }
  return (hasParentNodeOfType(listItem)(state.selection) &&
    $from.parent.type === paragraph);
};
const canToJoinToPreviousListItem = (state) => {
  const { $from } = state.selection;
  const { bulletList, orderedList } = state.schema.nodes;
  const $before = state.doc.resolve($from.pos - 1);
  let nodeBefore = $before ? $before.nodeBefore : null;
  if (state.selection instanceof GapCursor) {
    nodeBefore = $from.nodeBefore;
  }
  return (!!nodeBefore && [bulletList, orderedList].indexOf(nodeBefore.type) > -1);
};
const canOutdent = (state) => {
  const { parent } = state.selection.$from;
  const { listItem, paragraph } = state.schema.nodes;
  if (state.selection instanceof GapCursor) {
    return parent.type === listItem;
  }
  return (parent.type === paragraph && hasParentNodeOfType(listItem)(state.selection));
};
baseCommand.chainCommands(
// if we"re at the start of a list item, we need to either backspace
// directly to an empty list item above, or outdent this node
filter([
  isEmptySelectionAtStart,
  // list items might have multiple paragraphs; only do this at the first one
  isFirstChildOfParent,
  canOutdent,
], baseCommand.chainCommands(deletePreviousEmptyListItem, outdentList())), 
// if we"re just inside a paragraph node (or gapcursor is shown) and backspace, then try to join
// the text to the previous list item, if one exists
filter([isEmptySelectionAtStart, canToJoinToPreviousListItem], joinToPreviousListItem));
/**
 * Merge closest bullet list blocks into one
 */
function mergeLists(listItem, range) {
  return (command) => {
    return (state, dispatch) => command(state, tr => {
      /* we now need to handle the case that we lifted a sublist out,
       * and any listItems at the current level get shifted out to
       * their own new list; e.g.:
       *
       * unorderedList
       *  listItem(A)
       *  listItem
       *    unorderedList
       *      listItem(B)
       *  listItem(C)
       *
       * becomes, after unindenting the first, top level listItem, A:
       *
       * content of A
       * unorderedList
       *  listItem(B)
       * unorderedList
       *  listItem(C)
       *
       * so, we try to merge these two lists if they"re of the same type, to give:
       *
       * content of A
       * unorderedList
       *  listItem(B)
       *  listItem(C)
       */
      const $start = state.doc.resolve(range.start);
      const $end = state.doc.resolve(range.end);
      const $join = tr.doc.resolve(tr.mapping.map(range.end - 1));
      if ($join.nodeBefore &&
        $join.nodeAfter &&
        $join.nodeBefore.type === $join.nodeAfter.type) {
        if ($end.nodeAfter &&
          $end.nodeAfter.type === listItem &&
          $end.parent.type === $start.parent.type) {
          tr.join($join.pos);
        }
      }
      if (dispatch) {
        dispatch(tr.scrollIntoView());
      }
    });
  };
}
function outdentList() {
  return function (state, dispatch) {
    const { listItem } = state.schema.nodes;
    const { $from, $to } = state.selection;
    if (isInsideListItem(state)) {
      // if we"re backspacing at the start of a list item, unindent it
      // take the the range of nodes we might be lifting
      // the predicate is for when you"re backspacing a top level list item:
      // we don"t want to go up past the doc node, otherwise the range
      // to clear will include everything
      const range = $from.blockRange($to, node => node.childCount > 0 && node.firstChild && node.firstChild.type === listItem);
      if (!range) {
        return false;
      }
      return compose(mergeLists(listItem, range), // 2. Check if I need to merge nearest list
      baseListCommand.liftListItem)(listItem)(state, dispatch);
    }
    return false;
  };
}
/**
 * Check if we can sink the list.
 *
 * @returns true if we can sink the list, false if we reach the max indentation level
 */
function canSink(initialIndentationLevel, state) {
  /*
      - Keep going forward in document until indentation of the node is < than the initial
      - If indentation is EVER > max indentation, return true and don"t sink the list
      */
  let currentIndentationLevel;
  let currentPos = state.tr.selection.$to.pos;
  do {
    const resolvedPos = state.doc.resolve(currentPos);
    currentIndentationLevel = numberNestedLists(resolvedPos, state.schema.nodes);
    if (currentIndentationLevel > maxIndentation) {
      // Cancel sink list.
      // If current indentation less than the initial, it won"t be
      // larger than the max, and the loop will terminate at end of this iteration
      return false;
    }
    currentPos++;
  } while (currentIndentationLevel >= initialIndentationLevel);
  return true;
}
function indentList() {
  return function (state, dispatch) {
    const { listItem } = state.schema.nodes;
    if (isInsideListItem(state)) {
      // Record initial list indentation
      const initialIndentationLevel = numberNestedLists(state.selection.$from, state.schema.nodes);
      if (canSink(initialIndentationLevel, state)) {
        compose(baseListCommand.sinkListItem)(listItem)(state, dispatch);
      }
      return true;
    }
    return false;
  };
}
function liftListItems() {
  return function (state, dispatch) {
    const { tr } = state;
    const { $from, $to } = state.selection;
    tr.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
      // Following condition will ensure that block types paragraph, heading, codeBlock, blockquote, panel are lifted.
      // isTextblock is true for paragraph, heading, codeBlock.
      if (node.isTextblock ||
        node.type.name === "blockquote" ||
        node.type.name === "panel") {
        const sel = new NodeSelection(tr.doc.resolve(tr.mapping.map(pos)));
        const range = sel.$from.blockRange(sel.$to);
        if (!range || sel.$from.parent.type !== state.schema.nodes.listItem) {
          return false;
        }
        const target = range && liftTarget(range);
        if (target === undefined || target === null) {
          return false;
        }
        tr.lift(range, target);
      }
      return;
    });
    if (dispatch) {
      dispatch(tr);
    }
    return true;
  };
}
/**
 * Sometimes a selection in the editor can be slightly offset, for example:
 * it"s possible for a selection to start or end at an empty node at the very end of
 * a line. This isn"t obvious by looking at the editor and it"s likely not what the
 * user intended - so we need to adjust the selection a bit in scenarios like that.
 */
function adjustSelectionInList(doc, selection) {
  const { $from, $to } = selection;
  const isSameLine = $from.pos === $to.pos;
  let startPos = $from.pos;
  const endPos = $to.pos;
  if (isSameLine && startPos === doc.nodeSize - 3) {
    // Line is empty, don"t do anything
    return selection;
  }
  // Selection started at the very beginning of a line and therefor points to the previous line.
  if ($from.nodeBefore && !isSameLine) {
    startPos++;
    let node = doc.nodeAt(startPos);
    while (!node || (node && !node.isText)) {
      startPos++;
      node = doc.nodeAt(startPos);
    }
  }
  if (endPos === startPos) {
    return new TextSelection(doc.resolve(startPos));
  }
  return new TextSelection(doc.resolve(startPos), doc.resolve(endPos));
}
// Get the depth of the nearest ancestor list
const rootListDepth = (pos, nodes) => {
  const { bulletList, orderedList, listItem } = nodes;
  let depth;
  for (let i = pos.depth - 1; i > 0; i--) {
    const node = pos.node(i);
    if (node.type === bulletList || node.type === orderedList) {
      depth = i;
    }
    if (node.type !== bulletList &&
      node.type !== orderedList &&
      node.type !== listItem) {
      break;
    }
  }
  return depth;
};
// Returns the number of nested lists that are ancestors of the given selection
const numberNestedLists = (resolvedPos, nodes) => {
  const { bulletList, orderedList } = nodes;
  let count = 0;
  for (let i = resolvedPos.depth - 1; i > 0; i--) {
    const node = resolvedPos.node(i);
    if (node.type === bulletList || node.type === orderedList) {
      count += 1;
    }
  }
  return count;
};
const toggleList = (state, dispatch, view, listType) => {
  const { selection } = state;
  const fromNode = selection.$from.node(selection.$from.depth - 2);
  const endNode = selection.$to.node(selection.$to.depth - 2);
  if (!fromNode ||
    fromNode.type.name !== listType ||
    (!endNode || endNode.type.name !== listType)) {
    return toggleListCommand(listType)(state, dispatch, view);
  }
  else {
    const depth = rootListDepth(selection.$to, state.schema.nodes);
    let tr = liftFollowingList(state, selection.$to.pos, selection.$to.end(depth), depth || 0, state.tr);
    tr = liftSelectionList(state, tr);
    dispatch(tr);
    return true;
  }
};
/**
 * Check of is selection is inside a list of the specified type
 */
function isInsideList(state, listType) {
  const { $from } = state.selection;
  const parent = $from.node(-2);
  const grandgrandParent = $from.node(-3);
  return ((parent && parent.type === state.schema.nodes[listType]) ||
    (grandgrandParent && grandgrandParent.type === state.schema.nodes[listType]));
}
function toggleListCommand(listType) {
  return function (state, dispatch, view) {
    if (dispatch) {
      dispatch(state.tr.setSelection(adjustSelectionInList(state.doc, state.selection)));
    }
    if (!view) {
      return false;
    }
    state = view.state;
    const { $from, $to } = state.selection;
    const isRangeOfSingleType = isRangeOfType(state.doc, $from, $to, state.schema.nodes[listType]);
    if (isInsideList(state, listType) && isRangeOfSingleType) {
      // Untoggles list
      return liftListItems()(state, dispatch);
    }
    else {
      // Converts list type e.g. bullet_list -> ordered_list if needed
      if (!isRangeOfSingleType) {
        liftListItems()(state, dispatch);
        state = view.state;
      }
      // Remove any invalid marks that are not supported
      const tr = sanitizeSelectionMarks(state);
      if (tr) {
        if (dispatch) {
          dispatch(tr);
        }
        state = view.state;
      }
      // Wraps selection in list
      return wrapInList(state.schema.nodes[listType])(state, dispatch);
    }
  };
}
function wrapInList(nodeType) {
  return baseCommand.autoJoin(baseListCommand.wrapInList(nodeType), (before, after) => before.type === after.type && before.type === nodeType);
}

const InsertListMenuItems = () => {
  return [
    {
      iconSrc: "/assets/ionx.HtmlEditor/icons/list-bulleted.svg",
      label: new MessageRef("ionx/HtmlEditor", "listMenu/Bulleted list"),
      handler(view) {
        const { state } = view;
        const { schema, selection } = state;
        if (!findParentNode(predicate => predicate.hasMarkup(schema.nodes.bulletList))(selection)) {
          toggleList(state, t => view.dispatch(t), view, "bulletList");
        }
      }
    },
    {
      iconSrc: "/assets/ionx.HtmlEditor/icons/list-numbered.svg",
      label: new MessageRef("ionx/HtmlEditor", "listMenu/Numbered list"),
      handler(view) {
        const { state } = view;
        const { schema, selection } = state;
        if (!findParentNode(predicate => predicate.hasMarkup(schema.nodes.orderedList))(selection)) {
          toggleList(state, t => view.dispatch(t), view, "orderedList");
        }
      }
    },
  ];
};

// :: Object
let backspace = chainCommands(deleteSelection, joinBackward, selectNodeBackward);
let del = chainCommands(deleteSelection, joinForward, selectNodeForward);
let pcBaseKeymap = {
  "Backspace": backspace,
  "Mod-Backspace": backspace,
  "Shift-Backspace": backspace,
  "Delete": del,
  "Mod-Delete": del,
  "Mod-a": selectAll,
  "Alt-ArrowUp": joinUp,
  "Alt-ArrowDown": joinDown,
  "Mod-BracketLeft": lift,
  "Escape": selectParentNode
};
// :: Object
// A copy of `pcBaseKeymap` that also binds **Ctrl-h** like Backspace,
// **Ctrl-d** like Delete, **Alt-Backspace** like Ctrl-Backspace, and
// **Ctrl-Alt-Backspace**, **Alt-Delete**, and **Alt-d** like
// Ctrl-Delete.
let macBaseKeymap = {
  "Ctrl-h": pcBaseKeymap["Backspace"],
  "Alt-Backspace": pcBaseKeymap["Mod-Backspace"],
  "Ctrl-d": pcBaseKeymap["Delete"],
  "Ctrl-Alt-Backspace": pcBaseKeymap["Mod-Delete"],
  "Alt-Delete": pcBaseKeymap["Mod-Delete"],
  "Alt-d": pcBaseKeymap["Mod-Delete"]
};
for (let key in pcBaseKeymap)
  macBaseKeymap[key] = pcBaseKeymap[key];
// :: Object
// Depending on the detected platform, this will hold
// [`pcBasekeymap`](#commands.pcBaseKeymap) or
// [`macBaseKeymap`](#commands.macBaseKeymap).
let baseKeymap = isApple ? macBaseKeymap : pcBaseKeymap;

const enterKeymap = {
  "Enter": chainCommands(newlineInCode, createParagraphNear, liftEmptyBlock, splitBlock),
  "Mod-Enter": exitCode
};

const undoRedoKeymap = {
  "Mod-z": undo,
  "Shift-Mod-z": redo,
  "Backspace": undoInputRule,
  ...(isApple ? { "Mod-y": redo } : {})
};

const HtmlEditor$1 = "ionx-html-editor";

let loaded = [];
async function importJson() {
  const locale = intl.locale;
  switch (locale) {case "cs": return (await import('./cs.js')).default;
case "da": return (await import('./da.js')).default;
case "de": return (await import('./de.js')).default;
case "en": return (await import('./en.js')).default;
case "fr": return (await import('./fr.js')).default;
case "hu": return (await import('./hu.js')).default;
case "nl": return (await import('./nl.js')).default;
case "pl": return (await import('./pl.js')).default;
case "ru": return (await import('./ru.js')).default;

  }
  return Promise.resolve({});
}
async function loadIntlMessages() {
  if (loaded.includes(intl.locale)) {
    return;
  }
  setGlobalValues("ionx/HtmlEditor", intl.locale, await importJson());
  loaded.push(intl.locale);
}

function findScrollParent(element) {
  if (!element) {
    return;
  }
  if (element.scrollHeight >= element.clientHeight) {
    const overflowY = window.getComputedStyle(element).overflowY;
    if (overflowY !== "visible" && overflowY !== "hidden") {
      return element;
    }
  }
  if (element.assignedSlot) {
    const p = findScrollParent(element.assignedSlot.parentElement);
    if (p) {
      return p;
    }
  }
  return findScrollParent(element.parentElement);
}

async function fixIonItemOverflow(editor) {
  const item = editor.closest("ion-item");
  if (item) {
    await waitTill(() => !!item.shadowRoot && !!item.shadowRoot.querySelector(".item-inner"));
    item.style.overflow = "initial";
    const style = document.createElement("style");
    style.innerHTML = `.item-native, .item-inner, .input-wrapper { overflow: initial !important; }`;
    item.shadowRoot.appendChild(style);
  }
}

function scrollIntoView(element, parent) {
  if (parent) {
    const parentRect = parent.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    if (!(rect.top > parentRect.top && rect.top <= parentRect.bottom && rect.bottom < parentRect.height)) {
      let top = element.offsetTop - 100;
      if (element.offsetParent) {
        let offsetParent = element.offsetParent;
        while (offsetParent !== parent && !!offsetParent) {
          top += offsetParent.offsetTop;
          offsetParent = offsetParent.offsetParent;
        }
      }
      parent.scrollTo({ top: top });
    }
    return;
  }
  element.scrollIntoView();
}

function caretTopPoint() {
  const selection = document.getSelection();
  const range0 = selection.getRangeAt(0);
  let rect;
  let range;
  // supposed to be textNode in most cases
  // but div[contenteditable] when empty
  const node = range0.startContainer;
  const offset = range0.startOffset;
  if (offset > 0) {
    // new range, don't influence DOM state
    range = document.createRange();
    range.setStart(node, (offset - 1));
    range.setEnd(node, offset);
    // https://developer.mozilla.org/en-US/docs/Web/API/range.getBoundingClientRect
    // IE9, Safari?(but look good in Safari 8)
    rect = range.getBoundingClientRect();
    return { left: rect["right"], top: rect.top };
  }
  else if (offset < node["length"]) {
    range = document.createRange();
    // similar but select next on letter
    range.setStart(node, offset);
    range.setEnd(node, (offset + 1));
    rect = range.getBoundingClientRect();
    return { left: rect.left, top: rect.top };
  }
  else {
    // textNode has length
    // https://developer.mozilla.org/en-US/docs/Web/API/Element.getBoundingClientRect
    rect = node.getBoundingClientRect();
    const styles = getComputedStyle(node);
    const lineHeight = parseInt(styles.lineHeight);
    const fontSize = parseInt(styles.fontSize);
    // roughly half the whitespace... but not exactly
    const delta = (lineHeight - fontSize) / 2;
    return { left: rect.left, top: (rect.top + delta) };
  }
}

function scrollToCaret(parent) {
  if (parent) {
    const parentRect = parent.getBoundingClientRect();
    const rect = caretTopPoint();
    rect.top -= 100;
    if (!(rect.top > parentRect.top && rect.top <= parentRect.bottom)) {
      let top = rect.top - parentRect.top;
      parent.scrollTo({ top: top, behavior: "auto" });
    }
    return;
  }
}

const htmlEditorCss = ".ProseMirror-gapcursor{display:none;pointer-events:none;position:absolute}.ProseMirror-gapcursor:after{content:\"\";display:block;position:absolute;top:-2px;width:20px;border-top:1px solid black;animation:ProseMirror-cursor-blink 1.1s steps(2, start) infinite}@keyframes ProseMirror-cursor-blink{to{visibility:hidden}}.ProseMirror-focused .ProseMirror-gapcursor{display:block}.ProseMirror{position:relative}.ProseMirror{word-wrap:break-word;white-space:pre-wrap;white-space:break-spaces;-webkit-font-variant-ligatures:none;font-variant-ligatures:none;font-feature-settings:\"liga\" 0;}.ProseMirror pre{white-space:pre-wrap}.ProseMirror li{position:relative}.ProseMirror-hideselection *::selection{background:transparent}.ProseMirror-hideselection *::-moz-selection{background:transparent}.ProseMirror-hideselection{caret-color:transparent}.ProseMirror-selectednode{outline:2px solid #8cf}li.ProseMirror-selectednode{outline:none}li.ProseMirror-selectednode:after{content:\"\";position:absolute;left:-32px;right:-2px;top:-2px;bottom:-2px;border:2px solid #8cf;pointer-events:none}img.ProseMirror-separator{display:inline !important;border:none !important;margin:0 !important}ionx-html-editor{display:block}ionx-html-editor app-template-string{display:inline-block;width:1em;height:0.8em;background:red}ionx-html-editor .ProseMirror-selectednode{outline:var(--html-editor-selected-node-outline, 1px solid var(--ion-color-primary))}ionx-html-editor>.ionx--prosemirror>.ProseMirror{outline:none;user-select:text}ionx-html-editor>.ionx--prosemirror>.ProseMirror[contenteditable=true]{min-height:60px;white-space:pre-wrap;word-wrap:break-word}ionx-html-editor>.ionx--prosemirror>.ProseMirror[contenteditable=true] .ionx--selected{border:4px solid var(--ion-color-primary)}ionx-html-editor>.ionx--prosemirror>.ProseMirror:not([contenteditable=true]) .ionx--interactive{display:none}ionx-html-editor>.ionx--prosemirror>.ProseMirror p{margin:16px 0 0 0}ionx-html-editor>.ionx--prosemirror>.ProseMirror h1{font-size:130%}ionx-html-editor>.ionx--prosemirror>.ProseMirror h2{font-size:125%}ionx-html-editor>.ionx--prosemirror>.ProseMirror h3{font-size:120%}ionx-html-editor>.ionx--prosemirror>.ProseMirror h4{font-size:115%}ionx-html-editor>.ionx--prosemirror>.ProseMirror h5{font-size:110%}ionx-html-editor>.ionx--prosemirror>.ProseMirror h6{font-size:105%}ionx-html-editor>.ionx--prosemirror>.ProseMirror h1,ionx-html-editor>.ionx--prosemirror>.ProseMirror h2,ionx-html-editor>.ionx--prosemirror>.ProseMirror h3,ionx-html-editor>.ionx--prosemirror>.ProseMirror h4,ionx-html-editor>.ionx--prosemirror>.ProseMirror h5,ionx-html-editor>.ionx--prosemirror>.ProseMirror h6{margin-top:16px;margin-bottom:8px}ionx-html-editor>.ionx--prosemirror>.ProseMirror p:first-child,ionx-html-editor>.ionx--prosemirror>.ProseMirror ul:first-child,ionx-html-editor>.ionx--prosemirror>.ProseMirror ol:first-child,ionx-html-editor>.ionx--prosemirror>.ProseMirror h1:first-child,ionx-html-editor>.ionx--prosemirror>.ProseMirror h2:first-child,ionx-html-editor>.ionx--prosemirror>.ProseMirror h3:first-child,ionx-html-editor>.ionx--prosemirror>.ProseMirror h4:first-child,ionx-html-editor>.ionx--prosemirror>.ProseMirror h5:first-child,ionx-html-editor>.ionx--prosemirror>.ProseMirror h6:first-child{margin-top:0}ionx-form-field [slot-container=default]>ionx-html-editor{margin:8px 16px}";

let HtmlEditor = class extends HTMLElement$1 {
  constructor() {
    super();
    this.__registerHost();
    this.editorSelectionChange = createEvent(this, "editorSelectionChange", 7);
    this.ionChange = createEvent(this, "ionChange", 7);
  }
  async getView() {
    return this.view;
  }
  async getState() {
    return this.view.state;
  }
  async getScheme() {
    return this.view.state.schema;
  }
  async setFocus() {
    if (!this.scrollParent) {
      this.scrollParent = findScrollParent(this.element);
    }
    this.view.dom.focus({ preventScroll: true });
    const pos = this.view.domAtPos(this.view.state.selection.to);
    if (pos.node) {
      if (pos.node.nodeType === Node.TEXT_NODE) {
        scrollToCaret(this.scrollParent);
      }
      else {
        scrollIntoView(this.view.dom.querySelector(".ionx--selected") || pos.node, this.scrollParent);
      }
    }
  }
  valueChanged(value, old) {
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
  applyProseMirrorStatus() {
    if (this.view) {
      const thiz = this;
      this.view.setProps({ editable: () => !thiz.readonly && !thiz.disabled });
    }
  }
  async initEditor() {
    const container = this.element.getElementsByClassName("ionx--prosemirror");
    await waitTill(() => container.length > 0, 1);
    const plugins = [
      ...Object.values(this.schema.nodes)
        .filter(node => node.spec instanceof NodeSpecExtended && node.spec.keymap)
        .map(node => keymap(node.spec.keymap(this.schema))),
      ...Object.values(this.schema.marks)
        .filter(mark => mark.spec instanceof MarkSpecExtended && mark.spec.keymap)
        .map(mark => keymap(mark.spec.keymap(this.schema))),
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
      nodeViews: Object.assign({}, ...Object.values(this.schema.nodes).filter(node => node.spec instanceof NodeSpecExtended && node.spec.render)
        .map(node => ({ [node.name]: node.spec.render.bind(node.spec) })), ...Object.values(this.schema.marks)
        .filter(mark => mark.spec instanceof MarkSpecExtended && mark.spec.render)
        .map(mark => mark.spec)
        .map(mark => ({ [mark.name]: mark.render.bind(mark) })))
    });
    this.applyProseMirrorStatus();
  }
  handleEditorScroll(view) {
    if (!this.scrollParent) {
      this.scrollParent = findScrollParent(this.element);
    }
    const pos = view.domAtPos(view.state.selection.to);
    if (pos.node) {
      if (pos.node.nodeType === Node.TEXT_NODE) {
        scrollToCaret(this.scrollParent);
      }
      else {
        scrollIntoView(view.dom.querySelector(".ionx--selected") || pos.node, this.scrollParent);
      }
    }
    return false;
  }
  editorDocument(html) {
    const node = document.createElement("div");
    node.innerHTML = html;
    // this.prepareInputValue(node);
    return DOMParser.fromSchema(this.schema).parse(node);
  }
  editorValue() {
    if (this.view) {
      const value = DOMSerializer.fromSchema(this.schema).serializeFragment(this.view.state.doc.content);
      const tmp = document.createElement("div");
      tmp.appendChild(value);
      if (!tmp.innerText) {
        return null;
      }
      else {
        return tmp.innerHTML; // this.prepareOutputValue(tmp);
      }
    }
    else {
      return this.value;
    }
  }
  onEditorTransaction(transaction) {
    this.view.dom.focus({ preventScroll: true });
    this.view.updateState(this.view.state.apply(transaction));
    // this.setFocus();
    this.editorSelectionChange.emit();
    if (transaction.docChanged) {
      const value = this.editorValue();
      if (this.value !== value) {
        this.valueChangedByProseMirror = true;
        this.value = value;
        this.ionChange.emit({ value });
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
    return h(Host, null, !this.readonly && h("ionx-html-editor-toolbar", { items: this.toolbarItems, historyDisabled: this.historyDisabled }), h("div", { class: "ionx--prosemirror" }));
  }
  static get assetsDirs() { return ["assets"]; }
  get element() { return this; }
  static get watchers() { return {
    "value": ["valueChanged"],
    "disabled": ["applyProseMirrorStatus"],
    "readonly": ["applyProseMirrorStatus"]
  }; }
  static get style() { return htmlEditorCss; }
};

/**
 * Toggles block mark based on the return type of `getAttrs`.
 * This is similar to ProseMirror"s `getAttrs` from `AttributeSpec`
 * return `false` to remove the mark.
 * return `undefined for no-op.
 * return an `object` to update the mark.
 */
const toggleBlockMark = (markType, getAttrs, allowedBlocks) => (state, dispatch) => {
  let markApplied = false;
  const tr = state.tr;
  const toggleBlockMarkOnRange = (from, to, tr) => {
    state.doc.nodesBetween(from, to, (node, pos, parent) => {
      if (!node.type.isBlock) {
        return false;
      }
      if ((!allowedBlocks || (Array.isArray(allowedBlocks) ? allowedBlocks.indexOf(node.type) > -1 : allowedBlocks(state.schema, node, parent))) &&
        parent.type.allowsMarkType(markType)) {
        const oldMarks = node.marks.filter(mark => mark.type === markType);
        const prevAttrs = oldMarks.length ? oldMarks[0].attrs : undefined;
        const newAttrs = getAttrs(prevAttrs, node);
        if (newAttrs !== undefined) {
          tr.setNodeMarkup(pos, node.type, node.attrs, node.marks
            .filter(mark => !markType.excludes(mark.type))
            .concat(newAttrs === false ? [] : markType.create(newAttrs)));
          markApplied = true;
        }
      }
      return;
    });
  };
  const { from, to } = state.selection;
  toggleBlockMarkOnRange(from, to, tr);
  if (markApplied && tr.docChanged) {
    if (dispatch) {
      dispatch(tr.scrollIntoView());
    }
    return true;
  }
  return false;
};

const changeAlignment = (align) => (state, dispatch) => {
  const { nodes: { paragraph, heading }, marks: { alignment } } = state.schema;
  return toggleBlockMark(alignment, () => (!align ? undefined : align === "left" ? false : { align }), [paragraph, heading])(state, dispatch);
};

function findBlockMarks(state, markType) {
  const marks = [];
  const { from, to } = state.selection;
  state.doc.nodesBetween(from, to, (node, _pos, _parent) => {
    if (!node.type.isBlock) {
      return false;
    }
    for (const mark of node.marks) {
      if (mark.type === markType) {
        marks.push(mark);
      }
    }
  });
  return marks;
}

class Alignment extends Enum {
  constructor(name) {
    super(name);
    this.name = name;
    this.label = new MessageRef("ionx/HtmlEditor", "alignmentMenu/" + name);
  }
  static values() {
    return super.values();
  }
  static valueOf(value) {
    return super.valueOf(value);
  }
  static fromJSON(value) {
    return super.fromJSON(value);
  }
}
Alignment.left = new Alignment("left");
Alignment.right = new Alignment("right");
Alignment.center = new Alignment("center");
Alignment.justify = new Alignment("justify");

const alignmentMenuCss = ":host{overflow:initial !important}:host ion-list{margin:0;padding:0}:host ion-list ion-item{--border-width:0 0 var(--ionx-border-width) 0;--inner-border-width:0;--inner-padding-start:0;--inner-padding-end:0;--padding-start:16px;--padding-end:16px}:host ion-list>ion-item.item:last-child,:host ion-list>*:last-child>ion-item.item:last-child{--border-width:0}:host ion-list ion-item>[slot=start]{margin-right:16px;margin-left:0px}:host ion-list ion-item.item ion-label{white-space:normal}:host ion-list ion-item.item ion-label small{display:block;line-height:1}:host ion-list ion-item-divider.item{--background:transparent;--color:rgb(var(--ion-text-color-rgb), .5);--padding-start:16px;--padding-end:16px;--padding-top:20px;--inner-border-width:0;--border-width:0;font-size:calc(var(--ionx-default-font-size, 16px) * 0.75);font-weight:500;border-bottom:var(--ionx-border-width) solid var(--ion-border-color);text-transform:uppercase;letter-spacing:1px}:host ion-list ion-icon[slot=start],:host ion-list ion-icon[slot=end]{font-size:1.2em}:host ion-list ion-icon[slot=start]{margin-right:8px}:host ion-list ion-icon[slot=end]{margin-right:0}";

let AlignmentMenu = class extends HTMLElement$1 {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  async toggleAlignment(alignment) {
    const view = await this.editor.getView();
    const command = changeAlignment(alignment.name);
    if (command(view.state)) {
      command(view.state, (tr) => view.dispatch(tr));
    }
    await popoverController.dismiss();
    view.focus();
  }
  connectedCallback() {
    this.active = undefined;
    this.editor.getView().then(view => {
      const { state } = view;
      const { marks } = state.schema;
      for (const mark of findBlockMarks(state, marks.alignment)) {
        // zaznaczonych wiele blocków z różnym wyrównaniem
        if (this.active && this.active !== mark.attrs.align) {
          this.active = undefined;
          break;
        }
        this.active = mark.attrs.align;
      }
    });
  }
  render() {
    return h("ion-list", { lines: "full" }, Alignment.values().map(alignment => h("ion-item", { button: true, detail: false, onClick: () => this.toggleAlignment(alignment) }, h("ion-label", null, intl.message(alignment.label)), this.active === alignment.name && h("ion-icon", { name: "checkmark", slot: "end" }), h("ion-icon", { src: `/assets/ionx.HtmlEditor/icons/align-${alignment.name}.svg`, slot: "start" }))));
  }
  static get style() { return alignmentMenuCss; }
};

const insertMenuCss = ":host{overflow:initial !important}:host ion-list{margin:0;padding:0}:host ion-list ion-item{--border-width:0 0 var(--ionx-border-width) 0;--inner-border-width:0;--inner-padding-start:0;--inner-padding-end:0;--padding-start:16px;--padding-end:16px}:host ion-list>ion-item.item:last-child,:host ion-list>*:last-child>ion-item.item:last-child{--border-width:0}:host ion-list ion-item>[slot=start]{margin-right:16px;margin-left:0px}:host ion-list ion-item.item ion-label{white-space:normal}:host ion-list ion-item.item ion-label small{display:block;line-height:1}:host ion-list ion-item-divider.item{--background:transparent;--color:rgb(var(--ion-text-color-rgb), .5);--padding-start:16px;--padding-end:16px;--padding-top:20px;--inner-border-width:0;--border-width:0;font-size:calc(var(--ionx-default-font-size, 16px) * 0.75);font-weight:500;border-bottom:var(--ionx-border-width) solid var(--ion-border-color);text-transform:uppercase;letter-spacing:1px}:host ion-list ion-icon[slot=start],:host ion-list ion-icon[slot=end]{font-size:1.2em}:host ion-list ion-icon[slot=start]{margin-right:8px}:host ion-list ion-icon[slot=end]{margin-right:0}";

let InsertMenu = class extends HTMLElement$1 {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  async handleItem(item) {
    popoverController.dismiss();
    const view = await this.editor.getView();
    const result = item.handler(view);
    if (result instanceof Promise) {
      await result;
    }
    view.focus();
  }
  render() {
    return h("ion-list", { lines: "full" }, this.items.map(item => h("ion-item", { button: true, disabled: item.disabled, detail: false, onClick: () => this.handleItem(item) }, (item.iconName || item.iconSrc) && h("ion-icon", { name: item.iconName, src: item.iconSrc, slot: "start" }), h("ion-label", null, h("div", null, item.label instanceof MessageRef ? translate(intl, item.label) : item.label), item.sublabel && h("small", null, item.sublabel instanceof MessageRef ? translate(intl, item.sublabel) : item.sublabel)))));
  }
  static get style() { return insertMenuCss; }
};

function findNodeStartEnd(doc, pos) {
  const $pos = doc.resolve(pos);
  const start = pos - $pos.textOffset;
  const end = start + $pos.parent.child($pos.index()).nodeSize;
  return { start, end };
}

const linkMenuCss = ":host{overflow:initial !important}:host ion-list{margin:0;padding:0}:host ion-list ion-item{--border-width:0 0 var(--ionx-border-width) 0;--inner-border-width:0;--inner-padding-start:0;--inner-padding-end:0;--padding-start:16px;--padding-end:16px}:host ion-list>ion-item.item:last-child,:host ion-list>*:last-child>ion-item.item:last-child{--border-width:0}:host ion-list ion-item>[slot=start]{margin-right:16px;margin-left:0px}:host ion-list ion-item.item ion-label{white-space:normal}:host ion-list ion-item.item ion-label small{display:block;line-height:1}:host ion-list ion-item-divider.item{--background:transparent;--color:rgb(var(--ion-text-color-rgb), .5);--padding-start:16px;--padding-end:16px;--padding-top:20px;--inner-border-width:0;--border-width:0;font-size:calc(var(--ionx-default-font-size, 16px) * 0.75);font-weight:500;border-bottom:var(--ionx-border-width) solid var(--ion-border-color);text-transform:uppercase;letter-spacing:1px}:host ion-list ion-icon[slot=start],:host ion-list ion-icon[slot=end]{font-size:1.2em}:host ion-list ion-icon[slot=start]{margin-right:8px}:host ion-list ion-icon[slot=end]{margin-right:0}";

defineIonxLinkEditor();
let LinkMenu = class extends HTMLElement$1 {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  async edit() {
    const view = await this.editor.getView();
    const { state } = view;
    const { schema } = state;
    const { marks } = schema;
    const linkMark = marks.link;
    const linkSpec = linkMark.spec;
    MARKS: for (const mark of findMarksInSelection(state, linkMark)) {
      const href = mark.attrs.href;
      const target = mark.attrs.target;
      if (href) {
        await popoverController.dismiss();
        const linkSchemes = linkSpec instanceof LinkMark ? linkSpec.schemes : undefined;
        const link = await showLinkEditor({ value: { href, target }, schemes: linkSchemes }, { animated: "onlyEnter" });
        if (link) {
          const selection = state.selection;
          const tr = state.tr;
          tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
            if (node.isText) {
              const { start, end } = findNodeStartEnd(tr.doc, pos);
              tr.addMark(start, end, schema.mark(linkMark, link));
            }
          });
          view.dispatch(tr);
        }
        view.focus();
        break MARKS;
      }
    }
  }
  async unlink() {
    const view = await this.editor.getView();
    const { state } = view;
    const { selection } = state;
    const { marks } = state.schema;
    if (selection.empty) {
      const tr = state.tr;
      tr.doc.nodesBetween(selection.from, selection.to, (node, pos) => {
        if (node.isText) {
          const $pos = tr.doc.resolve(pos);
          const start = pos - $pos.textOffset;
          const end = start + $pos.parent.child($pos.index()).nodeSize;
          tr.removeMark(start, end, marks.link);
        }
      });
      view.dispatch(tr);
    }
    else {
      toggleMark(marks.link)(state, tr => view.dispatch(tr));
    }
    await popoverController.dismiss();
    view.focus();
  }
  render() {
    return h("ion-list", { lines: "full" }, h("ion-item", { button: true, detail: false, onClick: () => this.edit() }, h("ion-icon", { name: "link-outline", slot: "start" }), h("ion-label", null, intl.message `@co.mmons/js-intl#Edit|command`)), h("ion-item", { button: true, detail: false, onClick: () => this.unlink() }, h("ion-icon", { name: "unlink-outline", slot: "start" }), h("ion-label", null, intl.message `@co.mmons/js-intl#Delete|command`)));
  }
  static get style() { return linkMenuCss; }
};

const listMenuCss = ":host{overflow:initial !important}:host ion-list{margin:0;padding:0}:host ion-list ion-item{--border-width:0 0 var(--ionx-border-width) 0;--inner-border-width:0;--inner-padding-start:0;--inner-padding-end:0;--padding-start:16px;--padding-end:16px}:host ion-list>ion-item.item:last-child,:host ion-list>*:last-child>ion-item.item:last-child{--border-width:0}:host ion-list ion-item>[slot=start]{margin-right:16px;margin-left:0px}:host ion-list ion-item.item ion-label{white-space:normal}:host ion-list ion-item.item ion-label small{display:block;line-height:1}:host ion-list ion-item-divider.item{--background:transparent;--color:rgb(var(--ion-text-color-rgb), .5);--padding-start:16px;--padding-end:16px;--padding-top:20px;--inner-border-width:0;--border-width:0;font-size:calc(var(--ionx-default-font-size, 16px) * 0.75);font-weight:500;border-bottom:var(--ionx-border-width) solid var(--ion-border-color);text-transform:uppercase;letter-spacing:1px}:host ion-list ion-icon[slot=start],:host ion-list ion-icon[slot=end]{font-size:1.2em}:host ion-list ion-icon[slot=start]{margin-right:8px}:host ion-list ion-icon[slot=end]{margin-right:0}";

let ListMenu = class extends HTMLElement$1 {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  async level(level) {
    const view = await this.editor.getView();
    const { state } = view;
    const command = level < 0 ? outdentList() : indentList();
    if (command(state)) {
      command(state, t => view.dispatch(t));
    }
    await popoverController.dismiss();
    view.focus();
  }
  async toggleList(type) {
    const view = await this.editor.getView();
    toggleList(view.state, t => view.dispatch(t), view, type);
    await popoverController.dismiss();
    view.focus();
  }
  connectedCallback() {
    this.editor.getView().then(view => {
      const { selection, schema } = view.state;
      this.activeBulletList = !!findParentNode(predicate => predicate.hasMarkup(schema.nodes.bulletList))(selection);
      this.activeNumberedList = !!findParentNode(predicate => predicate.hasMarkup(schema.nodes.orderedList))(selection);
    });
  }
  render() {
    return h("ion-list", { lines: "full" }, h("ion-item", { button: true, detail: false, onClick: () => this.toggleList("bulletList") }, h("ion-label", null, intl.message `ionx/HtmlEditor#listMenu/Bulleted list`), h("ion-icon", { src: "/assets/ionx.HtmlEditor/icons/list-bulleted.svg", slot: "start" }), this.activeBulletList && h("ion-icon", { name: "checkmark", slot: "end" })), h("ion-item", { button: true, detail: false, onClick: () => this.toggleList("orderedList") }, h("ion-label", null, intl.message `ionx/HtmlEditor#listMenu/Numbered list`), h("ion-icon", { src: "/assets/ionx.HtmlEditor/icons/list-numbered.svg", slot: "start" }), this.activeNumberedList && h("ion-icon", { name: "checkmark", slot: "end" })), (this.activeNumberedList || this.activeBulletList) && h(Fragment$1, null, h("ion-item-divider", null, h("ion-label", null, intl.message `ionx/HtmlEditor#listMenu/Indent`)), h("ion-item", { button: true, detail: false, onClick: () => this.level(-1) }, h("ion-label", null, intl.message `ionx/HtmlEditor#listMenu/Decrease indent`), h("ion-icon", { src: "/assets/ionx.HtmlEditor/icons/indent-decrease.svg", slot: "start" })), h("ion-item", { button: true, detail: false, onClick: () => this.level(1) }, h("ion-label", null, intl.message `ionx/HtmlEditor#listMenu/Increase indent`), h("ion-icon", { src: "/assets/ionx.HtmlEditor/icons/indent-increase.svg", slot: "start" }))));
  }
  static get style() { return listMenuCss; }
};

const paragraphMenuCss = ":host{overflow:initial !important}:host ion-list{margin:0;padding:0}:host ion-list ion-item{--border-width:0 0 var(--ionx-border-width) 0;--inner-border-width:0;--inner-padding-start:0;--inner-padding-end:0;--padding-start:16px;--padding-end:16px}:host ion-list>ion-item.item:last-child,:host ion-list>*:last-child>ion-item.item:last-child{--border-width:0}:host ion-list ion-item>[slot=start]{margin-right:16px;margin-left:0px}:host ion-list ion-item.item ion-label{white-space:normal}:host ion-list ion-item.item ion-label small{display:block;line-height:1}:host ion-list ion-item-divider.item{--background:transparent;--color:rgb(var(--ion-text-color-rgb), .5);--padding-start:16px;--padding-end:16px;--padding-top:20px;--inner-border-width:0;--border-width:0;font-size:calc(var(--ionx-default-font-size, 16px) * 0.75);font-weight:500;border-bottom:var(--ionx-border-width) solid var(--ion-border-color);text-transform:uppercase;letter-spacing:1px}:host ion-list ion-icon[slot=start],:host ion-list ion-icon[slot=end]{font-size:1.2em}:host ion-list ion-icon[slot=start]{margin-right:8px}:host ion-list ion-icon[slot=end]{margin-right:0}";

let ParagraphMenu = class extends HTMLElement$1 {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  async indentLevel(move) {
    const view = await this.editor.getView();
    const { selection, schema } = view.state;
    const node = findParentNodeOfType(schema.nodes.heading)(selection) ?? findParentNodeOfType(schema.nodes.paragraph)(selection);
    if (node) {
      const currentLevel = parseInt((node.node.attrs["indent"] || "0").replace("px", ""), 10) / 32;
      const newLevel = currentLevel === 1 && move === -1 ? 0 : currentLevel + move;
      view.dispatch(view.state.tr.setNodeMarkup(node.pos, null, { indent: newLevel > 0 ? `${newLevel * 32}px` : null }));
    }
    await popoverController.dismiss();
    view.focus();
  }
  async toggleHeading(heading) {
    const view = await this.editor.getView();
    const { state } = view;
    const { nodes } = state.schema;
    if (heading > 0 && this.activeHeading !== heading) {
      const command = setBlockType(nodes.heading, { level: heading });
      if (command(state)) {
        command(state, t => view.dispatch(t));
      }
    }
    else {
      setBlockType(nodes.paragraph)(state, t => view.dispatch(t));
    }
    await popoverController.dismiss();
    view.focus();
  }
  connectedCallback() {
    this.editor.getView().then(view => {
      const { schema, selection } = view.state;
      const activeHeading = findParentNodeOfType(schema.nodes.heading)(selection);
      if (activeHeading) {
        this.activeHeading = activeHeading.node.attrs.level;
      }
    });
  }
  render() {
    return h("ion-list", { lines: "full" }, h("ion-item", { button: true, detail: false, onClick: () => this.indentLevel(1) }, h("ion-label", null, intl.message `ionx/HtmlEditor#listMenu/Increase indent`), h("ion-icon", { src: "/assets/ionx.HtmlEditor/icons/indent-increase.svg", slot: "start" })), h("ion-item", { button: true, detail: false, onClick: () => this.indentLevel(-1) }, h("ion-label", null, intl.message `ionx/HtmlEditor#listMenu/Decrease indent`), h("ion-icon", { src: "/assets/ionx.HtmlEditor/icons/indent-decrease.svg", slot: "start" })), h("ion-item-divider", null, h("ion-label", null, intl.message `ionx/HtmlEditor#Heading`)), this.activeHeading > 0 && h("ion-item", { button: true, detail: false, onClick: () => this.toggleHeading(0) }, h("ion-label", null, intl.message `ionx/HtmlEditor#Plain text`)), [1, 2, 3, 4, 5, 6].map(size => h("ion-item", { button: true, detail: false, onClick: () => this.toggleHeading(size) }, h("ion-label", { style: { fontWeight: "500", fontSize: `${130 - ((size - 1) * 5)}%` } }, intl.message `ionx/HtmlEditor#Heading`, " ", size), this.activeHeading === size && h("ion-icon", { name: "checkmark", slot: "end" }))));
  }
  static get style() { return paragraphMenuCss; }
};

function markApplies(doc, from, to, type) {
  let applies = false;
  doc.nodesBetween(from, to, (node, _pos, parent) => {
    if (applies) {
      return false;
    }
    applies = node.isInline && parent.type.allowsMarkType(type);
  });
  return applies;
}
// return true iff all nodes in range have the mark with the same attrs
function rangeHasMark(doc, from, to, type, attrs) {
  let hasMark = null;
  doc.nodesBetween(from, to, node => {
    for (let i = 0; i < node.marks.length; i++) {
      const markMatch = node.marks[i].type === type && (!attrs || shallowEqual(node.marks[i].attrs, attrs));
      hasMark = (markMatch && (hasMark === null || hasMark === true));
    }
    return hasMark;
  });
  return !!hasMark;
}
function toggleInlineMark(markType, attrs) {
  return function (state, dispatch) {
    const { empty, from, to, $from } = state.selection;
    if (!markApplies(state.doc, from, to, markType)) {
      console.log("not applies");
      return false;
    }
    if (dispatch) {
      if (empty) {
        const markInSet = markType.isInSet(state.storedMarks || $from.marks());
        if (markInSet && (!attrs || shallowEqual(markInSet.attrs, attrs))) {
          dispatch(state.tr.removeStoredMark(markType));
        }
        else {
          dispatch(state.tr.addStoredMark(markType.create(attrs)));
        }
      }
      else {
        if (rangeHasMark(state.doc, from, to, markType, attrs)) {
          dispatch(state.tr.removeMark(from, to, markType).scrollIntoView());
        }
        else {
          dispatch(state.tr.addMark(from, to, markType.create(attrs)).scrollIntoView());
        }
      }
    }
    return true;
  };
}

class FontSize extends Enum {
  constructor(name, css) {
    super(name);
    this.name = name;
    this.css = css;
    this.label = new MessageRef("ionx/HtmlEditor", `${name}FontSizeLabel`);
  }
  static values() {
    return super.values();
  }
  static valueOf(value) {
    return super.valueOf(value);
  }
  static fromJSON(value) {
    return super.fromJSON(value);
  }
}
FontSize.xxSmall = new FontSize("xxSmall", "xx-small");
FontSize.xSmall = new FontSize("xSmall", "x-small");
FontSize.small = new FontSize("small", "small");
FontSize.large = new FontSize("large", "large");
FontSize.xLarge = new FontSize("xLarge", "x-large");
FontSize.xxLarge = new FontSize("xxLarge", "xx-large");

const textMenuCss = ":host{overflow:initial !important}:host ion-list{margin:0;padding:0}:host ion-list ion-item{--border-width:0 0 var(--ionx-border-width) 0;--inner-border-width:0;--inner-padding-start:0;--inner-padding-end:0;--padding-start:16px;--padding-end:16px}:host ion-list>ion-item.item:last-child,:host ion-list>*:last-child>ion-item.item:last-child{--border-width:0}:host ion-list ion-item>[slot=start]{margin-right:16px;margin-left:0px}:host ion-list ion-item.item ion-label{white-space:normal}:host ion-list ion-item.item ion-label small{display:block;line-height:1}:host ion-list ion-item-divider.item{--background:transparent;--color:rgb(var(--ion-text-color-rgb), .5);--padding-start:16px;--padding-end:16px;--padding-top:20px;--inner-border-width:0;--border-width:0;font-size:calc(var(--ionx-default-font-size, 16px) * 0.75);font-weight:500;border-bottom:var(--ionx-border-width) solid var(--ion-border-color);text-transform:uppercase;letter-spacing:1px}:host ion-list ion-icon[slot=start],:host ion-list ion-icon[slot=end]{font-size:1.2em}:host ion-list ion-icon[slot=start]{margin-right:8px}:host ion-list ion-icon[slot=end]{margin-right:0}:host input[type=color]{width:24px;height:24px;border:1px solid var(--ion-border-color);background-color:transparent;margin:0 0 0 8px;outline:none}:host ion-button[slot=end],:host ion-icon[slot=end]{margin:0}";

const simpleMarks = [
  { name: "strong", style: { fontWeight: "bold" }, label: new MessageRef("ionx/HtmlEditor", "Bold|text") },
  { name: "emphasis", style: { fontStyle: "italic" }, label: new MessageRef("ionx/HtmlEditor", "Italic|text") },
  { name: "underline", style: { textDecoration: "underline" }, label: new MessageRef("ionx/HtmlEditor", "Underline|text") },
  { name: "strikethrough", style: { textDecoration: "line-through" }, label: new MessageRef("ionx/HtmlEditor", "Strikethrough|text") },
  { name: "superscript", label: new MessageRef("ionx/HtmlEditor", "Superscript|text"), sublabel: `<sup>xyz</sup>` },
  { name: "subscript", label: new MessageRef("ionx/HtmlEditor", "Subscript|text"), sublabel: `<sub>xyz</sub>` }
];
let TextMenu = class extends HTMLElement$1 {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  async toggle(markName) {
    const view = await this.editor.getView();
    const { state } = view;
    const { marks } = state.schema;
    const command = toggleMark(marks[markName]);
    if (command(view.state)) {
      command(view.state, t => view.dispatch(t));
    }
    await popoverController.dismiss();
    view.focus();
  }
  async toggleFontSize(size) {
    this.activeFontSize = size;
    const view = await this.editor.getView();
    const { state } = view;
    if (size) {
      toggleInlineMark(state.schema.marks.fontSize, { fontSize: size.css })(state, view.dispatch);
    }
    else {
      toggleMark(state.schema.marks.fontSize)(state, view.dispatch);
    }
    await popoverController.dismiss();
    view.focus();
  }
  async toggleColor(mark, color) {
    if (mark === "textForegroundColor") {
      this.activeForegroundColor = color;
    }
    else {
      this.activeBackgroundColor = color;
    }
    const view = await this.editor.getView();
    const { state } = view;
    const { marks } = state.schema;
    if (color) {
      toggleInlineMark(marks[mark], { color })(state, view.dispatch);
    }
    else {
      toggleMark(marks[mark])(state, view.dispatch);
      await popoverController.dismiss();
      view.focus();
    }
  }
  connectedCallback() {
    this.editor.getView().then(view => {
      const { state } = view;
      const { marks } = state.schema;
      this.activeMarks = [];
      this.marks = [];
      for (const [markName, mark] of Object.entries(marks)) {
        if (isMarkFromGroup(mark, "textFormat")) {
          this.marks.push(markName);
          if (isMarkActive(state, mark)) {
            this.activeMarks.push(markName);
          }
        }
      }
      this.activeForegroundColor = marks.textForegroundColor && findMarksInSelection(state, marks.textForegroundColor).map(mark => mark.attrs.color)
        .find(color => !!color);
      this.activeBackgroundColor = marks.textBackgroundColor && findMarksInSelection(state, marks.textBackgroundColor).map(mark => mark.attrs.color)
        .find(color => !!color);
      this.activeFontSize = undefined;
      if (marks.fontSize) {
        MARKS: for (const mark of findMarksInSelection(state, marks.fontSize)) {
          for (const size of FontSize.values()) {
            if (size.css === mark.attrs.fontSize) {
              // ups, mamy różne rozmiary w zaznaczeniu
              if (this.activeFontSize && size !== this.activeFontSize) {
                this.activeFontSize = undefined;
                break MARKS;
              }
              this.activeFontSize = size;
            }
          }
        }
      }
    });
  }
  render() {
    if (!this.marks) {
      return;
    }
    return h("ion-list", { lines: "full" }, simpleMarks.map(mark => this.marks.includes(mark.name) && h("ion-item", { button: true, detail: false, onClick: () => this.toggle(mark.name) }, h("ion-label", { style: mark.style }, translate(intl, mark.label), mark.sublabel && h("span", { innerHTML: mark.sublabel })), this.activeMarks.includes(mark.name) && h("ion-icon", { name: "checkmark", slot: "end" }))), this.marks.includes("textForegroundColor") && h("ion-item", { detail: false }, h("ion-label", null, intl.message `ionx/HtmlEditor#Text color`), h("input", { slot: "end", type: "color", value: this.activeForegroundColor || "#000000", onInput: ev => this.toggleColor("textForegroundColor", ev.target.value) }), this.activeForegroundColor && h("ion-button", { slot: "end", fill: "clear", size: "small", onClick: () => this.toggleColor("textForegroundColor") }, h("ion-icon", { name: "backspace", slot: "icon-only", size: "small" }))), this.marks.includes("textBackgroundColor") && h("ion-item", { detail: false }, h("ion-label", null, intl.message `ionx/HtmlEditor#Background color`), h("input", { slot: "end", type: "color", value: this.activeBackgroundColor || "#000000", onInput: ev => this.toggleColor("textBackgroundColor", ev.target.value) }), this.activeBackgroundColor && h("ion-button", { slot: "end", fill: "clear", size: "small", onClick: () => this.toggleColor("textBackgroundColor") }, h("ion-icon", { name: "backspace", slot: "icon-only", size: "small" }))), this.marks.includes("fontSize") && h(Fragment$1, null, h("ion-item-divider", null, h("ion-label", null, intl.message `ionx/HtmlEditor#Text size`)), h("ion-item", { button: true, detail: false, onClick: () => this.toggleFontSize() }, h("ion-label", null, intl.message `ionx/HtmlEditor#Default|text size`)), FontSize.values().map(size => h("ion-item", { button: true, detail: false, onClick: () => this.toggleFontSize(size) }, h("ion-label", { style: { fontSize: size.css } }, intl.message(size.label)), this.activeFontSize === size && h("ion-icon", { name: "checkmark", slot: "end" })))));
  }
  static get style() { return textMenuCss; }
};

const toolbarCss = ".sc-ionx-html-editor-toolbar-h{outline:none;display:flex;justify-content:center;flex-wrap:wrap;position:sticky;position:-webkit-sticky;top:0;background-color:var(--background);z-index:1;padding:8px 0}.sc-ionx-html-editor-toolbar-h ion-button.sc-ionx-html-editor-toolbar{margin:0 4px;--padding-end:4px;--padding-start:4px}.sc-ionx-html-editor-toolbar-h ion-button.sc-ionx-html-editor-toolbar:not(.button-outline){border:1px solid transparent}.sc-ionx-html-editor-toolbar-h ion-button.button-outline.sc-ionx-html-editor-toolbar{--border-width:1px}.sc-ionx-html-editor-toolbar-h ion-icon[slot=end].sc-ionx-html-editor-toolbar{margin:0;font-size:1em}.sc-ionx-html-editor-toolbar-h ion-button[disabled].sc-ionx-html-editor-toolbar{opacity:0.5}.sc-ionx-html-editor-toolbar-h [ionx--buttons-group].sc-ionx-html-editor-toolbar{display:flex}.sc-ionx-html-editor-toolbar-h .buttons-group.sc-ionx-html-editor-toolbar ion-button.sc-ionx-html-editor-toolbar:not(:last-child){margin-right:0}.ion-focused.sc-ionx-html-editor-toolbar-h,.ion-focused .sc-ionx-html-editor-toolbar-h{background-color:var(--background-focused)}";

let Toolbar = class extends HTMLElement$1 {
  constructor() {
    super();
    this.__registerHost();
    this.canUndo = false;
    this.canRedo = false;
  }
  get editor() {
    return this.element.parentElement;
  }
  async undo() {
    const view = await this.editor.getView();
    undo(view.state, t => view.updateState(view.state.apply(t)));
    this.canUndo = undoDepth(view.state) > 0;
    this.canRedo = redoDepth(view.state) > 0;
    this.editor.setFocus();
  }
  async redo() {
    const view = await this.editor.getView();
    redo(view.state, t => view.updateState(view.state.apply(t)));
    this.canUndo = undoDepth(view.state) > 0;
    this.canRedo = redoDepth(view.state) > 0;
    this.editor.setFocus();
  }
  async showMenu(view, item) {
    const popover = await popoverController.create({
      component: item.menuComponent,
      componentProps: {
        ...(typeof item.menuComponentProps === "function" ? await item.menuComponentProps(view) : (item.menuComponentProps ?? {})),
        editor: this.editor,
      },
      event,
      showBackdrop: isPlatform("ios"),
      leaveAnimation: () => createAnimation()
    });
    popover.style.setProperty("--width", "auto");
    popover.style.setProperty("--height", "auto");
    popover.style.setProperty("--max-width", "80vw");
    popover.style.setProperty("--max-height", "80vh");
    await popover.present();
    const dismiss = await popover.onDidDismiss();
    if (dismiss.role === "backdrop") {
      view.focus();
    }
  }
  async handleItemClick(_event, item) {
    const view = await this.editor.getView();
    if (item.menuComponent) {
      this.showMenu(view, item);
    }
    else if (item.handler) {
      try {
        let result = item.handler(view);
        if (result instanceof Promise) {
          result = await result;
        }
        if (result !== false) {
          view.focus();
        }
      }
      catch (e) {
        console.error(e);
      }
    }
  }
  async forceUpdate(onlyIfChange = false) {
    const view = await this.editor.getView();
    if (!view) {
      return;
    }
    const wasCanUndo = this.canUndo;
    const wasCanRedo = this.canRedo;
    const prevButtons = this.buttons;
    this.canUndo = undoDepth(view.state) > 0;
    this.canRedo = redoDepth(view.state) > 0;
    this.buttons = this.items?.filter(item => !item.isVisible || item.isVisible(view)).map(item => ({
      labelVisible: item.labelVisible,
      iconVisible: item.iconVisible,
      label: item.label instanceof MessageRef ? translate(intl, item.label) : item.label,
      active: item.isActive?.(view) || false,
      iconName: item.iconName,
      iconSrc: item.iconSrc,
      menuComponent: item.menuComponent,
      menuComponentProps: typeof item.menuComponentProps === "function" ? item.menuComponentProps.bind(item) : item.menuComponentProps,
      handler: item.handler ? item.handler.bind(item) : undefined
    }));
    if (!onlyIfChange || wasCanUndo !== this.canUndo || wasCanRedo !== this.canRedo || !deepEqual(this.buttons, prevButtons)) {
      forceUpdate(this);
    }
  }
  async editorSelectionChanged() {
    await this.forceUpdate(true);
  }
  async componentDidLoad() {
    await this.forceUpdate(true);
  }
  connectedCallback() {
    this.selectionUnlisten = addEventListener(this.editor, "editorSelectionChange", () => this.editorSelectionChanged());
  }
  disconnectedCallback() {
    this.selectionUnlisten?.();
  }
  render() {
    return h(Host, null, this.buttons?.map(item => h("ion-button", { size: "small", fill: item.active ? "outline" : "clear", onClick: ev => this.handleItemClick(ev, item) }, (item.iconSrc || item.iconName) && item.iconVisible !== false && h("ion-icon", { name: item.iconName, src: item.iconSrc, slot: item.labelVisible !== false ? "start" : "icon-only", size: item.labelVisible !== false ? "small" : undefined }), item.menuComponent && h("ion-icon", { name: "caret-down", slot: "end" }), item.labelVisible !== false && h("span", null, item.label))), !this.historyDisabled && h("div", { class: "buttons-group" }, h("ion-button", { size: "small", fill: "clear", tabindex: "-1", disabled: !this.canUndo, title: intl.message `ionx/HtmlEditor#Undo`, onClick: () => this.undo() }, h("ion-icon", { src: "/assets/ionx.HtmlEditor/icons/undo.svg", slot: "icon-only" })), h("ion-button", { size: "small", fill: "clear", tabindex: "-1", disabled: !this.canRedo, title: intl.message `ionx/HtmlEditor#Redo`, onClick: () => this.redo() }, h("ion-icon", { src: "/assets/ionx.HtmlEditor/icons/redo.svg", slot: "icon-only" }))));
  }
  get element() { return this; }
  static get style() { return toolbarCss; }
};

const IonxHtmlEditor = /*@__PURE__*/proxyCustomElement(HtmlEditor, [0,"ionx-html-editor",{"readonly":[4],"disabled":[4],"value":[1025],"schema":[16],"plugins":[16],"keymap":[16],"historyDisabled":[4,"history-disabled"],"toolbarItems":[16]}]);
const IonxHtmlEditorAlignmentMenu = /*@__PURE__*/proxyCustomElement(AlignmentMenu, [1,"ionx-html-editor-alignment-menu",{"editor":[16]}]);
const IonxHtmlEditorInsertMenu = /*@__PURE__*/proxyCustomElement(InsertMenu, [1,"ionx-html-editor-insert-menu",{"editor":[16],"items":[16]}]);
const IonxHtmlEditorLinkMenu = /*@__PURE__*/proxyCustomElement(LinkMenu, [1,"ionx-html-editor-link-menu",{"editor":[16]}]);
const IonxHtmlEditorListMenu = /*@__PURE__*/proxyCustomElement(ListMenu, [1,"ionx-html-editor-list-menu",{"editor":[16]}]);
const IonxHtmlEditorParagraphMenu = /*@__PURE__*/proxyCustomElement(ParagraphMenu, [1,"ionx-html-editor-paragraph-menu",{"editor":[16]}]);
const IonxHtmlEditorTextMenu = /*@__PURE__*/proxyCustomElement(TextMenu, [1,"ionx-html-editor-text-menu",{"editor":[16],"activeForegroundColor":[32],"activeBackgroundColor":[32]}]);
const IonxHtmlEditorToolbar = /*@__PURE__*/proxyCustomElement(Toolbar, [2,"ionx-html-editor-toolbar",{"historyDisabled":[4,"history-disabled"],"items":[16]}]);
const defineIonxHtmlEditor = (opts) => {
  if (typeof customElements !== 'undefined') {
    [
      IonxHtmlEditor,
  IonxHtmlEditorAlignmentMenu,
  IonxHtmlEditorInsertMenu,
  IonxHtmlEditorLinkMenu,
  IonxHtmlEditorListMenu,
  IonxHtmlEditorParagraphMenu,
  IonxHtmlEditorTextMenu,
  IonxHtmlEditorToolbar
    ].forEach(cmp => {
      if (!customElements.get(cmp.is)) {
        customElements.define(cmp.is, cmp, opts);
      }
    });
  }
};
defineIonxHtmlEditor();

export { AlignmentMark, AlignmentToolbarItem, BlockquoteNode, BulletListNode, DocNode, EmphasisMark, FontSizeMark, HardBreakNode, HeadingNode, HorizontalRuleNode, HtmlEditor$1 as HtmlEditor, InsertLinkMenuItem, InsertListMenuItems, InsertMenuToolbarItem, IonxHtmlEditor, IonxHtmlEditorAlignmentMenu, IonxHtmlEditorInsertMenu, IonxHtmlEditorLinkMenu, IonxHtmlEditorListMenu, IonxHtmlEditorParagraphMenu, IonxHtmlEditorTextMenu, IonxHtmlEditorToolbar, LinkMark, LinkMenuToolbarItem, ListItemNode, ListMenuToolbarItem, MarkSpecExtended, NodeSpecExtended, OrderedListNode, ParagraphMenuToolbarItem, ParagraphNode, StrikethroughMark, StrongMark, SubscriptMark, SuperscriptMark, TextBackgroundColorMark, TextEmphasisToolbarItem, TextForegroundColorMark, TextMenuToolbarItem, TextNode, TextStrikethroughToolbarItem, TextStrongToolbarItem, TextSubscriptToolbarItem, TextSuperscriptToolbarItem, TextUnderlineToolbarItem, ToolbarItem, UnderlineMark, baseKeymap, buildSchema, buildSchemaWithOptions, defineIonxHtmlEditor, enterKeymap };
