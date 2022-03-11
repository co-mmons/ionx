import {Component, h, Host} from "@stencil/core";
import {baseKeymap, enterKeymap} from "../keymaps";
import {InsertLinkMenuItem} from "../menus";
import {InsertListMenuItems} from "../menus/InsertListMenuItems";

import {
    AlignmentMark,
    BlockquoteNode,
    buildSchema,
    BulletListNode, DocNode,
    EmphasisMark,
    FontSizeMark,
    HardBreakNode,
    HeadingNode,
    HorizontalRuleNode,
    LinkMark,
    ListItemNode,
    OrderedListNode,
    ParagraphNode, StrikethroughMark,
    StrongMark, SubscriptMark, SuperscriptMark,
    TextBackgroundColorMark,
    TextForegroundColorMark,
    UnderlineMark
} from "../schema";
import {
    AlignmentToolbarItem,
    InsertMenuToolbarItem,
    LinkMenuToolbarItem,
    ListMenuToolbarItem,
    ParagraphMenuToolbarItem,
    TextEmphasisToolbarItem,
    TextStrikethroughToolbarItem,
    TextStrongToolbarItem,
    TextSubscriptToolbarItem, TextSuperscriptToolbarItem,
    TextMenuToolbarItem,
    TextUnderlineToolbarItem
} from "../toolbar";

@Component({
    tag: "ionx-html-editor-test"
})
export class HtmlEditorTest {

    schema1 = buildSchema(
        new ParagraphNode(), new StrongMark(),
        new FontSizeMark(), new LinkMark(),
        new EmphasisMark(), new AlignmentMark(),
        new BlockquoteNode(), new BulletListNode(),
        new HardBreakNode(), new HeadingNode(),
        new HorizontalRuleNode(), new ListItemNode(),
        new OrderedListNode(), new TextForegroundColorMark(),
        new UnderlineMark(), new TextBackgroundColorMark(),
        new StrikethroughMark(), new SubscriptMark(), new SuperscriptMark());

    toolbar1 = [
        new TextMenuToolbarItem(),
        new AlignmentToolbarItem(),
        new ParagraphMenuToolbarItem(),
        new ListMenuToolbarItem(),
        new InsertMenuToolbarItem(InsertLinkMenuItem, InsertListMenuItems),
        new LinkMenuToolbarItem()];

    private value1 = `
<p>
Lorem <app-template-string props="{}"></app-template-string> ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ipsum risus, pharetra id odio dictum, eleifend interdum erat. Curabitur vitae vulputate ex, scelerisque dapibus sem. Morbi facilisis dolor mi, quis volutpat erat aliquet et. Curabitur in neque neque. Quisque sollicitudin lacus metus, non convallis risus tristique ut. Praesent rhoncus gravida elementum. Proin faucibus in nisl ut suscipit. Morbi neque augue, imperdiet a eleifend eu, laoreet fringilla augue. Praesent vestibulum condimentum eros, ac consequat purus.
</p>
<p>
Vivamus non aliquet sem. <a href="https://onet.pl" target="_blank">Duis</a> quis dolor ut lectus sollicitudin fringilla id sed dui. Suspendisse sit amet consequat justo. In hac habitasse platea dictumst. Pellentesque augue nisl, consectetur sagittis nunc eu, luctus lobortis nisl. Donec quam eros, auctor et consectetur ac, venenatis ut odio. Donec malesuada ullamcorper ipsum quis pretium. Duis lacinia efficitur leo ut ultrices. Vivamus tincidunt elit vitae facilisis lobortis. Nunc ac sapien eget leo consectetur mattis. Mauris in rutrum justo, ut dictum augue.
</p>
<p>
Integer et lorem eget eros <span style="text-decoration-line: line-through">olalala</span> tristique sit amet eget tellus. Pellentesque odio neque, venenatis quis lacus ut, scelerisque pharetra massa. Nulla vestibulum accumsan mattis. Ut ut viverra mauris. Cras viverra vestibulum quam eget pretium. Cras id dui in ipsum tempus porttitor vitae et quam. Praesent hendrerit vestibulum laoreet.
</p>
<p>
Nunc viverra varius nisi <strong>vitae</strong> iaculis. Donec id gravida elit. Cras blandit sagittis dolor in consequat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse feugiat, velit nec molestie finibus, est enim rhoncus risus, nec bibendum nisl augue in libero. Ut nec quam dictum, bibendum ipsum vel, elementum quam. Nunc sit amet ultrices mauris, in tempor lacus. Donec in eros ut dui porttitor tempus id gravida lectus. Fusce sed felis ex. Mauris volutpat, purus non auctor gravida, magna nisl varius mi, fringilla euismod lorem nulla eu est. Morbi sollicitudin nulla turpis, sit amet ornare metus tempor quis. Cras et nulla diam. Fusce porta, elit eu porta finibus, erat dolor blandit enim, maximus sollicitudin lacus arcu eget elit.
</p>
<p>
Aliquam faucibus dignissim dolor, at laoreet orci auctor sed. Morbi quis diam enim. Integer ut mauris a enim viverra scelerisque. Ut volutpat luctus mattis. Donec nec nisl sit amet augue viverra convallis. Mauris pretium ante sit amet dolor condimentum varius. Cras luctus, metus at iaculis blandit, nibh elit suscipit odio, eu venenatis odio nisi laoreet turpis. Maecenas condimentum ultrices tristique. Suspendisse vel lacinia sapien.
</p>`;

    render() {
        return <Host>

            <fieldset>
                <legend>full</legend>

                <ionx-html-editor
                    schema={this.schema1}
                    keymap={[baseKeymap, enterKeymap]}
                    toolbarItems={this.toolbar1}
                    value={this.value1}/>

            </fieldset>

            <fieldset>
                <legend>only simple text format, no new lines</legend>

                <ionx-html-editor
                    schema={buildSchema(new DocNode().setContent("text* inline*"), new StrongMark(), new EmphasisMark(), new StrikethroughMark(), new SubscriptMark(), new SuperscriptMark(), new UnderlineMark(), new TextForegroundColorMark(), new TextBackgroundColorMark())}
                    keymap={[baseKeymap]}
                    toolbarItems={[new TextStrongToolbarItem(), new TextEmphasisToolbarItem(), new TextUnderlineToolbarItem(), new TextStrikethroughToolbarItem(), new TextSubscriptToolbarItem(), new TextSuperscriptToolbarItem()]}
                    value={`Some simple <strong>formatted</strong>`}/>

            </fieldset>

        </Host>
    }
}
