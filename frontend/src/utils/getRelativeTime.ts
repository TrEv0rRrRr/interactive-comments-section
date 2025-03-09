import { formatDistanceToNow } from "date-fns";
import { enUS } from "date-fns/locale";

export const getRelativeTime = (date: Date): string => {
  return formatDistanceToNow(date, { addSuffix: true, locale: enUS });
};
