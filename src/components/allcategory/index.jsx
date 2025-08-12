import { useEffect, useState, useContext } from "react";
import styles from "./index.module.css";
import Wrapper from "../UI/wrapper";
import { getAllCategory } from "../../api";
import { Link } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";

const AllCategory = () => {
  const [categories, setCategories] = useState([]);
  const { darkMode } = useContext(ThemeContext); // ThemeContext'ten dark/light

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

  return (
    <Wrapper>
      {/* data-theme attr ile CSS'te tema seçimi */}
      <div
        className={styles.allCategory}
        data-theme={darkMode ? "dark" : "light"}
      >
        <h2 className={styles.title}>All Categories</h2>

        <div className={styles.grid}>
          {categories.map((category) => (
            <Link
              to={`/category/${category.id}`}
              key={category.id}
              className={styles.categoryCard}
            >
              <h3>{category.categoryName}</h3>
              {category.description && <p>{category.description}</p>}
            </Link>
          ))}
        </div>
      </div>
    </Wrapper>
  );
};

export default AllCategory;
