import Post from "../../components/post";
import AllPosts from "../../components/allpost";
import DailyQuestion from "../../components/dailyquestion";
import DailyQuestionView from "../../components/dailyquestionview.jsx";
import styles from "./index.module.css";
import Wrapper from "../../components/UI/wrapper/index.jsx";
import { useContext } from "react";
import { ThemeContext } from "../../context/ThemeContext.jsx";
import ArrowIcon from '../../assets/images/arrowicononly.png'
const Home = () => {
  const { darkMode } = useContext(ThemeContext);

  return (
    <div className={darkMode ? styles.dark : styles.light}>
      <DailyQuestion />
      <Wrapper>
        <div className={styles.column}>
          <div className={styles.columnItem}>
            <DailyQuestionView />
          </div>
          <div className={styles.columnItem}>
            <div className={styles.postWrapper}>

            <Post />
            <img className={styles.images1} src={ArrowIcon} alt="" />
            </div>
          </div>
        </div>
      </Wrapper>
      <AllPosts />
    </div>
  );
};

export default Home;
