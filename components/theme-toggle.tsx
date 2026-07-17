"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  // نتجنّب أي اختلاف بين الخادم والعميل بانتظار تركيب المكوّن أولاً
  React.useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" aria-hidden className="opacity-0">
        <Sun className="h-4 w-4" />
      </Button>
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label={isDark ? "التبديل إلى الوضع النهاري" : "التبديل إلى الوضع الليلي"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      {isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
    </Button>
  );
}
