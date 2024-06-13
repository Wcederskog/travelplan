import { LoginContext } from "@/pages/_app";
import { Input } from "@mantine/core";
import { useQueryClient } from "@tanstack/react-query";
import { FormEvent, useContext, useState } from "react";
import { toast } from "react-toastify";

interface SettingsProps {
  close: () => void;
}

const Settings: React.FC<SettingsProps> = ({ close }) => {
  const loginContext = useContext(LoginContext);
  const queryClient = useQueryClient();
  const [color, setColor] = useState<string>(loginContext.color ?? "");
  const [name, setName] = useState<string>(loginContext.name ?? "");
  const notify = () =>
    toast("Your account is now updated", { type: "success" });
  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const data = {
      color,
      name,
    };
    const response = await fetch("/api/update-settings", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      loginContext.setName(name);
      localStorage.setItem("name", name);
      loginContext.setColor(color);
      localStorage.setItem("color", color);
      queryClient.invalidateQueries({ queryKey: ["destinations"] });
      notify();
      close();
    } else {
      const errorData = await response.json();
      console.error("Error:", errorData);
    }
  };
  return (
    <>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <div className="flex flex-col justify-between gap-2">
          <div className="flex flex-col">
            <p>Profile color</p>
            <p className="text-xs">
              Your profile color will change the marks you place on the map, to
              your prefered color
            </p>
          </div>
          <Input
            className="w-4/5"
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            classNames={{
              input: "focus-within:border-brand-purple-300",
            }}
          />
        </div>
        <div className="flex flex-col justify-between gap-2">
          <div className="flex flex-col">
            <p>Change display name</p>
            <p className="text-xs">
              Your display name, will show what name is listed when you create
              new destinations and your displayed name in groups
            </p>
          </div>
          <Input
            className="w-4/5"
            required
            type="text"
            min={2}
            onChange={(e) => setName(e.target.value)}
            classNames={{
              input: "focus-within:border-brand-purple-300",
            }}
            value={name}
          />
        </div>
        <button type="submit" className="button-default ml-auto text-sm">
          Save
        </button>
      </form>
    </>
  );
};

export default Settings;
