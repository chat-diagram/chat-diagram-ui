"use client";

import { useTranslation } from "react-i18next";
import { I18nextProvider } from "react-i18next";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";
import i18n from "@/i18n";
import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export function LanguageSwitcher() {
  const { i18n, t } = useTranslation("common");

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    console.log(
      i18n.getResource("en", "common", "welcome"),
      t,
      t("common.welcome")
    );
    // 可选：保存到 localStorage
    localStorage.setItem("preferred-language", lng);
  };

  return (
    <div className="flex gap-2">
      <Tabs defaultValue={i18n.language} onValueChange={changeLanguage}>
        <TabsList muted>
          <TabsTrigger value="zh">{t("account.nav.zh")}</TabsTrigger>
          <TabsTrigger value="en">{t("account.nav.en")}</TabsTrigger>
        </TabsList>
      </Tabs>
      {/* <Button
        variant="ghost"
        onClick={() => changeLanguage("zh")}
        disabled={i18n.language === "zh"}
      >
        中文
      </Button>
      <Button
        variant="ghost"
        onClick={() => changeLanguage("en")}
        disabled={i18n.language === "en"}
      >
        English
      </Button> */}
    </div>
  );
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // 从 localStorage 恢复语言设置
    const savedLanguage = localStorage.getItem("preferred-language");
    if (savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, []);

  return <I18nextProvider i18n={i18n}>{children}</I18nextProvider>;
}
