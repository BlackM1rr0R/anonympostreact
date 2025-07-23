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

// Yeni component: Sayfa geçişlerini AnimatePresence ile sarmalıyoruz
function AnimatedRoutes() {
  const location = useLocation(); // Mevcut konumu takip et

  return (
    <>

      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          {routeArr.map((item) => (
            <Route
              exact
              path={item.path}
              key={item.id}
              element={
                <>
                  <Header />
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                  >
                    <item.component />
                  </motion.div>
                  <Footer />
                </>
              }
            />
          ))}
        </Routes>
      </AnimatePresence>
    </>

  );
}

export default App;
