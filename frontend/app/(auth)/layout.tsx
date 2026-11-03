import type { ReactNode } from "react";

import ThemeSwitcher from "@/components/theme/theme-switcher";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="fixed right-4 top-4 z-50">
        <ThemeSwitcher />
      </div>
      {children}
    </>
  );
}
