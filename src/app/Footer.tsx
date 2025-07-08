"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ApiHelper from "./ApiHelper";
import { FooterDataProps } from "@/types/footer";
import Link from "next/link";

export default function Footer() {
  const [footerData, setFooterData] = useState<FooterDataProps>({});

  useEffect(() => {
    const getFooter = async () => {
      let url = "footer";
      url += "?populate[0]=links_category.links";
      url += "&populate[1]=links_category.links.img";
      url += "&populate[2]=footer_main";
      url += "&populate[3]=footer_main.img";
      url += "&populate[4]=social_network_links";
      url += "&populate[5]=social_network_links.img";

      const { data } = await ApiHelper(url, "GET");
      if (data) {
        setFooterData(data);
      }
    };

    getFooter();
  }, []);

  return (
    <footer className="w-full bg-[#303028] mt-auto">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-start gap-8">
        {"links_category" in footerData && footerData.links_category?.[0] && (
          <section className="w-full md:w-1/4 order-2 md:order-1 text-center md:text-left md:self-center">
            {footerData.links_category[0]?.category && (
              <p className="font-semibold mb-4 text-xl text-white">
                {footerData.links_category[0].category}
              </p>
            )}
            <ul className="space-y-2">
              {footerData.links_category[0].links.map((link) => (
                <li key={link.id}>
                  <a href={link.url} className="text-[#F6B99C]">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
        <section className="w-full md:w-2/4 order-1 md:order-2">
          {"footer_main" in footerData && footerData.footer_main && (
            <div className="flex flex-col items-center gap-10">
              <Image
                src={"http://localhost:1337" + footerData.footer_main.img.url}
                alt="logo"
                width={200}
                height={200}
                objectFit="cover"
                priority
              />
              <p className="text-center text-[#D6D0C2] text-base">
                {footerData.footer_main.description}
              </p>
            </div>
          )}
          {"social_network_links" in footerData &&
            footerData.social_network_links && (
              <div className="text-center mt-10">
                <ul className="flex justify-center gap-4">
                  {footerData.social_network_links.map((link) => (
                    <li key={link.id}>
                      <div className="rounded-full border border-white box-content inline-block">
                        <a
                          href={link.url}
                          className="block w-8 h-8 transition-all duration-300 ease-in-out rounded-full bg-no-repeat bg-center filter brightness-0 invert hover:[filter:invert(48%)_sepia(85%)_saturate(2229%)_hue-rotate(318deg)_brightness(100%)_contrast(101%)] hover:bg-white/10"
                          style={{
                            backgroundImage: `url(http://localhost:1337${link.img.url})`,
                            backgroundSize: "20px 20px",
                            transition: "all 300ms ease 0ms",
                          }}
                        >
                          <span className="sr-only">
                            {link.img.alternativeText}
                          </span>
                        </a>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
        </section>
        {"links_category" in footerData && footerData.links_category?.[1] && (
          <section className="w-full md:w-1/4 order-3 text-center md:text-right md:self-center">
            {footerData.links_category[1]?.category && (
              <p className="font-semibold mb-4 text-xl text-white">
                {footerData.links_category[1].category}
              </p>
            )}
            <ul className="space-y-2">
              {footerData.links_category[1].links.map((link) => (
                <li key={link.id}>
                  <a href={link.url} className="text-[#F6B99C]">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      <div className="container mx-auto px-4 py-6 text-center text-white text-sm border-t border-white/10 mt-10">
        <p className="text-base">
          2025 © AUDELWEISS Craft – Site réalisé par{" "}
          <Link href="https://audelweiss.com" className="underline">
            Audrey HOSSEPIAN
          </Link>
        </p>
      </div>
    </footer>
  );
}
