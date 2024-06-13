import { NextPage } from "next";
import Layout from "../containers/Layout";
import dynamic from "next/dynamic";
import { useDisclosure } from "@mantine/hooks";
import { useContext, useEffect, useMemo, useState } from "react";
import { Modal, MultiSelect, Popover, Select } from "@mantine/core";
import { countries } from "@/assets/countries";
import { DatePickerInput } from "@mantine/dates";
import moment from "moment";
import Icon from "@/components/Icon";
import { cities } from "@/assets/cities";
import { Destination, Group } from "../../types";
import MapSideNav from "@/components/map/MapSideNav";
import { LoginContext } from "./_app";
import { useRouter } from "next/router";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export interface MapLocation {
  coordinates: { lat: number; lng: number };
  type: "country" | "city" | "attraction";
  customZoom?: number;
}

export const locationCategories = [
  {
    label: "Sights",
    value: "viewpoint,artwork",
  },
  {
    label: "Attractions",
    value: "attraction,gallery,museum,theme_park,zoo,aquarium",
  },
  {
    label: "Accommodations",
    value: "hotel,motel,hostel,guest_house,apartment",
  },
];

export const mapStartLocation: MapLocation = {
  coordinates: { lat: 51.505, lng: -0.09 },
  type: "city",
};

const Map = dynamic(() => import("../components/map/Map"), { ssr: false });

const Index: NextPage = () => {
  const loginContext = useContext(LoginContext);
  const router = useRouter();

  const [destinations, setDestinations] = useState<Destination[]>([]);

  const { isFetching, error, data } = useQuery({
    queryKey: ["destinations"],
    queryFn: () =>
      fetch(
        `/api/get-destinations${
          loginContext.activeGroupId && loginContext.activeGroupId !== "solo"
            ? "?groupId=" + loginContext.activeGroupId
            : ""
        }`
      ).then((res) => (res.status === 401 ? router.push("/") : res.json())),
  });

  useEffect(() => {
    if (data) {
      setDestinations(data);
    }
  }, [data]);

  const queryClient = useQueryClient();

  useEffect(() => {
    if (loginContext.activeGroupId && loginContext.activeGroupId !== null) {
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
    }
  }, [loginContext.activeGroupId, queryClient]);

  const [mapLocation, setMapLocation] = useState<MapLocation>(mapStartLocation);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [categoryFilter, setCategoryFilter] = useState<string[]>([]);
  const [searched, setSearched] = useState<Boolean>(false);
  const [selectedDestination, setSelectedDestination] = useState<Destination>();

  useEffect(() => {
    setSelectedDestination(undefined);
  }, [loginContext.activeGroupId]);

  const combinedLocations = useMemo(
    () => [
      ...Object.entries(countries).map((country) => ({
        value: country[0],
        label: country[1].name,
        type: "country",
      })),
      ...Object.entries(cities).map((city) => ({
        value: city[0],
        label: city[1].name + " - " + city[1].country,
        type: "city",
      })),
    ],
    [countries, cities]
  );

  return (
    <>
      <Layout title="TravelPlan - Map">
        <>
          {data && (
            <section className="grid-responsive md:mb-28 md:mt-12 md:h-[700px] !gap-0">
              <div className="md:col-span-8 col-span-full p-4 rounded-tl-lg bg-brand-purple-300">
                <div className="flex gap-4 items-end">
                  <Select
                    leftSectionPointerEvents="none"
                    leftSection={<Icon variant="globe" size={18} />}
                    placeholder="Countries / Cities"
                    limit={searched ? 10 : 0}
                    data={combinedLocations.map((location) => ({
                      value: location.value,
                      label: location.label,
                    }))}
                    onSearchChange={() => setSearched((v) => !v)}
                    searchable
                    className="w-2/6"
                    classNames={{
                      input: "focus-within:border-brand-purple-300",
                    }}
                    onChange={(value) => {
                      if (!value) return;
                      const selectedLocation =
                        cities[value] ?? countries[value];
                      const selectedType = cities[value] ? "city" : "country";
                      setSelectedLocation(value);
                      setMapLocation({
                        coordinates: {
                          lat: selectedLocation.lat,
                          lng: selectedLocation.lon,
                        },
                        type: selectedType,
                      });
                    }}
                  />
                  <MultiSelect
                    leftSectionPointerEvents="none"
                    leftSection={<Icon variant="filter" size={18} />}
                    placeholder={categoryFilter.length > 0 ? "" : "Categories"}
                    data={locationCategories}
                    classNames={{
                      pill: "bg-brand-purple-300 text-white",
                      input: "focus-within:border-brand-purple-300",
                    }}
                    searchable
                    className="w-2/6"
                    onChange={(value) => {
                      setCategoryFilter(
                        value.flatMap((item) => item.split(","))
                      );
                    }}
                  />
                  <div className="w-2/6">
                    <Popover position="bottom" withArrow shadow="md">
                      <Popover.Target>
                        <DatePickerInput
                          placeholder={moment().format("MM/DD/YYYY")}
                          leftSection={<Icon variant="calendar" size={18} />}
                          leftSectionPointerEvents="none"
                          classNames={{
                            input: "focus-within:border-brand-purple-300",
                          }}
                        />
                      </Popover.Target>
                    </Popover>
                  </div>
                </div>
              </div>
              <MapSideNav
                destinations={destinations}
                setMapPosition={setMapLocation}
                setSelectedDestination={setSelectedDestination}
                selectedDestination={selectedDestination}
                isLoading={isFetching}
              />
              <div className="md:grid-cols-12 grid-cols-1 grid col-span-full md:col-span-8 h-[380px] md:h-[650px] row-start-2">
                <Map
                  mapLocation={mapLocation}
                  setMapLocation={setMapLocation}
                  destinations={destinations}
                  categoryFilter={categoryFilter}
                  selectedDestination={selectedDestination}
                />
              </div>
            </section>
          )}
        </>
      </Layout>
    </>
  );
};

export default Index;
