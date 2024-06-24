import React, { useContext, useEffect, useState } from "react";
import { AnimatePresence, motion, stagger, useAnimate } from "framer-motion";
import NavItem from "./NavItem";
import MobileNavItem from "./MobileNavItem";
import Icon from "./Icon";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import { useDisclosure } from "@mantine/hooks";
import AuthenticationModal from "./authentication/AuthenticationModal";
import { LoginContext } from "@/pages/_app";
import { Modal, Popover, Select } from "@mantine/core";
import AccountModal from "./account/AccountModal";
import { useQuery } from "@tanstack/react-query";
import { Group } from "@prisma/client";

interface HeaderProps {}

export type Page = {
  title: string;
  subtitle: string;
  href: string;
  icon?: React.ReactNode;
};

type NavItem = {
  title: string;
  href?: string;
  pages?: Page[];
  hidden?: boolean;
};

const Header: React.FC<HeaderProps> = () => {
  const router = useRouter();
  const [groups, setGroups] = useState<Group[]>([]);
  const loginContext = useContext(LoginContext);

  const { isFetching, error, data } = useQuery({
    queryKey: ["groups"],
    queryFn: () => fetch("/api/get-groups").then((res) => res.json()),
  });

  useEffect(() => {
    if (data) {
      setGroups(data);
    }
  }, [data]);

  const links: NavItem[] = [
    { title: "Home", href: "/" },
    {
      title: "TravelPlan",
      pages: [
        {
          title: "How It Works",
          subtitle: "Learn how TravelPlan works",
          href: "/#how-it-works",
        },
        {
          title: "Contact",
          subtitle: "Contact us for support",
          href: "/#contact",
        },
        {
          title: "Why TravelPlan",
          subtitle: "See how TravelPlan diverges from other travel apps",
          href: "/#why-travelplan",
        },
        {
          title: "Feedback and Suggestions",
          subtitle: "Give us your feedback and suggestions",
          href: "/#feedback",
        },
      ],
    },
    {
      title: "My TravelPlan",
      href: "/travelplan",
      hidden: !loginContext.isLoggedIn,
    },
  ];

  const [activeDropdown, setActiveDropdown] = useState<NavItem | null>(null);
  const [hoverElement, setHoverElement] = useState<string | null>(null);
  const [mobileActiveDropdown, setMobileActiveDropdown] = useState(false);
  const [authModalOpened, authModalHandlers] = useDisclosure(false);
  const [accountTab, setAccountTab] = useState("");
  const [accountModalOpened, accountModalHandlers] = useDisclosure(false);
  const [activeGroupModalOpened, activeGroupModalHandlers] =
    useDisclosure(false);
  const scope = useMenuAnimation(mobileActiveDropdown);
  const staggerMenuItems = stagger(0.1, { startDelay: 0.7 });

  useEffect(() => {
    if (!loginContext.isLoggedIn) return;
    if (!groups.length) {
      loginContext.setActiveGroupId("solo");
    }
    if (!loginContext.activeGroupId && loginContext.activeGroupId !== null) {
      loginContext.setActiveGroupId("solo");
      activeGroupModalHandlers.open();
    }
  }, [activeGroupModalHandlers, loginContext, groups]);

  const Logout = async () => {
    loginContext.setName("");
    loginContext.setIsLoggedIn(false);
    loginContext.setActiveGroupId("");
    loginContext.setUserId("");

    const response = await fetch("/api/auth/logout", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    router.push("/");
  };

  function useMenuAnimation(isOpen: boolean) {
    const [scope, animate] = useAnimate();
    useEffect(() => {
      animate(
        "li",
        isOpen
          ? { opacity: 1, scale: 1, y: 0, x: 0, filter: "blur(0px)" }
          : { opacity: 0, scale: 1, y: 20, x: 0, filter: "blur(1px)" },
        {
          duration: 0.3,
          delay: isOpen ? staggerMenuItems : 0,
          ease: "easeOut",
        }
      );
    }, [isOpen, animate]);
    return scope;
  }

  const [popoverOpened, setPopoverOpened] = useState(false);

  return (
    <nav
      className="p-2 grid-responsive"
      onMouseLeave={() => setActiveDropdown(null)}
    >
      {/* Mobile */}
      <div className="flex justify-between md:hidden col-span-full">
        <Image
          alt="logo"
          height={46}
          width={46}
          src={require("../assets/images/travelplan-logo-mobile.png")}
        />
        <Icon
          variant="menu"
          color="secondary"
          onClick={() => setMobileActiveDropdown((v) => !v)}
        />
        <div
          ref={scope}
          onClick={() => setMobileActiveDropdown((v) => !v)}
          className={`fixed left-0 top-0 z-[100] flex md:hidden w-full flex-col overflow-hidden text-black transition-all duration-[800ms] ease-in-out ${
            mobileActiveDropdown ? "h-full" : "h-0"
          }`}
        >
          <div
            className={`${
              mobileActiveDropdown ? "opacity-100" : "opacity-0"
            } absolute right-5 top-5 cursor-pointer p-2 transition-opacity delay-300 duration-500 z-10`}
          ></div>
          <div className="relative flex flex-col space-y-10 justify-center h-full w-full items-center px-10 bg-bg-base">
            <ul className="w-full space-y-10">
              {links
                .filter((item) => !item.hidden)
                .map((item, i) => {
                  return (
                    <MobileNavItem
                      key={i}
                      href={item.href ?? ""}
                      title={item.title}
                      pages={item.pages}
                    />
                  );
                })}
            </ul>
          </div>
        </div>
      </div>
      {/* Desktop */}
      <div className="hidden md:flex flex-row h-16 justify-between items-center col-span-full">
        <div className="flex flex-row lg:gap-4">
          <Link className="mr-20" href="/">
            <Image
              alt="logo"
              width={190}
              src={require("../assets/images/travelplan-logo.png")}
            />
          </Link>
          {links
            .filter((item) => !item.hidden)
            .map((item, i) => {
              return (
                <div
                  key={i}
                  className="relative flex items-center"
                  onMouseEnter={() => setActiveDropdown(item)}
                >
                  <NavItem
                    title={item.title}
                    href={item.href ?? ""}
                    hoverActive={item.title === activeDropdown?.title}
                  />
                  {item.pages && activeDropdown?.title === item.title && (
                    <div
                      onMouseLeave={() => setActiveDropdown(null)}
                      className="z-[9999] absolute top-16 -left-6 bg-transparent "
                    >
                      <div className="drop-down-triangle" />
                      <AnimatePresence key={i} mode="wait">
                        <motion.div
                          className="bg-gray-100 origin-top shadow-md py-4 px-2 grid grid-cols-2 gap-2 border-b border-solid rounded-lg w-max"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: activeDropdown !== null ? 1 : 0 }}
                        >
                          {item.pages?.map((subItem, j) => (
                            <Link
                              href={subItem.href}
                              scroll={false}
                              key={j}
                              className={` ${
                                item.pages?.length === 2
                                  ? "col-span-2"
                                  : "col-span-1"
                              } py-3 px-4 rounded-lg h-full group hover:bg-bg-secondary cursor-pointer`}
                            >
                              <div className="flex-row flex items-center gap-2">
                                <span className=" group-hover:text-brand-purple-300">
                                  {subItem.icon}
                                </span>

                                <div className="flex-col items-center gap-1.5">
                                  <p className="text-md transition-all ">
                                    {subItem.title}
                                  </p>
                                  <p className="text-sm transition-all text-brand-purple-300">
                                    {subItem.subtitle}
                                  </p>
                                </div>
                              </div>
                            </Link>
                          ))}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              );
            })}
        </div>
        {loginContext.isLoggedIn ? (
          <Popover
            width={280}
            position="bottom"
            withArrow
            shadow="md"
            classNames={{ dropdown: "rounded-2xl" }}
            onChange={setPopoverOpened}
            opened={popoverOpened}
          >
            <Popover.Target>
              <button
                onClick={() => setPopoverOpened((v) => !v)}
                className="flex"
              >
                {loginContext.name} <Icon variant="arrow-down" />
              </button>
            </Popover.Target>
            <Popover.Dropdown p={0}>
              <ul className="flex flex-col p-2 justify-start text-sm text-slate-700">
                <li
                  className="cursor-pointer p-3 gap-2 flex flex-row rounded-xl hover:bg-[#F7F7F7]"
                  onClick={() => {
                    setAccountTab("settings");
                    setPopoverOpened(false);
                    accountModalHandlers.open();
                  }}
                >
                  <Icon variant="settings" size={20} color="gray-300" />
                  Account settings
                </li>
                <li
                  className="cursor-pointer p-3 gap-2 flex flex-row rounded-xl hover:bg-[#F7F7F7]"
                  onClick={() => {
                    setAccountTab("groups");
                    setPopoverOpened(false);
                    accountModalHandlers.open();
                  }}
                >
                  <Icon variant="user-group" size={20} color="gray-300" />
                  Groups
                </li>
                {!!groups.length && (
                  <li
                    className="cursor-pointer p-3 gap-2 flex flex-row rounded-xl hover:bg-[#F7F7F7]"
                    onClick={() => {
                      setPopoverOpened(false);
                      activeGroupModalHandlers.open();
                    }}
                  >
                    <Icon variant="user" size={20} color="gray-300" />
                    Active group
                    {loginContext.activeGroupId !== "solo" && (
                      <>
                        {" -"} (
                        {
                          groups?.find(
                            (group) => group.id === loginContext.activeGroupId
                          )?.name
                        }
                        )
                      </>
                    )}
                  </li>
                )}
                <div className="border-b border-solid my-2 border-gray-300"></div>
                <li
                  className="cursor-pointer p-3 gap-2 flex flex-row rounded-xl hover:bg-[#F7F7F7]"
                  onClick={() => Logout()}
                >
                  <Icon variant="logout" size={20} color="gray-300" />
                  Sign out{" "}
                </li>
              </ul>
            </Popover.Dropdown>
          </Popover>
        ) : (
          <div
            onMouseEnter={() => setHoverElement("sign-in")}
            onMouseLeave={() => setHoverElement(null)}
          >
            <div onClick={() => authModalHandlers.open()}>
              <NavItem
                title="Sign in"
                href={""}
                hoverActive={hoverElement === "sign-in"}
              />
            </div>
          </div>
        )}
      </div>
      <AuthenticationModal
        close={authModalHandlers.close}
        opened={authModalOpened}
      />
      <AccountModal
        close={accountModalHandlers.close}
        opened={accountModalOpened}
        setAccountTab={setAccountTab}
        accountTab={accountTab}
      />
      {!!groups.length && (
        <Modal
          classNames={{
            title: "text-3xl ",
            content: "rounded-lg",
          }}
          title="Destinations"
          closeOnClickOutside={true}
          opened={activeGroupModalOpened}
          onClose={activeGroupModalHandlers.close}
        >
          <p>
            Do you want to see your solo destinations or your group destinations{" "}
          </p>
          <Select
            className="mt-4"
            data={groups?.map((group) => ({
              value: group.id,
              label: group.name,
            }))}
            classNames={{
              input: "focus-within:border-brand-purple-300",
            }}
            onChange={(value) => loginContext.setActiveGroupId(value ?? "")}
            label="Select group"
          />
          {loginContext.activeGroupId !== "solo" &&
            loginContext.activeGroupId &&
            groups?.find(
              (group) => group.id === loginContext.activeGroupId
            ) && (
              <div className="text-gray-600 text-sm mt-2">
                Active group:{" "}
                <span className="text-brand-bg-base">
                  {
                    groups?.find(
                      (group) => group.id === loginContext.activeGroupId
                    )?.name
                  }
                </span>
              </div>
            )}
          <div className="flex flex-row items-center justify-center text-xs gap-6 mt-6">
            <button
              onClick={() => {
                loginContext.setActiveGroupId("solo");
                activeGroupModalHandlers.close();
              }}
              className="button-default h-fit"
            >
              My own destinations
            </button>
            <button
              disabled={
                !loginContext.activeGroupId ||
                loginContext.activeGroupId === "solo"
              }
              onClick={() => activeGroupModalHandlers.close()}
              className="button-reversed h-9 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Group destinations
            </button>
          </div>
        </Modal>
      )}
    </nav>
  );
};

export default Header;
