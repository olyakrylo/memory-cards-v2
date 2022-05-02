import { CircularProgress, Tab, Tabs } from "@mui/material";
import { useRouter } from "next/router";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { Error } from "@mui/icons-material";

import { request } from "../../utils/request";
import { GetServerSideProps } from "next";

import AdminTopics from "../../components/admin/topics";
import AllUsers from "../../components/admin/users";
import AdminCards from "../../components/admin/cards";
import AdminImages from "../../components/admin/images";
import { ADMIN_DATA_LIMIT, AdminCard, AdminTabData } from "../../shared/admin";
import { Topic, User } from "../../shared/models";

const TABS = ["users", "topics", "cards", "images"];

type AllDataProps = {
  users: AdminTabData<User>;
  topics: AdminTabData<Topic>;
  cards: AdminTabData<AdminCard>;
  images: AdminTabData<string>;
};

const AdminPanel = ({ users, topics, cards, images }: AllDataProps) => {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [tabsValue, setTabsValue] = useState<typeof TABS[number]>(TABS[0]);

  useEffect(() => {
    if (router.query.tab) {
      setTabsValue(router.query.tab as typeof TABS[number]);
    } else {
      void router.replace({
        pathname: router.pathname,
        query: { tab: "users" },
      });
    }

    console.log(users);

    if (!checking) return;

    request("users", "", "get").then(({ user }) => {
      if (!user?.admin) {
        void router.push("/app");
        return;
      }

      setChecking(false);
    });
  }, [router]);

  const handleTabChange = (_: BaseSyntheticEvent, value: string): void => {
    void router.push({
      pathname: router.pathname,
      query: { tab: value },
    });
  };

  if (checking) {
    return <CircularProgress />;
  }

  const renderTabData = () => {
    switch (tabsValue) {
      case "topics":
        return <AdminTopics {...topics} />;

      case "users":
        return <AllUsers {...users} />;

      case "cards":
        return <AdminCards {...cards} />;

      case "images":
        return <AdminImages {...images} />;

      default:
        return <Error />;
    }
  };

  return (
    <div>
      <Tabs value={tabsValue} onChange={handleTabChange} variant={"fullWidth"}>
        {TABS.map((tab) => (
          <Tab key={tab} label={tab} value={tab} />
        ))}
      </Tabs>

      {renderTabData()}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  if (process.env.NODE_ENV !== "production") {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
  }

  const skip = query.skip ?? 0;
  const limit = query.limit ?? ADMIN_DATA_LIMIT;

  const loadData = async (path: string, withSkip?: boolean): Promise<any> => {
    let dataUrl = `${process.env.DATA_URL}/${path}`;
    if (withSkip) {
      dataUrl = dataUrl.concat(`?skip=${skip}&limit=${limit}`);
    }

    const response = await fetch(dataUrl);
    return await response.json();
  };

  const [users, topics, cards, images] = await Promise.all(
    TABS.map((tab) => {
      if (tab === query.tab) {
        return loadData(tab, query.tab === tab);
      }
      return {
        count: 0,
        data: [],
      };
    })
  );

  return {
    props: { users, topics, cards, images },
  };
};

export default AdminPanel;
