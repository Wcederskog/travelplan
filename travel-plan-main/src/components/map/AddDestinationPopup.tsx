import { Destination, Group, OverpassElement } from "../../../types";
import { Checkbox, Input, Modal, Select } from "@mantine/core";
import { DateTimePicker } from "@mantine/dates";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { FormEvent, useEffect, useState } from "react";

interface AddDestinationPopup {
  selectedDestination?: Destination | undefined;
  selectedOverpassData?: OverpassElement | undefined;
  existingDestination?: boolean;
  opened: boolean;
  close: () => void;
}

const AddDestinationPopup: React.FC<AddDestinationPopup> = ({
  selectedDestination,
  selectedOverpassData,
  existingDestination,
  opened,
  close,
}) => {
  useEffect(() => {
    if (selectedDestination) {
      setDescription(selectedDestination.description);
      setMandatory(selectedDestination.mandatory);
      setGroupEvent(selectedDestination.groupEvent);
      setEstimatedPrice(selectedDestination.price);
      setDateFrom(
        selectedDestination?.dateFrom
          ? new Date(selectedDestination.dateFrom)
          : null
      );
      setDateTo(
        selectedDestination?.dateTo
          ? new Date(selectedDestination.dateTo)
          : null
      );
      setEndDate(selectedDestination?.dateTo ? true : false);
    }
  }, [selectedDestination]);

  const [description, setDescription] = useState("");
  const [mandatory, setMandatory] = useState(false);
  const [groupEvent, setGroupEvent] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<string | null>("");

  const [estimatedPrice, setEstimatedPrice] = useState<number>(0);
  const [dateFrom, setDateFrom] = useState<Date | null>(null);
  const [dateTo, setDateTo] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState(false);

  const [groups, setGroups] = useState<Group[]>([]);

  const { isFetching, error, data } = useQuery({
    queryKey: ["groups"],
    queryFn: () => fetch("/api/get-groups").then((res) => res.json()),
  });

  useEffect(() => {
    if (data) {
      setGroups(data);
    }
  }, [data]);

  const queryClient = useQueryClient();

  const updateDestination = useMutation({
    mutationFn: (body: string) =>
      fetch("/api/update-destination", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      close();
    },
  });

  const createDestination = useMutation({
    mutationFn: (body: string) =>
      fetch("/api/create-destination", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      close();
    },
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (!existingDestination) {
      const data = {
        description: description ?? "",
        mandatory: mandatory ?? false,
        groupEvent: groupEvent ?? false,
        estimatedPrice: estimatedPrice ?? 0,
        dateFrom,
        dateTo,
        groupId: selectedGroup,
        destination: selectedDestination,
        overpassData: selectedOverpassData,
      };

      createDestination.mutate(JSON.stringify(data));
    } else {
      const data = {
        description: description ?? "",
        mandatory: mandatory ?? false,
        groupEvent: groupEvent ?? false,
        estimatedPrice: estimatedPrice ?? 0,
        dateFrom,
        dateTo,
        id: selectedDestination?.id,
      };

      updateDestination.mutate(JSON.stringify(data));
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={`${existingDestination ? "Edit the destination" : "Add"} ${
        selectedDestination
          ? selectedDestination?.title
          : selectedOverpassData
          ? selectedOverpassData.tags.name
          : null
      } ${existingDestination ? "" : "as a destination"}`}
    >
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <textarea
            className="border-[2px] p-2 border-brand-purple-300 rounded-lg w-full h-22"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <div className="flex flex-col gap-4 justify-start">
            <Checkbox
              label="Mandatory"
              color="#280F63"
              checked={mandatory}
              onChange={(e) => setMandatory(e.currentTarget.checked)}
            />
            <Checkbox
              label="Group event"
              color="#280F63"
              checked={groupEvent}
              onChange={(e) => setGroupEvent(e.currentTarget.checked)}
            />
            <div className="flex flex-row gap-4">
              <Input.Wrapper label="Estimated price" className="w-2/5">
                <Input
                  type="number"
                  max={10000}
                  value={estimatedPrice}
                  onChange={(e) => setEstimatedPrice(+e.target.value)}
                />
              </Input.Wrapper>
              <Select
                data={groups.map((group) => ({
                  value: group.id,
                  label: group.name,
                }))}
                classNames={{
                  input: "focus-within:border-brand-purple-300",
                }}
                onChange={(value) => setSelectedGroup(value)}
                label="Pick group"
              />
            </div>
          </div>
          <div className="flex flex-row gap-4">
            <DateTimePicker
              className="w-2/5"
              valueFormat="DD MMM YYYY hh:mm A"
              label="Pick start date and time"
              placeholder="Pick date and time"
              value={dateFrom}
              onChange={setDateFrom}
            />
            {endDate && (
              <DateTimePicker
                className="w-2/5"
                valueFormat="DD MMM YYYY hh:mm A"
                label="Pick end date and time"
                placeholder="Pick end time"
                value={dateTo}
                onChange={setDateTo}
              />
            )}
          </div>
          <Checkbox
            label="Pick end date"
            checked={endDate}
            color="#280F63"
            onChange={(e) => setEndDate(e.currentTarget.checked)}
          />

          <button
            disabled={!dateFrom}
            type="submit"
            className="button-reversed self-center disabled:cursor-not-allowed disabled:opacity-60"
          >
            {existingDestination ? "Edit destination" : "Add to destinations"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddDestinationPopup;
