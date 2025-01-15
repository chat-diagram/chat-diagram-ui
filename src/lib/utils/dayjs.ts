import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/en"; // 导入英文语言包

dayjs.extend(relativeTime);
dayjs.locale("en"); // 设置语言为英文

export default dayjs;

export const formatDateTime = (date: string) => {
  if (!date) {
    return "";
  }
  return dayjs(date).format("YYYY-MM-DD HH:mm:ss");
};
