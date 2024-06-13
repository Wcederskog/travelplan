import { Input, InputWrapper, MultiSelect, Textarea } from "@mantine/core";
import Icon from "../Icon";
import AddMemberLink from "./AddMemberLink";
import { FormEvent, useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";

interface NewGroupProps {
  setAccountTab: (tab: string) => void;
}
interface User {
  name: string;
  email: string;
}

const NewGroup: React.FC<NewGroupProps> = ({ setAccountTab }) => {
  const queryClient = useQueryClient();

  const [users, setUsers] = useState<User[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    const response = await fetch("/api/create-group", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description, members: selectedMembers }),
    });

    if (response.ok) {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setAccountTab("groups");
      setSelectedMembers([]);
    } else {
      const data = await response.json();
    }
  }

  const { isFetching, error, data } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetch("/api/get-users").then((res) => res.json()),
  });

  useEffect(() => {
    if (data) {
      setUsers(data);
    }
  }, [data]);

  const selectData = users.map((user) => ({
    value: user.email,
    label: user.name + " - " + user.email,
  }));
  return (
    <>
      <Icon variant="arrow-left" onClick={() => setAccountTab("groups")} />

      <form onSubmit={handleSubmit} className="w-full flex gap-4 flex-col">
        <InputWrapper label="Group title">
          <Input
            required
            name="name"
            type="text"
            classNames={{
              input: "focus-within:border-brand-purple-300",
            }}
          />
        </InputWrapper>
        <Textarea
          required
          name="description"
          label="Group description"
          classNames={{
            input: "focus-within:border-brand-purple-300",
          }}
        />

        <MultiSelect
          searchable
          name="members"
          label="Add members"
          placeholder="Member email"
          type="text"
          classNames={{
            input: "focus-within:border-brand-purple-300",
          }}
          value={selectedMembers}
          onChange={setSelectedMembers}
          rightSection={<AddMemberLink />}
          rightSectionWidth={120}
          rightSectionPointerEvents="auto"
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          data={searchValue ? selectData : []}
        />

        <button type="submit" className="button-default text-sm mx-auto">
          Create new group
        </button>
      </form>
    </>
  );
};

export default NewGroup;
