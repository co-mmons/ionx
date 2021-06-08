import { SelectOption } from "ionx/Select";
import { Link } from "./Link";
import { LinkScheme } from "./LinkScheme";
export interface LinkEditorProps {
  value: string | Link;
  schemes?: SelectOption[] | LinkScheme[];
  targetVisible?: boolean;
}
