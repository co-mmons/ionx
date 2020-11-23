import {Component, h, Host} from "@stencil/core";
import {lazyLoadItem} from "../../components/LazyLoad";
import {lineBreak} from "../../components/MultiGrid";
import {photos} from "./photos";

@Component({
    tag: "ionx-test-multi-grid",
    styleUrl: "MultiGridTestPage.scss",
    scoped: true
})
export class MultiGridTestPage {

    render() {

        return <Host>
            <ion-content>

                <ionx-lazy-load/>

                <ionx-multi-grid>

                    {photos.map((photoUrl, index) => <div app--grid-item {...lineBreak(index === 1)}>
                        <ion-card>
                            {<div app--photo ref={lazyLoadItem({src: photoUrl})}/>}
                        </ion-card>
                    </div>)}

                </ionx-multi-grid>

            </ion-content>
        </Host>
    }
}
