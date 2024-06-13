import { Input, Loader, Stack } from "@mantine/core";
import { useContext, useEffect, useState } from "react";
import Icon from "../Icon";
import AnimateHeight from "../AnimateHeight";
import Pill from "../Pill";
import GroupMembers from "./GroupMembers";
import EditGroup from "./EditGroup";
import NewGroup from "./NewGroup";
import { Group } from "../../../types";
import { LoginContext } from "@/pages/_app";
import { useQuery } from "@tanstack/react-query";

interface GroupsProps {
  setAccountTab: (tab: string) => void;
  accountTab: string;
}

const Groups: React.FC<GroupsProps> = ({ setAccountTab, accountTab }) => {
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);
  const [filterValue, setFilterValue] = useState<string>("");
  const [groups, setGroups] = useState<Group[]>([]);
  const [selectedGroup, setSelectedGroup] = useState<Group | undefined>();
  const loginContext = useContext(LoginContext);

  const { isFetching, error, data } = useQuery({
    queryKey: ["groups"],
    queryFn: () => fetch("/api/get-groups").then((res) => res.json()),
  });

  useEffect(() => {
    if (data) {
      setGroups(data);
    }
  }, [data]);

  const handleUpdateActiveGroup = async (groupId: string) => {
    try {
      const response = await fetch("/api/set-active-group", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ groupId }),
      });
      if (!response.ok) {
        throw new Error("Failed to update active group");
      }
      if (response.ok) {
        loginContext.setActiveGroupId(groupId);
      }
    } catch (error) {
      console.error("Error updating active group:");
    }
  };

  const handleGroupClick = (groupTitle: string) => {
    setExpandedGroups((prevExpandedGroups) =>
      prevExpandedGroups.includes(groupTitle)
        ? prevExpandedGroups.filter((title) => title !== groupTitle)
        : [...prevExpandedGroups, groupTitle]
    );
  };

  return (
    <Stack>
      {accountTab === "groups" && (
        <>
          {isFetching && (
            <Loader className="mx-auto " color="black" type="dots" size={28} />
          )}
          {!isFetching &&
            groups
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((group) => (
                <div
                  key={group.id}
                  onClick={() => handleGroupClick(group.id)}
                  className="border-[1px] border-solid border-gray-300 p-2 rounded-lg flex gap-4 flex-col cursor-pointer transition-all hover:shadow-md "
                >
                  <div className="flex justify-between">
                    <p className="text-lg">{group.name}</p>

                    <div className="flex flex-row items-center">
                      {expandedGroups.includes(group.id) &&
                      group.adminId === loginContext.userId ? (
                        <div
                          onClick={() => {
                            setSelectedGroup(group);
                            setAccountTab("edit-group");
                          }}
                          className="flex flex-row gap-2 items-center"
                        >
                          <p>Edit</p>
                          <Icon variant="edit" size={20} />
                        </div>
                      ) : (
                        <Icon variant="arrow-down" className="ml-2" />
                      )}
                    </div>
                  </div>
                  <AnimateHeight isVisible={expandedGroups.includes(group.id)}>
                    <p>Description: </p>
                    <p className="text-sm">{group.description}</p>
                    <div className="flex flex-col py-3 gap-4 flex-wrap">
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
                        members={group.members}
                        filterValue={filterValue}
                        editAble={false}
                      />
                    </div>
                  </AnimateHeight>
                  <div className="flex flex-row justify-between text-xs items-center">
                    <div>
                      {group.adminId === loginContext.userId && (
                        <Pill color={"blue"} text="Owner" className="h-fit" />
                      )}
                    </div>
                    <button
                      className={`  text-xs ${
                        loginContext.activeGroupId === group.id
                          ? "button-reversed"
                          : "button-default"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();

                        handleUpdateActiveGroup(group.id);
                      }}
                    >
                      {loginContext.activeGroupId === group.id
                        ? "Active"
                        : "Set as active"}
                    </button>
                  </div>
                </div>
              ))}
          <button
            onClick={() => setAccountTab("new-group")}
            className="button-default mx-auto text-sm"
          >
            Create new group
          </button>
        </>
      )}
      {accountTab === "edit-group" && (
        <EditGroup setAccountTab={setAccountTab} group={selectedGroup} />
      )}
      {accountTab === "new-group" && <NewGroup setAccountTab={setAccountTab} />}
    </Stack>
  );
};

export default Groups;
