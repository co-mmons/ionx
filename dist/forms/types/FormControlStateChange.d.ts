import { FormControlReadonlyState } from "./FormControlState";
export interface FormControlStateChange<Value = any> {
  current: FormControlReadonlyState<Value>;
  previous: FormControlReadonlyState<Value>;
  value: boolean;
  status: boolean;
}
