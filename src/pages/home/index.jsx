
import Post from "../../components/post";
import AllPosts from "../../components/allpost";
import DailyQuestion from "../../components/dailyquestion";
import DailyQuestionView from "../../components/dailyquestionview.jsx";


const Home = () => {
  return (
    <div>
      <DailyQuestion/>
      <DailyQuestionView />
      <Post />
      <AllPosts/>
    </div>
  );
};

export default Home;
