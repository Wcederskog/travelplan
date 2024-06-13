import { countries } from "@/assets/countries";
import { Loader, LoadingOverlay, RangeSlider, Select } from "@mantine/core";
import { Dispatch, SetStateAction, useState } from "react";
import Destinations from "./Destinations";

import { MapLocation } from "@/pages/travelplan";
import { Destination } from "../../../types";
import Icon from "../Icon";

interface SuggestionSectionProps {
  setMapPosition: Dispatch<SetStateAction<MapLocation>>;
  setSelectedDestination: Dispatch<SetStateAction<Destination | undefined>>;
  selectedDestination: Destination | undefined;
}

const SuggestionSection: React.FC<SuggestionSectionProps> = ({
  setMapPosition,
  setSelectedDestination,
  selectedDestination,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionsChatGPT, setSuggestionsChatGPT] = useState<Destination[]>(
    []
  );
  const [formData, setFormData] = useState({
    selectedDestination: "",
    numberOfPeople: "",
    ageRange: [0, 65],
    priceRange: [0, 500],
    additionalInfo: "",
  });

  const handleFormData = (type: keyof typeof formData, value: any) => {
    setFormData({
      ...formData,
      [type]: value,
    });
  };
  async function handleSubmit() {
    setIsLoading(true);
    try {
      const response = await fetch("/api/chatgpt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();

      setSuggestionsChatGPT(data.recommendations);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch recommendations:", error);
      setIsLoading(false);
    }
  }

  return (
    <>
      {suggestionsChatGPT.length <= 0 && (
        <div className="max-h-[500px] relative sm:max-h-full h-full flex flex-col gap-4 p-4 overflow-y-scroll overflow-x-hidden">
          <LoadingOverlay
            visible={isLoading}
            transitionProps={{ duration: 300 }}
            loaderProps={{ children: <Loader color="#280F63" type="dots" /> }}
          />

          <>
            <div>
              <h5 className="py-2">Destination</h5>
              <div className="flex gap-3">
                <Select
                  placeholder="Country / City"
                  onChange={(value) =>
                    handleFormData("selectedDestination", value)
                  }
                  data={Object.entries(countries).map((country) => ({
                    value: country[1].name,
                    label: country[1].name,
                  }))}
                  searchable
                  value={formData.selectedDestination}
                />
              </div>
            </div>
            <div>
              <h5 className="py-2">Number of people</h5>
              <Select
                label="How many people for the attraction?"
                placeholder="Persons"
                data={[
                  { group: "Alone", items: ["Traveling alone"], value: "1" },
                  { group: "Small groups", items: ["2", "3", "4"] },
                  { group: "Bigger groups", items: ["5", "6", "7"] },
                  { group: "Large groups", items: ["8", "9", "+10"] },
                ]}
                onChange={(value) => handleFormData("numberOfPeople", value)}
                value={formData.numberOfPeople}
              />
            </div>
            <div>
              <h5>Ages</h5>
              <RangeSlider
                classNames={{
                  bar: "bg-brand-purple-300",
                  thumb: "bg-white border- border-brand-purple-300",
                }}
                className="py-4 "
                minRange={1}
                min={0}
                max={65}
                marks={[
                  { value: 0, label: "0" },
                  { value: 65, label: "65+" },
                ]}
                onChange={(value) => handleFormData("ageRange", value)}
                value={[formData.ageRange[0], formData.ageRange[1]]}
              />
            </div>
            <div>
              <h5 className="">Pricepoint per person</h5>
              <RangeSlider
                classNames={{
                  bar: "bg-brand-purple-300",
                  thumb: "bg-white border- border-brand-purple-300",
                }}
                className="py-4"
                label={(value) => value + " $"}
                min={0}
                max={500}
                minRange={0}
                marks={[
                  { value: 0, label: "0$" },

                  { value: 500, label: "+500$" },
                ]}
                onChange={(value) => handleFormData("priceRange", value)}
                value={[formData.priceRange[0], formData.priceRange[1]]}
              />
            </div>
            <div>
              <h5 className="py-2">Additional information</h5>
              <textarea
                className="border-[2px] p-2 border-brand-purple-300 rounded-lg w-full h-32"
                placeholder="Provide extra information if needed"
                onChange={(e) =>
                  handleFormData("additionalInfo", e.target.value)
                }
                value={formData.additionalInfo}
              />
            </div>

            <button
              onClick={() => handleSubmit()}
              className="button-default text-sm mx-auto !w-full"
            >
              Get suggestions
            </button>
          </>
        </div>
      )}
      {suggestionsChatGPT.length > 0 && (
        <>
          <div
            className="cursor-pointer p-2"
            onClick={() => setSuggestionsChatGPT([])}
          >
            <Icon variant="arrow-left" className="text-brand-purple-300" />{" "}
          </div>
          <Destinations
            existingDestination={false}
            destinations={suggestionsChatGPT}
            setMapPosition={setMapPosition}
            selectedDestination={selectedDestination}
            setSelectedDestination={setSelectedDestination}
          />
        </>
      )}
    </>
  );
};
export default SuggestionSection;
