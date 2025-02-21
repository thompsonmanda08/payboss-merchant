import React from "react";
import Image from "next/image";

import { Footer } from "@/components/containers/landing-page/footer";
import { DefaultCover } from "@/lib/constants";

async function AuthLayout({ children }) {
  return (
    <main className="ease-soft-in-out relative flex h-full min-h-screen flex-grow flex-col justify-between transition-all duration-200">
      <section>
        <div className="relative flex h-full flex-col items-center bg-center last:bg-cover md:px-5 md:pt-2">
          <div className="relative h-[300px] w-full overflow-clip bg-gray-900 md:h-[500px] md:rounded-4xl">
            <Image
              className="z-0 h-full w-full object-cover"
              unoptimized
              loading="lazy"
              src={DefaultCover}
              alt="Cover"
              width={1024}
              height={300}
            />
            <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-black/30 via-black/5 to-transparent"></div>
          </div>
          <div className="md:flex-0 z-10 mx-auto flex w-full shrink-0 flex-col px-4">
            {children}
          </div>
        </div>
      </section>
      <Footer showLinks={false} showLogo={false} />
    </main>
  );
}

export default AuthLayout;
