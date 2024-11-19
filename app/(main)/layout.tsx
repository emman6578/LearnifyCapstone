import type { PropsWithChildren } from "react";

import { MobileHeader } from "@/components/mobile-header";
import { Sidebar } from "@/components/sidebar";

const MainLayout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <MobileHeader />
      <main className="relative h-full pt-[50px] lg:pl-[256px] lg:pt-0">
        {/* Background image with opacity */}
        <div className="absolute inset-0 bg-[url('/kids.jpg')] bg-cover bg-center opacity-50"></div>
        <div className="relative mx-auto h-full max-w-[1056px] pt-6">
          {children}
          <Sidebar className="hidden lg:flex" />
        </div>
      </main>
    </>
  );
};

export default MainLayout;
