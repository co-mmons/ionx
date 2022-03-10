import {Component, h, Host} from "@stencil/core";
import {baseKeymap} from "../keymaps";
import {InsertLinkMenuItem} from "../menus";

import {buildSchema, FontSizeMark, ParagraphNode, StrongMark} from "../schema";
import {TextToolbarItem} from "../toolbar";
import {InsertToolbarItem} from "../toolbar/InsertToolbarItem";

@Component({
    tag: "ionx-html-editor-test"
})
export class HtmlEditorTest {

    private value = `
<p>
Lorem <app-template-string props="{}"></app-template-string> ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ipsum risus, pharetra id odio dictum, eleifend interdum erat. Curabitur vitae vulputate ex, scelerisque dapibus sem. Morbi facilisis dolor mi, quis volutpat erat aliquet et. Curabitur in neque neque. Quisque sollicitudin lacus metus, non convallis risus tristique ut. Praesent rhoncus gravida elementum. Proin faucibus in nisl ut suscipit. Morbi neque augue, imperdiet a eleifend eu, laoreet fringilla augue. Praesent vestibulum condimentum eros, ac consequat purus.
</p>
<p>
Vivamus non aliquet sem. Duis quis dolor ut lectus sollicitudin fringilla id sed dui. Suspendisse sit amet consequat justo. In hac habitasse platea dictumst. Pellentesque augue nisl, consectetur sagittis nunc eu, luctus lobortis nisl. Donec quam eros, auctor et consectetur ac, venenatis ut odio. Donec malesuada ullamcorper ipsum quis pretium. Duis lacinia efficitur leo ut ultrices. Vivamus tincidunt elit vitae facilisis lobortis. Nunc ac sapien eget leo consectetur mattis. Mauris in rutrum justo, ut dictum augue.
</p>
<p>
Integer et lorem eget eros posuere tristique sit amet eget tellus. Pellentesque odio neque, venenatis quis lacus ut, scelerisque pharetra massa. Nulla vestibulum accumsan mattis. Ut ut viverra mauris. Cras viverra vestibulum quam eget pretium. Cras id dui in ipsum tempus porttitor vitae et quam. Praesent hendrerit vestibulum laoreet.
</p>
<p>
Nunc viverra varius nisi <strong>vitae</strong> iaculis. Donec id gravida elit. Cras blandit sagittis dolor in consequat. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse feugiat, velit nec molestie finibus, est enim rhoncus risus, nec bibendum nisl augue in libero. Ut nec quam dictum, bibendum ipsum vel, elementum quam. Nunc sit amet ultrices mauris, in tempor lacus. Donec in eros ut dui porttitor tempus id gravida lectus. Fusce sed felis ex. Mauris volutpat, purus non auctor gravida, magna nisl varius mi, fringilla euismod lorem nulla eu est. Morbi sollicitudin nulla turpis, sit amet ornare metus tempor quis. Cras et nulla diam. Fusce porta, elit eu porta finibus, erat dolor blandit enim, maximus sollicitudin lacus arcu eget elit.
</p>
<p>
Aliquam faucibus dignissim dolor, at laoreet orci auctor sed. Morbi quis diam enim. Integer ut mauris a enim viverra scelerisque. Ut volutpat luctus mattis. Donec nec nisl sit amet augue viverra convallis. Mauris pretium ante sit amet dolor condimentum varius. Cras luctus, metus at iaculis blandit, nibh elit suscipit odio, eu venenatis odio nisi laoreet turpis. Maecenas condimentum ultrices tristique. Suspendisse vel lacinia sapien.
</p>`;

    render() {
        return <Host>
            <ionx-html-editor
                schema={buildSchema(new ParagraphNode(), new StrongMark(), new FontSizeMark())}
                keymap={baseKeymap}
                toolbarItems={[new TextToolbarItem(), new InsertToolbarItem(InsertLinkMenuItem)]}
                value={this.value}/>
        </Host>
    }
}
