import { useRouter } from "next/router";
import { useEffect } from "react";

import { useTopics } from "../index";

export const useTopicsServiceImpl = () => {
  const topics = useTopics();
  const router = useRouter();

  useEffect(() => {
    void topics.updateCurrentTopic(router.query.topic as string);
  }, [router.query.topic]);

  return {};
};
