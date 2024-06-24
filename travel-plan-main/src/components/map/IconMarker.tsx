import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCameraRetro,
  faBuildingColumns,
  faPalette,
  faHotel,
  faBed,
  faPhotoFilm,
  faStar,
  faFishFins,
  faMagicWandSparkles,
  faUser,
  faStreetView,
} from "@fortawesome/free-solid-svg-icons";

export type IconMarkerVariant =
  | "sights"
  | "museum"
  | "artwork"
  | "camera-retro"
  | "gallery"
  | "hotel"
  | "hostel"
  | "aquarium"
  | "attraction"
  | "gpt"
  | "user";

interface IconProps {
  variant: IconMarkerVariant;
  color?: string;
  size?: number;
}
const IconMarker: React.FC<IconProps> = ({
  variant,
  color,
  size = 24,
  ...restProps
}) => {
  let icon;
  switch (variant) {
    case "sights":
      icon = faStreetView;
      break;
    case "museum":
      icon = faBuildingColumns;
      break;
    case "artwork":
      icon = faPalette;
      break;
    case "hotel":
      icon = faHotel;
      break;
    case "hostel":
      icon = faBed;
      break;
    case "gallery":
      icon = faPhotoFilm;
      break;
    case "attraction":
      icon = faStar;
      break;
    case "aquarium":
      icon = faFishFins;
      break;
    case "gpt":
      icon = faMagicWandSparkles;
      break;
    case "user":
      icon = faUser;
      break;

    default:
      icon = faCameraRetro;
      break;
  }
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
      <path
        d="M384 192c0 87.4-117 243-168.3 307.2c-12.3 15.3-35.1 15.3-47.4 0C117 435 0 279.4 0 192C0 86 86 0 192 0S384 86 384 192z"
        fill={color}
      />

      <FontAwesomeIcon
        x="18%"
        y="15%"
        width={242}
        height={242}
        color={"white"}
        {...restProps}
        icon={icon}
      />
    </svg>
  );
};
export default IconMarker;
