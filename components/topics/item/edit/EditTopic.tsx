import { Topic } from "../../../../shared/models";
import TopicControl from "../../control";
import { request } from "../../../../utils/request";

type EditTopicProps = {
  dialogOpen: boolean;
  closeDialog: () => void;
  topic: Topic;
  topics: Topic[];
  setTopics: (t: Topic[]) => void;
};

export const EditTopic = ({
  dialogOpen,
  closeDialog,
  topic,
  topics,
  setTopics,
}: EditTopicProps) => {
  const edit = async (title: string, isPublic: boolean): Promise<void> => {
    if (topic.public === isPublic && topic.title === title) {
      closeDialog();
      return;
    }

    const updatedTopic = await request("topics", "", "patch", {
      body: {
        _id: topic._id,
        title,
        public: isPublic,
      },
    });

    const updatedTopicsList = topics.map((item) => {
      if (item._id !== topic._id) return item;
      return updatedTopic;
    });

    setTopics(updatedTopicsList);
    closeDialog();
  };

  return (
    <TopicControl
      open={dialogOpen}
      onClose={closeDialog}
      onConfirm={edit}
      topic={topic}
    />
  );
};
