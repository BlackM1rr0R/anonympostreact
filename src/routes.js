
import About from "./pages/about";
import AboutDailyQuestion from "./pages/aboutdailyquestion";
import AdminPage from "./pages/adminpage";
import AllSaved from "./pages/allsaved";
import CategoryPosts from "./pages/categoryposts";
import Contact from "./pages/contact";

import Home from "./pages/home";
import Login from "./pages/login";
import MyProfile from "./pages/myprofile";
import PostAbout from "./pages/postabout";
import Register from "./pages/register";


const routeItem = (id, title, path, component, element, showHeaderFooter = true) => {
  return {
    id,
    title,
    path,
    component,
    element,
    showHeaderFooter
  };
};

const routes = {
  home: routeItem(1, 'home', "/", Home),
  about: routeItem(2, 'about', "/about", About),
  contact: routeItem(4, "contact", "/contact", Contact),
  login: routeItem(5, "login", "/login", Login, undefined, false),
  register: routeItem(6, "register", "/register", Register, undefined, false),
  myprofile: routeItem(7, "myprofile", "/my-profile", MyProfile),
  postabout: routeItem(8, "postabout", "/post/:id", PostAbout),
  dailyquestion: routeItem(9, "dailyquestion", "/daily-question/:id", AboutDailyQuestion),
  adminpage: routeItem(10, "admin", "/admin", AdminPage),
  categoryposts: routeItem(11, "category", "/category/:categoryId", CategoryPosts),
 allsaved: routeItem(12, "allsaved", "/all-saved", AllSaved), // Yeni route'u ekleyin


};

const routeArr = Object.values(routes);

export { routes, routeArr };
