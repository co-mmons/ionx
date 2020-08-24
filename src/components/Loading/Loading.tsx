import {intl} from "@co.mmons/js-intl";
import {Component, Element, h, Method, Prop} from "@stencil/core";
import {LoadingOptions} from "./LoadingOptions";

@Component({
    tag: "ionx-loading",
    styleUrls: ["Loading.scss"],
    shadow: true
})
export class Loading implements LoadingOptions {

    @Prop()
    fill: boolean;

    @Prop()
    header: string;

    @Prop()
    message: string;

    /**
     * @inheritDoc
     */
    @Prop()
    type: "spinner" | "progress";

    @Prop()
    progressMessage: string;

    @Prop()
    progressType: "determinate" | "indeterminate" = "determinate";

    @Prop()
    progressValue = 0;

    @Prop()
    progressBuffer = 0;

    @Prop()
    progressPercent: number;

    get progressPercentVisible() {
        return typeof this.progressPercent === "number";
    }

    get spinnerMode() {
        return this.type === "spinner";
    }

    get progressMode() {
        return this.type === "progress";
    }

    @Element()
    protected el: HTMLElement;

    @Method()
    async dismiss() {
        const popover = this.el.closest("ion-popover");
        if (popover) {
            popover.dismiss();
        }
    }

    render() {
        return <div>

            <div style={{display: "flex", alignItems: "center"}}>

                {this.spinnerMode ?
                    <div style={{padding: "16px", paddingRight: "0px"}}>
                        <ion-spinner/>
                    </div> : ""}

                <div style={{padding: "16px", flex: "1", display: "flex", flexDirection: "column", justifyItems: "center"}}>
                    {this.header ? <h5 style={{"margin": "0px"}}>{this.header}</h5> : ""}
                    {this.message ? <ion-text innerHTML={this.message}/> : ""}
                </div>

                {this.progressMode && <ion-progress-bar style={{margin: "8px 0px 16px 0px"}} value={this.progressValue} type={this.progressType} buffer={this.progressBuffer}/>}

                {(!!this.progressMessage || this.progressPercentVisible) && <div style={{display: "flex", margin: "0px 16px 16px 16px"}}>

                    <ion-text innerHTML={this.progressMessage} style={{flex: "1"}}/>

                    {this.progressPercentVisible && <span style={{width: "60px", textAlign: "right"}}>{intl.percentFormat(this. progressPercent, {maximumFractionDigits: 0})}</span>}

                </div>}
            </div>

        </div>;
    }
}
