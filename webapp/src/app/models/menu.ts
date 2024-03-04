import { IconName, IconPrefix } from "@fortawesome/fontawesome-common-types";

export interface MenuItem {
  text?: string;
  link?: string;
  icon?: IconName;
  icon_type?: IconPrefix;
}
