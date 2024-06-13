import { MapContainer } from "react-leaflet";
import MapContainerContent from "./MapContainerContent";
import { MapLocation, mapStartLocation } from "@/pages/travelplan";
import { Dispatch, SetStateAction } from "react";

import { Destination } from "../../../types";

interface MapProps {
  destinations: Destination[];
  mapLocation: MapLocation;
  setMapLocation: Dispatch<SetStateAction<MapLocation>>;
  categoryFilter: string[];
  selectedDestination: Destination | undefined;
}

const Map: React.FC<MapProps> = ({
  destinations,
  mapLocation,
  categoryFilter,
  setMapLocation,
  selectedDestination,
}) => {
  return (
    <>
      <div className="z-0 leaflet-container col-span-full shadow-lg">
        <MapContainer
          center={[
            mapStartLocation.coordinates.lat,
            mapStartLocation.coordinates.lng,
          ]}
          zoom={13}
          scrollWheelZoom={true}
          className="h-full "
        >
          <MapContainerContent
            mapLocation={mapLocation}
            setMapLocation={setMapLocation}
            destinations={destinations}
            categoryFilter={categoryFilter}
            selectedDestination={selectedDestination}
          />
        </MapContainer>
      </div>
    </>
  );
};

export default Map;
