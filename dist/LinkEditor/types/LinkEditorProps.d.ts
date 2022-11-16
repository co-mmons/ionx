import { SelectItem } from "ionx/Select";
import { Link } from "./Link";
import { LinkScheme } from "./LinkScheme";
export interface LinkEditorProps {
  value: string | Link;
  schemes?: SelectItem[] | LinkScheme[];
  targetVisible?: boolean;
}
