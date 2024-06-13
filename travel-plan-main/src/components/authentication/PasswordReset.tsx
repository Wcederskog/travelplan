import { Input, Stack } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Dispatch, SetStateAction } from "react";

interface SignupModalProps {
  setAuthenticationType: Dispatch<SetStateAction<string>>;
}

const PasswordReset: React.FC<SignupModalProps> = ({
  setAuthenticationType,
}) => {
  const [visible, { toggle }] = useDisclosure(false);
  return (
    <>
      <Stack>
        <Input.Wrapper label="Email">
          <Input
            type="email"
            classNames={{
              input: "focus-within:border-brand-purple-300",
            }}
          />
        </Input.Wrapper>
        <p className="text-sm text-center">
          Click the verification link sent to your email
        </p>
      </Stack>

      <button
        onClick={() => setAuthenticationType("login")}
        className="button-reversed mt-10 mb-5 !w-full"
      >
        Reset password
      </button>
    </>
  );
};

export default PasswordReset;
