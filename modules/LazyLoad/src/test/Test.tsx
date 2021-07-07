import {Component, h, Host} from "@stencil/core";
import {lazyLoadItem} from "../lazyLoadItem";

@Component({
    tag: "ionx-test"
})
export class Test {

    render() {
        return <Host>
            <ionx-lazy-load/>

            <div style={{height: "1000px"}}>
                <img ref={lazyLoadItem({src: "https://cdn.pixabay.com/photo/2021/06/16/06/05/lotus-6340337_1280.jpg"})}/>
                <img ref={lazyLoadItem({src: "https://cdn.pixabay.com/photo/2021/06/20/17/48/horse-6351668_1280.jpg"})}/>
                <img ref={lazyLoadItem({src: "https://cdn.pixabay.com/photo/2021/06/16/16/02/mountains-6341663_1280.jpg"})}/>
            </div>

            <ionx-test-shadow/>
        </Host>
    }
}
