import { MapLocation } from "@/pages/travelplan";
import { Dispatch, SetStateAction, useState } from "react";
import SuggestionSection from "./SuggestionSection";
import Destinations from "./Destinations";
import { Destination } from "../../../types";

interface MapSideNavProps {
  setMapPosition: Dispatch<SetStateAction<MapLocation>>;
  destinations: Destination[];
  selectedDestination: Destination | undefined;
  setSelectedDestination: Dispatch<SetStateAction<Destination | undefined>>;
  isLoading?: boolean;
}

const MapSideNav: React.FC<MapSideNavProps> = ({
  setMapPosition,
  destinations,
  selectedDestination,
  setSelectedDestination,
  isLoading,
}) => {
  const [selectedTab, setSelectedTab] = useState("destinations");

  return (
    <div className="col-span-4 flex flex-col shadow-lg mt-8 md:mt-0 h-full row-span-3 overflow-hidden md:rounded-none rounded-lg">
      <div className="flex justify-between">
        <h5
          onClick={() => setSelectedTab("destinations")}
          className={`text-white p-5 cursor-pointer w-1/2 text-center transition-color duration-300 ${
            selectedTab === "destinations"
              ? "text-gray-500 bg-brand-purple-300"
              : " bg-brand-purple-200 text-gray-600 hover:bg-brand-purple-100"
          }`}
        >
          Destinations
        </h5>
        <h5
          onClick={() => setSelectedTab("suggestionsForm")}
          className={`text-white md:rounded-tr-lg p-5 cursor-pointer w-1/2 text-center transition-color duration-300 ${
            selectedTab === "suggestionsForm" || selectedTab === "suggestions"
              ? "text-gray-500 bg-brand-purple-300"
              : " bg-brand-purple-200 text-gray-600 hover:bg-brand-purple-100"
          }`}
        >
          Suggestions
        </h5>
      </div>
      {selectedTab === "destinations" && (
        <Destinations
          existingDestination={true}
          destinations={destinations}
          setSelectedDestination={setSelectedDestination}
          selectedDestination={selectedDestination}
          setMapPosition={setMapPosition}
          isLoading={isLoading}
        />
      )}
      {selectedTab === "suggestionsForm" && (
        <SuggestionSection
          setSelectedDestination={setSelectedDestination}
          selectedDestination={selectedDestination}
          setMapPosition={setMapPosition}
        />
      )}
    </div>
  );
};

export default MapSideNav;
