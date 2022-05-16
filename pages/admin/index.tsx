import { Tab, Tabs } from "@mui/material";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

import {
  ADMIN_DATA_LIMIT,
  CardWithTopicTitle,
  AdminTabData,
} from "../../shared/admin";
import { Topic, User } from "../../shared/models";
import { useUser, useUserService } from "../../hooks";

const DynamicTopics = dynamic(() => import("../../components/admin/topics"), {
  ssr: false,
});
const DynamicUsers = dynamic(() => import("../../components/admin/users"), {
  ssr: false,
});
const DynamicCards = dynamic(() => import("../../components/admin/cards"), {
  ssr: false,
});
const DynamicImages = dynamic(() => import("../../components/admin/images"), {
  ssr: false,
});

const CircularProgress = dynamic(
  () => import("@mui/material/CircularProgress")
);

const TABS = ["users", "topics", "cards", "images"];

type AllDataProps = {
  SSRData: {
    users: AdminTabData<User>;
    topics: AdminTabData<Topic>;
    cards: AdminTabData<CardWithTopicTitle>;
    images: AdminTabData<string>;
  };
};

const AdminPanel = ({ SSRData }: AllDataProps) => {
  useUserService();

  const router = useRouter();
  const { info: user } = useUser();

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

    if (!checking || !user) return;

    if (user.admin) {
      setChecking(false);
    } else {
      void router.push("/app");
    }
  }, [router, user]);

  const handleTabChange = (...[, value]: [any, string]): void => {
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
        return <DynamicTopics {...SSRData.topics} />;

      case "users":
        return <DynamicUsers {...SSRData.users} />;

      case "cards":
        return <DynamicCards {...SSRData.cards} />;

      case "images":
        return <DynamicImages {...SSRData.images} />;
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

export const getServerSideProps: GetServerSideProps = async ({
  query,
  req,
}) => {
  const emptyData: AdminTabData<any> = {
    data: [],
    count: 0,
  };

  if (!query.tab) {
    return {
      props: {
        SSRData: {
          users: emptyData,
          topics: emptyData,
          cards: emptyData,
          images: emptyData,
        },
      },
    };
  }

  if (process.env.NODE_ENV !== "production") {
    process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";
  }

  const skip = query.skip ?? 0;
  const limit = query.limit ?? ADMIN_DATA_LIMIT;

  const loadData = async (path: string): Promise<any> => {
    const url = `https://${req.headers.host}/api/admin/${path}?skip=${skip}&limit=${limit}`;
    const response = await fetch(url);
    return await response.json();
  };

  const [users, topics, cards, images] = await Promise.all(
    TABS.map(async (tab) => {
      if (tab === query.tab) {
        return loadData(tab);
      }
      return {
        count: 0,
        data: [],
      };
    })
  );

  return {
    props: { SSRData: { users, topics, cards, images } },
  };
};

export default AdminPanel;
