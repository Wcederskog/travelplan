import { Modal } from "@mantine/core";
import { useState } from "react";
import Signup from "./Signup";
import Login from "./Login";
import PasswordReset from "./PasswordReset";
interface AuthenticationModalProps {
  opened: boolean;
  close: () => void;
}

const AuthenticationModal: React.FC<AuthenticationModalProps> = ({
  opened,
  close,
}) => {
  const [authenticationType, setAuthenticationType] = useState("login");
  const getTitle = () => {
    switch (authenticationType) {
      case "sign-up":
        return "Create your account";
      case "password-reset":
        return "Reset your password";
      case "login":
        return "Welcome back!";
    }
  };
  return (
    <Modal
      opened={opened}
      onClose={() => {
        setTimeout(() => {
          setAuthenticationType("login");
        }, 300);
        close();
      }}
      title={getTitle()}
      classNames={{
        title: "text-3xl ",
        content: "rounded-lg",
      }}
      transitionProps={{ transition: "fade", duration: 300 }}
    >
      {authenticationType === "sign-up" && (
        <Signup setAuthenticationType={setAuthenticationType} close={close} />
      )}
      {authenticationType === "login" && (
        <Login setAuthenticationType={setAuthenticationType} close={close} />
      )}
      {authenticationType === "password-reset" && (
        <PasswordReset setAuthenticationType={setAuthenticationType} />
      )}
    </Modal>
  );
};

export default AuthenticationModal;
