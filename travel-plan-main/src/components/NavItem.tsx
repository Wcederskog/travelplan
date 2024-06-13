import { motion } from "framer-motion";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

interface NavItemProps {
  href: string;
  title: string;
  hoverActive?: boolean;
}

const NavItem: React.FC<NavItemProps> = ({ href, title, hoverActive }) => {
  const router = useRouter();
  const [isVisited, setIsVisited] = useState(false);

  useEffect(() => {
    setIsVisited(router.pathname === href);
  }, [router.pathname, href]);

  return (
    <div
      onClick={() => router.push(href)}
      className="flex flex-col select-none cursor-pointer items-center gap-1 rounded-md px-2.5 py-2 text-black text-sm lg:text-lg font-medium"
    >
      <p>{title}</p>
      <motion.div
        initial={{ width: 0 }}
        animate={{
          width: isVisited ? "100%" : hoverActive ? "100%" : 0,
          transition: { duration: isVisited ? 0 : 0.3 },
        }}
        className={`h-[3px] rounded-xl bg-brand-purple-300`}
      />
    </div>
  );
};

export default NavItem;
