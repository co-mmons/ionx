import {Component, h, Host, Element} from "@stencil/core";

@Component({
    tag: "ionx-test"
})
export class Test {

    @Element()
    element: HTMLElement;

    loremIpsum = "Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.";

    change() {

        const divs = this.element.querySelectorAll("div");
        const child = divs[1].firstElementChild as HTMLElement;
        child.style.fontWeight = child.style.fontWeight === "600" ? "400" : "600";

    }

    render() {
        return <Host>

            <button onClick={() => this.change()}>change</button>

            <ionx-masonry-grid>
                {[231,122,35,234,245,656,227,128,129].map(i => <div style={{width: "50%"}}>
                    <div style={{margin: "16px", border: "1px solid red"}}>{this.loremIpsum.substring(1, i)}</div>
                </div>)}
            </ionx-masonry-grid>
        </Host>
    }
}
