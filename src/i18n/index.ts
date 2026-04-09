import i18n from "i18next";
import { initReactI18next, useTranslation } from "react-i18next";
import en from "./locales/en";
import zh from "./locales/zh";

// 导入翻译文件
const resources = {
  en,
  zh,
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en", // 默认语言
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
  detection: {
    caches: ["localStorage"], // 将语言选择保存到 localStorage
  },
});

export const useI18n = () => {
  const { t } = useTranslation("common");
  return t;
};

export default i18n;
