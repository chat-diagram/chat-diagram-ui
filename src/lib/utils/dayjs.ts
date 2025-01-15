import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
// 导入所需的语言包
import "dayjs/locale/en";
import "dayjs/locale/zh";
import i18n from "@/i18n";

dayjs.extend(relativeTime);
dayjs.locale(i18n.language);

// 监听语言变化
i18n.on("languageChanged", (lng) => {
  dayjs.locale(lng);
});
export default dayjs;

export const formatDateTime = (date: string) => {
  if (!date) {
    return "";
  }
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};
