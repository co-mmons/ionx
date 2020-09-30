import {isPlatform} from "@ionic/core";
import {Subscription} from "rxjs";
import tippy, {Instance as TippyInstance} from "tippy.js";
import {FormControl} from "../FormControl";
import {FormController} from "../FormController";
import {FormValidationErrorPresenter} from "../FormValidationErrorPresenter";
import {TooltipErrorPresenterOptions} from "./TooltipErrorPresenterOptions";

export class TooltipErrorPresenterImpl implements FormValidationErrorPresenter {

    constructor(private readonly options?: TooltipErrorPresenterOptions) {
    }

    private instance: TippyInstance;

    private lastErrorSubscription: Subscription;

    async present(controller: FormController<any>, errorControl: FormControl<any>): Promise<void> {

        this.destroyTippy();

        this.instance = tippy(errorControl.element, Object.assign({
            arrow: true,
            placement: "bottom",
            trigger: "manual",
            hideOnClick: true,
            theme: isPlatform("ios") ? "light-border" : "material"
        } as TooltipErrorPresenterOptions, this.options,{content: errorControl.error.message}));

        this.lastErrorSubscription = errorControl.stateChanges.subscribe(state => !(state.current.touched && state.previous.untouched) && this.dismiss(controller));

        this.instance.show();
    }

    async dismiss(_controller: FormController<any>): Promise<void> {
        this.destroyTippy();
    }

    private destroyTippy() {

        if (this.lastErrorSubscription) {
            this.lastErrorSubscription.unsubscribe();
            this.lastErrorSubscription = undefined;
        }

        if (this.instance) {
            this.instance.destroy();
            this.instance = undefined;
        }
    }

}
