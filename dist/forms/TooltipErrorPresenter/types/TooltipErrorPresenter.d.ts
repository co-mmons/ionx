import { FormControl, FormController, FormValidationErrorPresenter } from "ionx/forms";
import { TooltipErrorPresenterOptions } from "./TooltipErrorPresenterOptions";
export declare class TooltipErrorPresenter implements FormValidationErrorPresenter {
  private readonly options?;
  constructor(options?: TooltipErrorPresenterOptions);
  private instance;
  private lastErrorSubscription;
  present(controller: FormController<any>, errorControl: FormControl<any>): Promise<void>;
  dismiss(_controller: FormController<any>): Promise<void>;
  private destroyTippy;
}
