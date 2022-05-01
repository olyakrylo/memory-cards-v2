import { CircularProgress, Tab, Tabs } from "@mui/material";
import { useRouter } from "next/router";
import { BaseSyntheticEvent, useEffect, useState } from "react";
import { Error } from "@mui/icons-material";

import { request } from "../../utils/request";
import { GetServerSideProps } from "next";
import { ADMIN_DATA_LIMIT, Card, Topic, User } from "../../utils/types";
import AdminTopics from "../../components/admin/topics";
import AllUsers from "../../components/admin/users";
import AdminCards from "../../components/admin/cards";
import AdminImages from "../../components/admin/images";

const TABS = ["users", "topics", "cards", "images"];

type AllDataProps = {
  users?: {
    count: number;
    data: User[];
  };
  topics?: {
    count: number;
    data: Topic[];
  };
  cards?: {
    count: number;
    data: (Card & { topic_title: string })[];
  };
  images?: { keys: string[] };
};

const AdminPanel = ({ users, topics, cards, images }: AllDataProps) => {
  const router = useRouter();

  const [checking, setChecking] = useState(true);
  const [tabsValue, setTabsValue] = useState<typeof TABS[number]>(TABS[0]);

  useEffect(() => {
    if (!checking) return;

    request("users", "", "get").then(({ user }) => {
      if (!user?.admin) {
        void router.push("/app");
        return;
      }
      if (router.query.tab) {
        setTabsValue(router.query.tab as typeof TABS[number]);
      }
      setChecking(false);
    });
  }, [router]);

  const handleTabChange = (_: BaseSyntheticEvent, value: string): void => {
    setTabsValue(value);
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
        return (
          <AdminTopics topics={topics?.data ?? []} count={topics?.count ?? 0} />
        );

      case "users":
        return <AllUsers users={users?.data ?? []} count={users?.count ?? 0} />;

      case "cards":
        return (
          <AdminCards cards={cards?.data ?? []} count={cards?.count ?? 0} />
        );

      case "images":
        return <AdminImages images={images?.keys ?? []} />;

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

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

  const skip = ctx.query.skip ?? 0;
  const limit = ctx.query.limit ?? ADMIN_DATA_LIMIT;

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
      return loadData(tab, ctx.query.tab === tab);
    })
  );

  return {
    props: { users, topics, cards, images },
  };
};

export default AdminPanel;
