import {Component, h, Host} from "@stencil/core";
import {lazyLoadItem} from "../../components/LazyLoad";

@Component({
    tag: "ionx-test-masonry-grid"
})
export class MasonryGridTestPage {

    photos = [
        ["https://nie.ma.takiego.pl/adresu.jpg", "https://i.wpimg.pl/1920x0/m.autokult.pl/bmw-3-touring-2019-46-a1389a235e,0,0,0,0.jpg"],
        "https://sklep.avisa.pl/pol_pl_Nakladka-na-zderzak-tylny-do-BMW-serii-3-VII-G21-Kombi-Stal-1696_8.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/7/74/BMW_G21_Leonberg_2019_IMG_0017.jpg",
        "https://upload.wikimedia.org/wikipedia/commons/e/e2/BMW_G21_at_IAA_2019_IMG_0704.jpg"
    ];

    render() {

        return <Host>
            <ion-content>

                <ionx-lazy-load/>

                <ionx-masonry-grid>

                    {this.photos.map((v, index) => <div style={{width: "50%"}}>
                        <ion-card>
                            <ion-card-title>{index}</ion-card-title>
                            {index % 2 && <img width="300" ref={lazyLoadItem({src: v})}/>}
                            {!(index % 2) && <div style={{width: "300px"}} ref={lazyLoadItem({src: v, styleParents: {"ion-card": "app--"}})}/>}
                        </ion-card>
                    </div>)}

                </ionx-masonry-grid>

            </ion-content>
        </Host>
    }
}
