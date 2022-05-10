import { useUser } from "../index";
import { useSelector } from "react-redux";
import { State } from "../../shared/redux";
import { useEffect } from "react";
import { useRouter } from "next/router";

export const useUserServiceImpl = () => {
  const userHook = useUser();
  const router = useRouter();

  const user = useSelector((state: { main: State }) => state.main.user);

  useEffect(() => {
    if (router.pathname.startsWith("/recovery")) {
      return;
    }

    if (user) {
      if (router.pathname === "/auth") {
        void router.push("/app");
      }
      return;
    }

    if (user === null) {
      void router.push("/auth");
      return;
    }

    void userHook.loadUser();
  }, [user]);

  return {};
};
