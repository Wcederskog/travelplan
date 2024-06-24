import { MapLocation, locationCategories } from "@/pages/travelplan";

import { Dispatch, SetStateAction, useEffect, useMemo, useState } from "react";
import { TileLayer, Marker, Popup, useMap, useMapEvents } from "react-leaflet";
import { useDebouncedValue } from "@mantine/hooks";
import ReactDOMServer from "react-dom/server";
import { DivIcon } from "leaflet";
import IconMarker, { IconMarkerVariant } from "./IconMarker";
import { useDisclosure } from "@mantine/hooks";
import { Destination, OverpassElement } from "../../../types";
import AddDestinationPopup from "./AddDestinationPopup";
import moment from "moment";

interface MapContainerContentProps {
  destinations: Destination[];
  mapLocation: MapLocation;
  setMapLocation: Dispatch<SetStateAction<MapLocation>>;
  categoryFilter: string[];
  selectedDestination: Destination | undefined;
}

const MapContainerContent: React.FC<MapContainerContentProps> = ({
  destinations,
  mapLocation,
  categoryFilter,
  setMapLocation,
  selectedDestination,
}) => {
  const map = useMap();

  useEffect(() => {
    if (mapLocation && mapLocation.coordinates) {
      map.closePopup();
      map.setView(
        mapLocation.coordinates,
        mapLocation.customZoom
          ? mapLocation.customZoom
          : mapLocation.type === "country"
          ? 5
          : 13
      );
    }
  }, [mapLocation]);

  const [overpassData, setOverpassData] = useState<OverpassElement[]>([]);
  const [selectedOverpassData, setSelectedOverpassData] =
    useState<OverpassElement>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("/api/overpass", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: `
          [out:json];
          node["tourism"~"^(${locationCategories
            .flatMap((item) => item.value.split(","))
            .join("|")})$"](around:1000,${mapLocation?.coordinates?.lat},${
              mapLocation?.coordinates?.lng
            });
          out body;
        `,
          }),
        });
        const result = await response.json();
        setOverpassData(result.elements);
      } catch (error) {
        console.error("Error fetching Overpass data:", error);
      }
    };

    fetchData();
  }, [mapLocation]);

  const filteredOverpassData = useMemo(
    () =>
      overpassData?.filter(
        (item) =>
          (!!categoryFilter.length
            ? categoryFilter.includes(item.tags.tourism)
            : true) && !!item.tags.name
      ) ?? [],
    [categoryFilter, overpassData]
  );

  const handleHasMovedEvent = () => {
    map.getZoom() > 10 ? setHasMoved(true) : setHasMoved(false);
    setRerender(false);
  };

  const mapEvents = useMapEvents({
    dragstart: () => {
      setRerender(true);
    },
    zoomstart: () => {
      setRerender(true);
    },
    dragend: handleHasMovedEvent,
    zoomend: () => {
      handleHasMovedEvent();
    },
  });

  const [hasMoved, setHasMoved] = useState(false);
  const [rerender, setRerender] = useState(false);
  const [opened, { open, close }] = useDisclosure(false);
  const [debounced] = useDebouncedValue(hasMoved, 1000);

  return (
    <>
      <div
        onClick={() => {
          setMapLocation({
            coordinates: map.getCenter(),
            type: "city",
            customZoom: map.getZoom(),
          });
          setHasMoved(false);
        }}
        className={`z-[999999] transition-all duration-500 absolute cursor-pointer font-bold ${
          hasMoved ? "translate-y-40" : "translate-y-0"
        } rounded-full bg-brand-orange-500 text-white text-lg font-nunito w-[175px] h-[40px] flex justify-center items-center border-[2px] border-brand-orange-700 hover:bg-brand-orange-300 hover:border-brand-orange-500 -top-28 -translate-x-1/2 left-1/2`}
      >
        Search here
      </div>
      <div
        className={`z-[-1] transition-all duration-100 absolute opacity-0 ${
          rerender ? "translate-y-1" : "translate-y-0"
        } bg-slate-100 w-[1px] h-[1px] top-10 -translate-x-1/2 left-1/2`}
      />

      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {filteredOverpassData
        .slice(1, 70)
        .filter(
          (item) =>
            !destinations.some(
              (destination) =>
                destination.lat === item.lat && destination.lng === item.lon
            )
        )
        .map((attraction, index) => {
          let iconVariant;
          let iconColor;
          switch (attraction.tags.tourism) {
            case "viewpoint":
              iconVariant = "viewpoint" as IconMarkerVariant;
              iconColor = "#1E90FF";
              break;
            case "museum":
              iconVariant = "museum" as IconMarkerVariant;
              iconColor = "#8B4513";
              break;
            case "artwork":
              iconVariant = "artwork" as IconMarkerVariant;
              iconColor = "#FF6347";
              break;
            case "hotel":
              iconVariant = "hotel" as IconMarkerVariant;
              iconColor = "#800080";
              break;
            case "hostel":
              iconVariant = "hostel" as IconMarkerVariant;
              iconColor = "#3CB371";
              break;
            case "gallery":
              iconVariant = "gallery" as IconMarkerVariant;
              iconColor = "#FF69B4";
              break;
            case "attraction":
              iconVariant = "attraction" as IconMarkerVariant;
              iconColor = "#20B2AA";
              break;
            case "aquarium":
              iconVariant = "aquarium" as IconMarkerVariant;
              iconColor = "#4682B4";
              break;
            default:
              iconVariant = "camera-retro" as IconMarkerVariant;
              iconColor = "#FFA500";
              break;
          }
          const iconHtml = ReactDOMServer.renderToString(
            <IconMarker variant={iconVariant} color={iconColor} />
          );
          return (
            <Marker
              key={index}
              position={[attraction.lat, attraction.lon]}
              icon={
                new DivIcon({
                  className: "bg-transparent",
                  html: iconHtml,
                  iconSize: map.getZoom() < 14 ? [14, 14] : [20, 20],
                })
              }
            >
              <Popup>
                <div className="flex flex-col justify-center items-center text-center  gap-4">
                  <h5>{attraction.tags.name}</h5>
                  <button
                    className="button-default "
                    onClick={() => {
                      setSelectedOverpassData(attraction);
                      open();
                    }}
                  >
                    Add to destinations
                  </button>
                </div>
              </Popup>
            </Marker>
          );
        })}

      {destinations.map((destination, i) => (
        <Marker
          key={i}
          position={[destination.lat, destination.lng]}
          icon={
            new DivIcon({
              className: "bg-transparent",
              html: ReactDOMServer.renderToString(
                <IconMarker
                  variant={"user"}
                  color={destination.user?.color ?? "black"}
                />
              ),
              iconSize: [30, 44],
            })
          }
          eventHandlers={{
            click: (e) => {
              e.target.openPopup();
            },
          }}
        >
          <Popup>
            <h5 className="text-center">{destination.title}</h5>
            <br /> {destination.description}
            <div className="flex flex-row justify-between">
              {destination?.user && <p>Created by: {destination.user.name}</p>}
              {destination.dateFrom && (
                <div className="flex flex-row items-center justify-center text-brand-purple-400">
                  <p>{moment(destination.dateFrom).format("HH:mm")}</p>
                  {destination.dateTo && (
                    <>
                      <span> - </span>
                      <p>{moment(destination.dateTo).format("HH:mm")}</p>
                    </>
                  )}
                </div>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
      {selectedDestination &&
        !destinations.some(
          (destination) =>
            destination.lat === selectedDestination.lat &&
            destination.lng === selectedDestination.lng
        ) && (
          <Marker
            position={[selectedDestination.lat, selectedDestination.lng]}
            icon={
              new DivIcon({
                className: "bg-transparent",
                html: ReactDOMServer.renderToString(
                  <IconMarker variant={"gpt"} color={"#F58634"} />
                ),
                iconSize: [30, 44],
              })
            }
          ></Marker>
        )}
      {opened && (
        <AddDestinationPopup
          opened={opened}
          close={close}
          selectedOverpassData={selectedOverpassData}
        />
      )}
    </>
  );
};

export default MapContainerContent;
