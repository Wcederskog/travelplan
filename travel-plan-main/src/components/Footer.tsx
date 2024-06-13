import Image from "next/image";
import Link from "next/link";
import React from "react";

interface FooterProps {}

export type Page = {
  title: string;
  href: string;
};

type FooterItem = {
  title: string;
  pages?: Page[];
};

const Footer: React.FC<FooterProps> = ({}) => {
  const links: FooterItem[] = [
    {
      title: "Travel Plan",
      pages: [
        {
          title: "Map",
          href: "/travelplan",
        },
        {
          title: "Travel suggestions",
          href: "/suggestions",
        },
        {
          title: "Feature request",
          href: "/",
        },
      ],
    },
    {
      title: "About",
      pages: [
        {
          title: "Company",
          href: "/",
        },
        {
          title: "Contact",
          href: "/",
        },
        {
          title: "Privacy policy",
          href: "/",
        },
        {
          title: "Legal",
          href: "/",
        },
      ],
    },
  ];

  return (
    <footer
      id="contact"
      className="grid-responsive mt-28 pb-10 !gap-y-32  pt-24 text-white rounded-t-xl md:rounded-t-2xl relative bg-gradient-to-b from-brand-purple-500 to-brand-purple-400"
    >
      <div id="feedback" />
      {links.map((item) => (
        <div key={item.title} className="col-span-3 flex flex-col gap-5">
          <h3 className="text-xl font-bold">{item.title}</h3>

          {item.pages?.map((page) => (
            <div key={page.title}>
              <Link className="cursor-pointer font-medium" href={page.href}>
                {page.title}
              </Link>
            </div>
          ))}
        </div>
      ))}
      <div className="col-span-full flex flex-col gap-3 text-center">
        <h4>TravelPlan</h4>
        <p className="text-md font-semibold">
          © 2024 TravelPlan. All rights reserved
        </p>
      </div>
      <div className=" absolute  top-0 w-full flex justify-center">
        <div className="bg-white px-1.5 pb-1 relative w-12 h-12">
          <div className="absolute inset-0 bg-brand-purple-500 w-full h-full rounded-tr-3xl"></div>
        </div>
        <div className="bg-white rounded-b-3xl px-10 pt-4 pb-3 h-full">
          <Image
            className="m-auto"
            alt="logo"
            src={require("../assets/images/travelplan-logo.png")}
            width={120}
            height={120}
          />
        </div>
        <div className="bg-white px-1.5 pb-1 relative w-12 h-12">
          <div className="absolute inset-0 bg-brand-purple-500 w-full h-full rounded-tl-3xl"></div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
