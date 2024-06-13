import { AppProps } from "next/app";
import "../styles/globals.css";
import "react-toastify/dist/ReactToastify.css";
import { MantineProvider } from "@mantine/core";
import { createContext, useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import {
  QueryClient,
  QueryClientProvider,
  useQueryClient,
} from "@tanstack/react-query";
// import prisma from '../../lib/prisma';

export const LoginContext = createContext<{
  name: string | null;
  setName: (newName: string) => void;
  isLoggedIn: boolean | null;
  setIsLoggedIn: (newIsLoggedIn: boolean) => void;
  color: string | null;
  setColor: (newColor: string) => void;
  activeGroupId: string | null;
  setActiveGroupId: (newActiveGroupId: string) => void;
  userId: string | null;
  setUserId: (newUserId: string) => void;
}>({
  name: "",
  setName: (_newName: string) => {},
  isLoggedIn: false,
  setIsLoggedIn: (_newIsLoggedIn: boolean) => {},
  color: "",
  setColor: (_newColor: string) => {},
  activeGroupId: "",
  setActiveGroupId: (_newActiveGroupId: string) => {},
  userId: "",
  setUserId: (_newUserId: string) => {},
});

const queryClient = new QueryClient();

const App = ({ Component, pageProps }: AppProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [name, setName] = useState<string | null>(null);
  const [color, setColor] = useState<string | null>(null);
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (isLoggedIn !== null) {
        localStorage.setItem("isLoggedIn", JSON.stringify(isLoggedIn));
      }
      if (name !== null) {
        localStorage.setItem("name", name);
      }
      if (color !== null) {
        localStorage.setItem("color", color);
      }
      if (activeGroupId !== null) {
        localStorage.setItem("activeGroup", activeGroupId);
      }
      if (userId !== null) {
        localStorage.setItem("userId", userId);
      }
    }
  }, [activeGroupId, color, isLoggedIn, name, userId]);

  useEffect(() => {
    // Check if running on the client-side
    if (typeof window !== "undefined") {
      const storedIsLoggedIn = localStorage.getItem("isLoggedIn");
      setIsLoggedIn(storedIsLoggedIn ? JSON.parse(storedIsLoggedIn) : false);

      const storedName = localStorage.getItem("name");
      setName(storedName || "");

      const activeGroupId = localStorage.getItem("activeGroup");
      setActiveGroupId(activeGroupId || "");

      const storedColor = localStorage.getItem("color");
      setColor(storedColor || "");

      const storedUserId = localStorage.getItem("userId");
      setUserId(storedUserId || "");
    }
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <LoginContext.Provider
          value={{
            isLoggedIn,
            setIsLoggedIn,
            name,
            setName,
            color,
            setColor,
            activeGroupId,
            setActiveGroupId,
            userId,
            setUserId,
          }}
        >
          <MantineProvider>
            <ToastContainer position="bottom-center" autoClose={3000} />
            <Component {...pageProps} />
          </MantineProvider>
        </LoginContext.Provider>
      </QueryClientProvider>
    </>
  );
};

export default App;
