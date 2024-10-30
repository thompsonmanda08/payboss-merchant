import React from "react";
import Image from "next/image";

const partners = [
  [
    { name: "Google", logo: "/images/google.svg" },
    { name: "Microsoft", logo: "/images/microsoft.svg" },
    { name: "Facebook", logo: "/images/facebook.svg" },
    { name: "Spotify", logo: "/images/spotify.svg" },
  ],
];

function PartnerLogos() {
  return (
    <div className="mt-36 lg:mt-44">
      <p className="font-display text-base text-foreground/90">
        Trusted by these six companies so far
      </p>
      <ul
        role="list"
        className="mt-8 flex items-center justify-center gap-x-8 sm:flex-col sm:gap-x-0 sm:gap-y-10 xl:flex-row xl:gap-x-12 xl:gap-y-0"
      >
        {partners.map((group, groupIndex) => (
          <li key={groupIndex}>
            <ul
              role="list"
              className="flex flex-col items-center gap-y-8 sm:flex-row sm:gap-x-12 sm:gap-y-0"
            >
              {group.map((company) => (
                <li key={company.name} className="flex">
                  <Image
                    src={company.logo}
                    alt={company.name || "company logo"}
                    unoptimized
                  />
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default PartnerLogos;
