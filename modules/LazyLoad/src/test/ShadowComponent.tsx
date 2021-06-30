import {Component, h, Host} from "@stencil/core";
import {lazyLoadItem} from "../lazyLoadItem";

@Component({
    tag: "ionx-test-shadow",
    shadow: true
})
export class ShadowComponent {
    render() {
        return <Host>
            <ionx-lazy-load
                container="parent"
                observeShadow={true}/>

            <img ref={lazyLoadItem({src: "https://cdn.pixabay.com/photo/2013/08/10/17/01/africa-171315_1280.jpg"})}/>
        </Host>;
    }
}
