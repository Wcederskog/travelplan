import { Modal } from "@mantine/core";
import Groups from "./Groups";
import Settings from "./Settings";

interface AccountModalProps {
  opened: boolean;
  close: () => void;
  accountTab: string;
  setAccountTab: (tab: string) => void;
}

const AccountModal: React.FC<AccountModalProps> = ({
  opened,
  close,
  accountTab,
  setAccountTab,
}) => {
  const getTitle = () => {
    switch (accountTab) {
      case "settings":
        return "Edit your profile";
      case "groups":
        return "Groups";
      case "new-group":
        return "Create new group";
      case "edit-group":
        return "Edit your group";
    }
  };

  return (
    <Modal
      opened={opened}
      onClose={close}
      title={getTitle()}
      classNames={{
        title: "text-3xl ",
        content: "rounded-lg",
      }}
      transitionProps={{ transition: "fade", duration: 300 }}
      styles={{
        content: { scrollbarGutter: "stable" },
      }}
    >
      {accountTab === "settings" && <Settings close={close} />}
      {accountTab !== "settings" && (
        <Groups setAccountTab={setAccountTab} accountTab={accountTab} />
      )}
    </Modal>
  );
};

export default AccountModal;
