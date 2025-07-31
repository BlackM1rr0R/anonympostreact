
import About from "./pages/about";
import AboutDailyQuestion from "./pages/aboutdailyquestion";
import AdminPage from "./pages/adminpage";
import Contact from "./pages/contact";

import Home from "./pages/home";
import Login from "./pages/login";
import MyProfile from "./pages/myprofile";
import PostAbout from "./pages/postabout";
import Register from "./pages/register";

const routeItem = (id, title, path, component, element) => {
  return {
    id,
    title,
    path,
    component,
    element
  };
};

const routes = {
  home: routeItem(1, 'home', "/", Home),
  about: routeItem(2, 'about', "/about", About),
  contact: routeItem(4, "contact", "/contact", Contact),
  login: routeItem(5, "login", "/login", Login),
  register: routeItem(6, "register", "/register", Register),
  myprofile: routeItem(7, "myprofile", "/my-profile", MyProfile),
  postabout: routeItem(8, "postabout", "/post/:id", PostAbout),
  dailyquestion:routeItem(9,"dailyquestion","/daily-question/:id",AboutDailyQuestion),
  adminpage:routeItem(10,"admin","/admin",AdminPage)


};

const routeArr = Object.values(routes);

export { routes, routeArr };
