import { Button } from "@prenoms/ui/components/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@prenoms/ui/components/dropdown-menu";
import { Moon, Sun } from "lucide-react";
import { css } from "styled-system/css";

import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun
            className={css({
              width: "1.2rem",
              height: "1.2rem",
              transition: "all",
              _dark: { display: "none" },
            })}
          />
          <Moon
            className={css({
              width: "1.2rem",
              height: "1.2rem",
              display: "none",
              transition: "all",
              _dark: { display: "block" },
            })}
          />
          <span className={css({ srOnly: true })}>Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem value="light" onSelect={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem value="dark" onSelect={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem value="system" onSelect={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
