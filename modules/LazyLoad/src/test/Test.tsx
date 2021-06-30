import {Component, h, Host} from "@stencil/core";
import {lazyLoadItem} from "../lazyLoadItem";

@Component({
    tag: "ionx-test"
})
export class Test {

    render() {
        return <Host style={{display: "block"}}>
            <ionx-lazy-load/>

            <img ref={lazyLoadItem({src: "https://cdn.pixabay.com/photo/2013/08/10/17/01/africa-171315_1280.jpg"})}/>

            <ionx-test-shadow/>
        </Host>
    }
}
