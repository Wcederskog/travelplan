import { LoginContext } from "@/pages/_app";
import { Input, Loader, PasswordInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { setCookie } from "cookies-next";

import {
  Dispatch,
  FormEvent,
  SetStateAction,
  useContext,
  useState,
} from "react";

interface SignupModalProps {
  setAuthenticationType: Dispatch<SetStateAction<string>>;
  close: () => void;
}

const Signup: React.FC<SignupModalProps> = ({
  setAuthenticationType,
  close,
}) => {
  const [visible, { toggle }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const loginContext = useContext(LoginContext);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");
    const password = formData.get("password");

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();

    if (response.ok) {
      setIsLoading(false);
      loginContext.setName(data.name);
      loginContext.setIsLoggedIn(true);
      loginContext.setUserId(data.id);
      loginContext.setColor(data.color);
      setCookie("token", data.token);
      close();
    } else {
      setError(data.error || "Unknown error occurred");
      setIsLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Input.Wrapper label="Email">
          <Input
            type="email"
            classNames={{
              input: "focus-within:border-brand-purple-300",
            }}
            name="email"
            required
            error={error}
          />
        </Input.Wrapper>
        <PasswordInput
          label="Password"
          visible={visible}
          onVisibilityChange={toggle}
          classNames={{
            input: "focus-within:border-brand-purple-300",
          }}
          name="password"
          required
          error={error}
        />

        <p className="text-sm">
          Forgot your password?{" "}
          <span
            className="text-brand-purple-500 cursor-pointer"
            onClick={() => setAuthenticationType("password-reset")}
          >
            {" "}
            Click here
          </span>
        </p>
        <button
          type="submit"
          className={`button-reversed mt-10 mb-5 !h-10 !w-full ${
            isLoading &&
            "!from-brand-purple-200 !to-brand-purple-200 cursor-default"
          } `}
        >
          {isLoading ? (
            <Loader className="mx-auto " color="white" type="dots" size={28} />
          ) : (
            "Sign in!"
          )}
        </button>
        <p className="text-sm text-center">
          Don&apos;t have an account?{" "}
          <span
            className="text-brand-purple-500 cursor-pointer"
            onClick={() => setAuthenticationType("sign-up")}
          >
            {" "}
            Sign up here!
          </span>
        </p>
      </form>
    </>
  );
};

export default Signup;
