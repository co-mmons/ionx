import {Component, h, Host} from "@stencil/core";
import {lazyLoadItem} from "../../components/LazyLoad";
import {lineBreak} from "../../components/MasonryGrid";
import {photos} from "./photos";

@Component({
    tag: "ionx-test-masonry-grid",
    styleUrl: "MasonryGridTestPage.scss",
    scoped: true
})
export class MasonryGridTestPage {

    render() {

        return <Host>
            <ion-content>

                <ionx-lazy-load/>

                <ionx-masonry-grid>

                    {photos.map((photoUrl, index) => <div app--grid-item {...lineBreak(index === 1)}>
                        <ion-card>
                            {<div app--photo ref={lazyLoadItem({src: photoUrl})}/>}
                        </ion-card>
                    </div>)}

                </ionx-masonry-grid>

            </ion-content>
        </Host>
    }
}
