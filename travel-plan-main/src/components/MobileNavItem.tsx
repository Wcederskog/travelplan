import Link from "next/link";
import React, { useState } from "react";
import { Page } from "./Header";
import AnimateHeight from "./AnimateHeight";

interface MobileNavItemProps {
  href: string;
  title: string;
  pages?: Page[];
}

const MobileNavItem: React.FC<MobileNavItemProps> = ({
  href,
  title,
  pages,
}) => {
  const [hidden, setHidden] = useState<boolean>(true);

  return (
    <li
      onClick={(e) => {
        if (href === "") {
          e.stopPropagation();
          setHidden((v) => !v);
        }
      }}
      className="w-full list-none"
    >
      <Link
        href={href}
        className={`text-[28px] flex flex-row w-full items-center gap-3 text-fg-base `}
      >
        <p className="duration-300 font-medium">{title}</p>
      </Link>
      <AnimateHeight isVisible={!hidden}>
        <div className="mt-5 flex w-full flex-col space-y-5 text-fg-base/80 text-lg">
          {pages?.map((item, i) => {
            return (
              <Link key={i} href={item.href}>
                {item.title}
              </Link>
            );
          })}
        </div>
      </AnimateHeight>
    </li>
  );
};

export default MobileNavItem;
