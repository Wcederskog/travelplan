import { Input, Loader, PasswordInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Dispatch, FormEvent, SetStateAction, useState } from "react";
import { toast } from "react-toastify";

interface SignupModalProps {
  setAuthenticationType: Dispatch<SetStateAction<string>>;
  close: () => void;
}

const Login: React.FC<SignupModalProps> = ({
  setAuthenticationType,
  close,
}) => {
  const [visible, { toggle }] = useDisclosure(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
  }>({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  function validateForm(
    name: string,
    email: string,
    password: string,
    confirmPassword: string
  ): boolean {
    const newErrors = {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    };

    let isError = false;

    if (!name) {
      newErrors.name = "Name is required";
      isError = true;
    }

    if (!email) {
      newErrors.email = "Email is required";
      isError = true;
    } else if (
      !email
        .toLowerCase()
        .match(
          /[a-z0-9!#$%&'+/=?^_`{|}~-]+(?:.[a-z0-9!#$%&'+/=?^_`{|}~-]+)@(?:[a-z0-9](?:[a-z0-9-][a-z0-9])?.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
        )
    ) {
      newErrors.email = "Email is invalid";
      isError = true;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isError = true;
    }
    if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
      isError = true;
    }

    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
      isError = true;
    }

    setErrors(newErrors);
    return !isError;
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirm-password") as string;

    if (validateForm(name, email, password, confirmPassword)) {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, confirmPassword }),
      });

      if (response.ok) {
        setIsLoading(false);
        toast("User successfully created", { type: "success" });
        setTimeout(() => {
          setAuthenticationType("login");
        }, 300);
        close();
      } else {
        const data = await response.json();
        toast(data.error, { type: "error" });
        setErrors({ ...errors, ...data.error });
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Input.Wrapper
          label="Name"
          error={errors.name}
          onChange={() => setErrors({ ...errors, name: "" })}
        >
          <Input
            type="text"
            classNames={{
              input: "focus-within:border-brand-purple-300",
            }}
            name="name"
          />
        </Input.Wrapper>

        <Input.Wrapper
          label="Email"
          error={errors.email}
          onChange={() => setErrors({ ...errors, email: "" })}
        >
          <Input
            type="email"
            classNames={{
              input: "focus-within:border-brand-purple-300",
            }}
            name="email"
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
          error={errors.password}
          onChange={() => setErrors({ ...errors, password: "" })}
        />

        <PasswordInput
          label="Confirm password"
          visible={visible}
          onVisibilityChange={toggle}
          classNames={{
            input: "focus-within:border-brand-purple-300",
          }}
          name="confirm-password"
          error={errors.confirmPassword}
          onChange={() => setErrors({ ...errors, confirmPassword: "" })}
        />

        <button
          type="submit"
          disabled={isLoading}
          className={`button-reversed mt-10 mb-5 !h-10 !w-full ${
            isLoading &&
            "!from-brand-purple-200 !to-brand-purple-200 cursor-default"
          } `}
        >
          {isLoading ? (
            <Loader className="mx-auto " color="white" type="dots" size={28} />
          ) : (
            "Sign up!"
          )}
        </button>
      </form>
      <p className="text-sm text-center">
        Already have an account?{" "}
        <span
          className="text-brand-purple-500 cursor-pointer"
          onClick={() => setAuthenticationType("login")}
        >
          {" "}
          Sign in here!
        </span>
      </p>
    </>
  );
};

export default Login;
