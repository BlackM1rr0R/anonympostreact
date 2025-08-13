import { useEffect, useState, useContext } from "react";
import styles from "./index.module.css";
import Wrapper from "../UI/wrapper";
import { getAllCategory } from "../../api";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";

const AllCategory = () => {
  const [categories, setCategories] = useState([]);
  const { darkMode } = useContext(ThemeContext);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const navigate = useNavigate();
  const { t } = useTranslation();
  useEffect(() => {
    const fetchAllCategories = async () => {
      try {
        const response = await getAllCategory();
        setCategories(response);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchAllCategories();
  }, []);

  // Ekran boyutunu dinle
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSelectChange = (e) => {
    const selectedId = e.target.value;
    if (selectedId) {
      navigate(`/category/${selectedId}`);
    }
  };

  return (
    <Wrapper>
      <div
        className={styles.allCategory}
        data-theme={darkMode ? "dark" : "light"}
      >
        <h2 className={styles.title}>{t("allcategories")}</h2>

        {isMobile ? (
          // 📱 Mobilde select gösteriyoruz
          <select
            className={styles.categorySelect}
            onChange={handleSelectChange}
            defaultValue=""
          >
            <option value="">{t("selectCategories")}</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.categoryName}
              </option>
            ))}
          </select>
        ) : (
          // 💻 Desktop’ta kart grid görünümü
          <div className={styles.grid}>
            {categories.map((category) => (
              <Link
                to={`/category/${category.id}`}
                state={{ categoryName: category.categoryName }}
                key={category.id}
                className={styles.categoryCard}
              >

                <h3>{category.categoryName}</h3>
                {category.description && <p>{category.description}</p>}
              </Link>
            ))}
          </div>
        )}
      </div>
    </Wrapper>
  );
};

export default AllCategory;
