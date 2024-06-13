import { Dispatch, SetStateAction } from "react";

import { MapLocation } from "@/pages/travelplan";
import moment from "moment";
import { Destination } from "../../../types";
import { useDisclosure } from "@mantine/hooks";
import AddDestinationPopup from "./AddDestinationPopup";
import Edit from "@/assets/icons/edit";
import Pill from "../Pill";
import { Loader } from "@mantine/core";

interface DestinationsProps {
  setMapPosition: Dispatch<SetStateAction<MapLocation>>;
  destinations: Destination[];
  setSelectedDestination: Dispatch<SetStateAction<Destination | undefined>>;
  selectedDestination: Destination | undefined;
  existingDestination: boolean;
  isLoading?: boolean;
}

const Destinations: React.FC<DestinationsProps> = ({
  setMapPosition,
  destinations,
  setSelectedDestination,
  selectedDestination,
  existingDestination,
  isLoading,
}) => {
  const [opened, { open, close }] = useDisclosure(false);

  const destinationsSortedByDate = destinations.sort((a, b) => {
    return moment(a.dateFrom).diff(moment(b.dateFrom));
  });
  return (
    <>
      <div className="overflow-y-scroll max-h-[500px] flex-1 sm:max-h-full h-full">
        {isLoading && (
          <div className="w-full">
            <Loader className="mx-auto " color="black" type="dots" size={48} />
          </div>
        )}
        {!isLoading &&
          destinationsSortedByDate.map((destination, i) => (
            <div
              key={i}
              onClick={() => {
                setMapPosition({
                  coordinates: { lat: destination.lat, lng: destination.lng },
                  type: "attraction",
                  customZoom: 17,
                });
                setSelectedDestination(destination);
              }}
              className={`flex justify-between shadow-sm py-2 px-3 cursor-pointer  border-b border-gray-100 ${
                destination.lat === selectedDestination?.lat
                  ? "bg-brand-purple-300 text-white "
                  : "hover:bg-[#F7F7F7]"
              }`}
            >
              <div className="flex text-xs justify-between flex-col w-full">
                <div
                  className={`flex gap-1 justify-between items-center ${
                    destination.lat === selectedDestination?.lat
                      ? " text-white "
                      : ""
                  }`}
                >
                  <h5>{destination.title}</h5>
                  {!existingDestination ? (
                    <button
                      onClick={open}
                      className={`button-reversed m-2 z-50 ${
                        destination.lat === selectedDestination?.lat &&
                        "!from-slate-300 !to-white !text-brand-purple-400 hover:!from-slate-100 hover:!to-white "
                      }`}
                    >
                      Add
                    </button>
                  ) : (
                    <button
                      onClick={open}
                      className={`button-reversed z-50  ${
                        destination.lat === selectedDestination?.lat &&
                        "!from-slate-300 !to-white !text-brand-purple-400 hover:!from-slate-100 hover:!to-white "
                      }`}
                    >
                      <Edit
                        height={12}
                        width={12}
                        color={`${
                          destination.lat === selectedDestination?.lat
                            ? "#280F63"
                            : "white"
                        }`}
                      />
                    </button>
                  )}
                </div>
                <p
                  className={`text-xs md:text-sm w-4/5 ${
                    destination.lat === selectedDestination?.lat
                      ? "text-brand-purple-100"
                      : "text-gray-500"
                  }`}
                >
                  {destination.description}
                </p>
                <div
                  className={`flex gap-1 justify-between mt-3 flex-wrap-reverse ${
                    destination.lat === selectedDestination?.lat
                      ? "text-white"
                      : "text-brand-purple-300"
                  } `}
                >
                  {existingDestination && (
                    <div className="flex flex-row gap-2">
                      {destination.mandatory && (
                        <Pill color="red" text="Mandatory" />
                      )}
                      {destination.price && (
                        <Pill color="orange" text={`${destination?.price}$`} />
                      )}
                      {destination.groupEvent && (
                        <Pill color="blue" text="Group event" />
                      )}
                    </div>
                  )}

                  {destination.dateFrom && (
                    <div className="flex flex-row justify-between ">
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
              </div>
            </div>
          ))}
      </div>
      {opened && (
        <AddDestinationPopup
          existingDestination={existingDestination}
          opened={opened}
          close={close}
          selectedDestination={selectedDestination}
        />
      )}
    </>
  );
};

export default Destinations;
