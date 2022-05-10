import { Topic } from "../../../../shared/models";
import TopicControl from "../../control";
import { useTopics } from "../../../../hooks";

type EditTopicProps = {
  dialogOpen: boolean;
  onDialogClose: () => void;
  topic: Topic;
};

export const EditTopic = ({
  dialogOpen,
  onDialogClose,
  topic,
}: EditTopicProps) => {
  const topics = useTopics();

  const edit = async (title: string, isPublic: boolean): Promise<void> => {
    if (topic.public === isPublic && topic.title === title) {
      onDialogClose();
      return;
    }

    await topics.updateTopic(topic, title, isPublic);
    onDialogClose();
  };

  return (
    <TopicControl
      open={dialogOpen}
      onClose={onDialogClose}
      onConfirm={edit}
      topic={topic}
    />
  );
};
