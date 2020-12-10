import {intl} from "@co.mmons/js-intl";
import {Component, Element, h, Host, Method, Prop} from "@stencil/core";
import {LoadingOptions} from "./LoadingOptions";

/**
 * Very customizable loading indicator. It can be used as inline element or within overlay.
 */
@Component({
    tag: "ionx-loading",
    styleUrl: "Loading.scss",
    scoped: true
})
export class Loading implements LoadingOptions {

    /**
     * If loading element should fill available space and center content both h and v.
     */
    @Prop({reflect: true})
    cover?: boolean;

    @Prop()
    backdropVisible?: boolean;

    @Prop()
    backdropOpacity?: number;

    @Prop()
    header?: string;

    @Prop()
    message?: string;

    /**
     * @inheritDoc
     */
    @Prop()
    type: "spinner" | "progress" = "spinner";

    @Prop()
    progressMessage?: string;

    @Prop()
    progressType?: "determinate" | "indeterminate" = "determinate";

    @Prop()
    progressValue?: number = 0;

    @Prop()
    progressBuffer?: number = 0;

    @Prop()
    progressPercent?: number;

    @Prop()
    color?: string;

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

        const styles = {};

        if (this.backdropOpacity > 0) {
            styles["--loading-backdrop-opacity"] = `${this.backdropOpacity}`;
        }

        return <Host class={{"ionx--backdrop-visible": this.backdropVisible}} style={styles}>

            <div style={{display: "flex", alignItems: "center", flexWrap: "wrap", flex: this.cover ? "initial" : "1"}}>

                {this.spinnerMode && <ion-spinner color={this.color} style={{marginRight: !!(this.header || this.message) && "8px"}}/>}

                {!!(this.header || this.message) && <div style={{flexBasis: this.progressMode && "100%", display: "flex", flexDirection: "column", justifyItems: "center"}}>
                    {this.header ? <h4 style={{"margin": "0px"}}>{this.header}</h4> : ""}
                    {this.message ? <ion-text color={this.color} innerHTML={this.message}/> : ""}
                </div>}

                {this.progressMode && <ion-progress-bar
                    color={this.color}
                    style={{flexBasis: "100%", marginTop: !!(this.header || this.message) && "8px"}}
                    value={this.progressValue}
                    type={this.progressType}
                    buffer={this.progressBuffer}/>}

                {(!!this.progressMessage || this.progressPercentVisible) && <div style={{display: "flex", flex: "1", marginTop: "8px"}}>

                    <ion-text color={this.color} innerHTML={this.progressMessage} style={{flex: "1"}}/>

                    {this.progressPercentVisible && <span style={{width: "60px", textAlign: "right"}}>{intl.percentFormat(this. progressPercent, {maximumFractionDigits: 0})}</span>}

                </div>}
            </div>

        </Host>;
    }
}
