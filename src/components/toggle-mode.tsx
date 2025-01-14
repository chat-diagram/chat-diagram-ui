"use client";

import * as React from "react";
import { Laptop, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Tabs, TabsList, TabsTrigger } from "./ui/tabs";

export function ModeToggle({}) {
  const { theme, setTheme } = useTheme();

  return (
    <Tabs
      defaultValue={theme}
      onValueChange={(value) => {
        setTheme(value);
      }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <TabsList muted>
        <TabsTrigger value="light">
          <Sun
            // data-mode={theme === "dark" ? "light" : "dark"}
            data-mode={theme}
            className=" rotate-0 scale-100 transition-all dark:-rotate-90"
            size={16}
          />
        </TabsTrigger>
        <TabsTrigger value="dark">
          <Moon
            // data-mode={theme === "dark" ? "light" : "dark"}
            data-mode={theme}
            className="rotate-90  transition-all dark:rotate-0 ease-in-out"
            size={16}
          />
        </TabsTrigger>
        <TabsTrigger value="system">
          <Laptop size={16} />
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
}
