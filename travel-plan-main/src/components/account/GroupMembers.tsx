import { useDisclosure } from "@mantine/hooks";
import { User } from "../../../types";
import Pill from "../Pill";

interface GroupMembersProps {
  members: User[] | undefined;
  filterValue: string;
  editAble: boolean;
  newMembers?: User[] | undefined;
}

const GroupMembers: React.FC<GroupMembersProps> = ({
  members,
  filterValue,
  editAble,
  newMembers,
}) => {
  const filteredMembers = [
    ...(members ?? []),
    ...(newMembers?.map((item) => ({ ...item, newMember: true })) ?? []),
  ].filter((userData) =>
    userData.name.toLowerCase().includes(filterValue.toLowerCase())
  ) as (User & { newMember?: boolean })[];
  const [opened, { toggle, close }] = useDisclosure(false);

  return (
    <>
      <div className="grid-cols-4 grid gap-4 border-[1px] border-slate-300 p-3 rounded-md">
        {filteredMembers.length === 0 && (
          <p
            onClick={() => editAble && toggle()}
            className={`truncate text-sm flex flex-row gap-1 items-center text-gray-400`}
          >
            No matches
          </p>
        )}
        {filteredMembers.map((member, index) => (
          <div key={index} className="col-span-2">
            <p
              onClick={() => editAble && toggle()}
              className={`truncate text-sm flex flex-row gap-1 items-center justify-between 
                 
               ${editAble ? "cursor-pointer" : ""}`}
            >
              {member.name}
              {member.newMember && (
                <Pill className="text-xs" color="green" text="New" />
              )}
            </p>
          </div>
        ))}
      </div>
    </>
  );
};

export default GroupMembers;
