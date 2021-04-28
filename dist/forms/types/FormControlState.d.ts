import { FormControlStatus } from "./FormControlStatus";
export interface FormControlState<Value = any> extends FormControlStatus {
  value: Value;
}
export interface FormControlReadonlyState<Value = any> extends Readonly<FormControlState<Value>> {
}
