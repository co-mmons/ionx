import {Component, h, Host} from "@stencil/core";
import {Svg} from "ionx/Svg";
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

            <h1>test svg</h1>

            <Svg ref={lazyLoadItem({src: "https://appspltfrm.imgix.net/customers/r4sb2xoai4/upload/2022-6/82I7h6tLmZduAg9Rqs7YCPKqeujk23.svg"})}/>

        </Host>
    }
}
