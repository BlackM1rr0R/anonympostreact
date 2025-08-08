import React, { useContext } from "react";
import styles from "./index.module.css";
import Logo from '../../../assets/images/673e7d618507b496c9abfece_Studio-Logo 2.png';
import Wrapper from '../../UI/wrapper';
import Info from '../../../assets/images/SVG.png';
import { ThemeContext } from '../../../context/ThemeContext';
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation();
  return (
    <Wrapper>
      <div className={darkMode ? styles.dark : styles.light}>
        <div className={styles.control}>
          <div className={styles.leftSide}>
            <div className={styles.logo}>
              <img className={styles.logoImage} src={Logo} alt="Logo" />
              <h2>info@mail.ru</h2>
            </div>
            <div className={styles.logo}>
              <h1>Anonimlik?</h1>
              <h2>{t("anonims")}</h2>
            </div>
            <div className={styles.logoControl}>
              <div className={styles.textInfo}>
                <h1>{t("comingSoon")}</h1>
                <h2>{t("iosandandroid")}</h2>
              </div>
              <div className={styles.icon}>
                <img src={Info} alt="Info" />
              </div>

            </div>
          </div>
          <div className={styles.rightSide}>
            <p>
              {t("aboutUs")}
            </p>
            <h2>© formdom.az. Bütün hüquqlar qorunur.</h2>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(Footer);
