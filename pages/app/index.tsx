import dynamic from "next/dynamic";

import styles from "./App.module.css";

const Topics = dynamic(() => import("../../components/topics"));

const App = () => {
  return (
    <div className={`${styles.container}`}>
      <Topics centered />
    </div>
  );
};

export default App;
