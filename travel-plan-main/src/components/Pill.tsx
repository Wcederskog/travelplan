import React from "react";

interface PillProps {
  text: string;
  color: string;
  className?: string;
}

const Pill: React.FC<PillProps> = ({ text, color, className }) => {
  let pillColor;
  switch (color) {
    case "red":
      pillColor = "bg-red-500";
      break;
    case "blue":
      pillColor = "bg-blue-400";
      break;
    case "green":
      pillColor = "bg-green-500";
      break;
    case "orange":
      pillColor = "bg-orange-500";
      break;
  }

  return (
    <div
      className={`${pillColor} ${className} px-2 py-1 rounded-full text-white`}
    >
      <p>{text}</p>
    </div>
  );
};

export default Pill;
