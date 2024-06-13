import { Input, InputWrapper, MultiSelect, Textarea } from "@mantine/core";
import Icon from "../Icon";
import AddMemberLink from "./AddMemberLink";
import GroupMembers from "./GroupMembers";
import { FormEvent, useEffect, useState } from "react";
import { Group, User } from "../../../types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

interface EditGroupProps {
  setAccountTab: (tab: string) => void;
  group: Group | undefined;
}

const EditGroup: React.FC<EditGroupProps> = ({ setAccountTab, group }) => {
  const queryClient = useQueryClient();
  useEffect(() => {
    if (group) {
      setDescription(group.description);
      setGroupName(group.name);
      setGroupMembers(group.members);
    }
  }, [group]);

  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [groupMembers, setGroupMembers] = useState<User[]>([]);
  const [newGroupMembers, setNewGroupMembers] = useState<string[]>([]);
  const [searchValue, setSearchValue] = useState("");
  const [members, setMembers] = useState<User[]>([]);

  const updateGroup = useMutation({
    mutationFn: (body: string) =>
      fetch("/api/update-group", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: body,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
      setAccountTab("groups");
    },
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;

    updateGroup.mutate(
      JSON.stringify({
        name,
        description,
        groupMembers: [
          ...groupMembers.map((member) => member.email),
          ...newGroupMembers,
        ],
        groupId: group?.id,
      })
    );
  }

  async function deleteGroup() {
    const response = await fetch("/api/delete-group", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ groupId: group?.id }),
    });
    if (response.ok) {
      setAccountTab("groups");
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
      setMembers(data);
    }
  }, [data]);

  const selectData = members
    .filter(
      (member) =>
        !groupMembers
          .map((groupMember) => groupMember.email)
          .includes(member.email)
    )
    .map((member) => member.email);

  const [filterValue, setFilterValue] = useState<string>("");
  return (
    <>
      <Icon variant="arrow-left" onClick={() => setAccountTab("groups")} />

      <form onSubmit={handleSubmit} className="w-full flex gap-4 flex-col">
        <InputWrapper label="Group title">
          <Input
            name="name"
            type="text"
            classNames={{
              input: "focus-within:border-brand-purple-300",
            }}
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
        </InputWrapper>
        <Textarea
          label="Group description"
          name="description"
          classNames={{
            input: "focus-within:border-brand-purple-300",
          }}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
          value={newGroupMembers}
          onChange={setNewGroupMembers}
          labelProps={{}}
          rightSection={<AddMemberLink />}
          rightSectionWidth={120}
          rightSectionPointerEvents="auto"
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          data={searchValue ? selectData : []}
        />
        <div>
          <p className="w-full">Members:</p>
          <Input
            placeholder="Search"
            onClick={(e) => e.stopPropagation()}
            classNames={{
              input: "focus-within:border-brand-purple-300",
            }}
            className="w-3/5"
            onChange={(e) => setFilterValue(e.target.value)}
          />
        </div>
        <GroupMembers
          members={group?.members}
          newMembers={members.filter((item) =>
            newGroupMembers.includes(item.email)
          )}
          filterValue={filterValue}
          editAble
        />
        <div className="flex flex-row justify-center gap-8">
          <button type="submit" className="button-default text-sm ">
            Save changes
          </button>
          <button
            type="button"
            onClick={deleteGroup}
            className="border-2 border-red-500 py-2 px-4 rounded-full hover:text-white transition-colors duration-300 hover:bg-red-600 text-sm "
          >
            Delete group
          </button>
        </div>
      </form>
    </>
  );
};

export default EditGroup;
