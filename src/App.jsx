import React from "react";
import "./App.css";
import { routeArr } from "./routes";
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/scrolltop";
import { AnimatePresence, motion } from "framer-motion";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { ThemeProvider } from "./context/ThemeContext";
import PrivateAdminRoute from "./privateadminroute";


function App() {
  return (
    <ThemeProvider>
      <HelmetProvider>
        <BrowserRouter>
          <ScrollToTop>
            <AnimatedRoutes />
          </ScrollToTop>
        </BrowserRouter>
      </HelmetProvider>
    </ThemeProvider>
  );
}

// Sayfa geçişlerini ve admin kontrolünü yöneten bileşen
function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {routeArr.map((item) => {
          const Component = item.component;

          // Eğer admin sayfasıysa özel olarak koru
          if (item.path === "/admin") {
            return (
              <Route
                exact
                path={item.path}
                key={item.id}
                element={
                  <PrivateAdminRoute>
                    <Header />
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Component />
                    </motion.div>
                    <Footer />
                  </PrivateAdminRoute>
                }
              />
            );
          }

          // Diğer tüm sayfalar
          return (
            <Route
              exact
              path={item.path}
              key={item.id}
              element={
                item.path === "/admin" ? (
                  <PrivateAdminRoute>
                    {item.showHeaderFooter && <Header />}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Component />
                    </motion.div>
                    {item.showHeaderFooter && <Footer />}
                  </PrivateAdminRoute>
                ) : (
                  <>
                    {item.showHeaderFooter && <Header />}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Component />
                    </motion.div>
                    {item.showHeaderFooter && <Footer />}
                  </>
                )
              }
            />

          );
        })}
      </Routes>
    </AnimatePresence>
  );
}

export default App;
