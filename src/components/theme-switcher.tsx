"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSwitcher() {
  const { setTheme, resolvedTheme } = useTheme();

  return (
    <div>
      {resolvedTheme === "dark" ? (
        <span
          className="flex gap-2 items-center cursor-pointer w-full"
          onClick={() => setTheme("light")}
        >
          <Sun /> Set to Light mode
        </span>
      ) : (
        <span
          className="flex gap-2 items-center cursor-pointer w-full"
          onClick={() => setTheme("dark")}
        >
          <Moon />
          Set to dark mode
        </span>
      )}
    </div>
  );
}
