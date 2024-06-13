import UserGroupIcon from "@/assets/icons/user-group";
import ArrowLeft from "../assets/icons/arrow-left";
import UserIcon from "@/assets/icons/user";
import MenuIcon from "@/assets/icons/menu";
import Global from "@/assets/icons/global";
import FilterIcon from "@/assets/icons/Filter";
import Calendar from "@/assets/icons/calendar";
import Edit from "@/assets/icons/edit";
import Logout from "@/assets/icons/logout";
import ArrowDown from "@/assets/icons/arrow-down";
import { SettingsIcon } from "@/assets/icons/settings";

// import { colors } from "../../tailwind.config";

export type IconVariant =
  | "arrow-left"
  | "user"
  | "user-group"
  | "menu"
  | "filter"
  | "calendar"
  | "edit"
  | "globe"
  | "logout"
  | "arrow-down"
  | "settings";

interface IconProps {
  variant: IconVariant;
  color?: string;
  size?: number;
  onClick?: () => void;
  className?: string;
}
const Icon: React.FC<IconProps> = ({
  variant,
  color,
  size = 24,
  onClick,
  className,
  ...restProps
}) => {
  switch (variant) {
    case "arrow-left":
      return (
        <ArrowLeft
          width={size}
          height={size}
          color={color ?? "base"}
          onClick={onClick}
          className={`${onClick ? "cursor-pointer" : ""} ${className}`}
          {...restProps}
        />
      );
    case "settings":
      return (
        <SettingsIcon
          width={size}
          height={size}
          color={color ?? "base"}
          onClick={onClick}
          className={`${onClick ? "cursor-pointer" : ""} ${className}`}
          {...restProps}
        />
      );
    case "user":
      return (
        <UserIcon
          width={size}
          height={size}
          color={color ?? "base"}
          onClick={onClick}
          className={`${onClick ? "cursor-pointer" : ""} ${className}`}
          {...restProps}
        />
      );
    case "user-group":
      return (
        <UserGroupIcon
          width={size}
          height={size}
          color={color ?? "base"}
          onClick={onClick}
          className={`${onClick ? "cursor-pointer" : ""} ${className}`}
          {...restProps}
        />
      );
    case "menu":
      return (
        <MenuIcon
          width={size}
          height={size}
          color={color ?? "base"}
          onClick={onClick}
          className={`${onClick ? "cursor-pointer" : ""} ${className}`}
          {...restProps}
        />
      );
    case "filter":
      return (
        <FilterIcon
          width={size}
          height={size}
          color={color ?? "base"}
          onClick={onClick}
          className={`${onClick ? "cursor-pointer" : ""} ${className}`}
          {...restProps}
        />
      );
    case "globe":
      return (
        <Global
          width={size}
          height={size}
          color={color ?? "base"}
          onClick={onClick}
          className={`${onClick ? "cursor-pointer" : ""} ${className}`}
          {...restProps}
        />
      );
    case "calendar":
      return (
        <Calendar
          width={size}
          height={size}
          color={color ?? "base"}
          onClick={onClick}
          className={`${onClick ? "cursor-pointer" : ""} ${className}`}
          {...restProps}
        />
      );
    case "edit":
      return (
        <Edit
          width={size}
          height={size}
          color={color ?? "base"}
          onClick={onClick}
          className={`${onClick ? "cursor-pointer" : ""} ${className}`}
          {...restProps}
        />
      );
    case "logout":
      return (
        <Logout
          width={size}
          height={size}
          color={color ?? "base"}
          onClick={onClick}
          className={`${onClick ? "cursor-pointer" : ""} ${className}`}
          {...restProps}
        />
      );
    case "arrow-down":
      return (
        <ArrowDown
          width={size}
          height={size}
          color={color ?? "base"}
          onClick={onClick}
          className={`${onClick ? "cursor-pointer" : ""} ${className}`}
          {...restProps}
        />
      );

    default:
      throw new Error("Invalid icon variant");
  }
};

export default Icon;
