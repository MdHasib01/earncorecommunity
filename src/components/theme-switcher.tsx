"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { el } from "date-fns/locale";

export function ThemeSwitcher() {
  const { resolvedTheme } = useTheme();

  return (
    <div>
      {resolvedTheme === "dark" ? (
        <span className="flex gap-2 items-center cursor-pointer w-full">
          <Sun /> Set to Light mode
        </span>
      ) : (
        <span className="flex gap-2 items-center cursor-pointer w-full">
          <Moon />
          Set to dark mode
        </span>
      )}
    </div>
  );
}
