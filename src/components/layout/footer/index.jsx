import React, { useContext } from "react";
import styles from "./index.module.css";
import Logo from '../../../assets/images/673e7d618507b496c9abfece_Studio-Logo 2.png';
import Wrapper from '../../UI/wrapper';
import Info from '../../../assets/images/SVG.png';
import { ThemeContext } from '../../../context/ThemeContext';

const Footer = () => {
  const { darkMode } = useContext(ThemeContext);

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
              <h2>Bu sehifede butun anonimlik qorunur.</h2>
            </div>
            <div className={styles.logoControl}>
              <div className={styles.icon}>
                <img src={Info} alt="Info" />
              </div>
              <div className={styles.textInfo}>
                <h1>Tezlikle mobil tetbiqimizi yukle</h1>
                <h2>IOS & Android ucun istifadeye verilecek</h2>
              </div>
            </div>
          </div>
          <div className={styles.rightSide}>
            <p>
              FormDom, anonim kimliğinizi koruyarak özgürce düşüncelerinizi paylaşabileceğiniz güvenli bir dijital platformdur. Kullanıcılarının mahremiyetine en üst düzeyde önem veren FormDom, bireylerin kimliklerini ifşa etmeden kendilerini ifade etmelerine olanak tanır.

              Bu platformda dilediğiniz konularda statü (gönderi) paylaşabilir, diğer kullanıcıların gönderilerine yorum yapabilir, içerikleri beğenerek destek verebilir ve fikir alışverişinde bulunabilirsiniz. Her bir paylaşım, kişisel verileriniz korunarak tamamen anonim şekilde gerçekleştirilir.

              FormDom'un sunduğu bu özgürlük alanı, özellikle kendini ifade etmekte zorluk çeken bireyler için bir nefes alma noktası olmayı hedefler. Burada herkesin fikrine saygı duyulur ve her kullanıcı eşit söz hakkına sahiptir.

              En önemlisi ise; kimliğinizin arkasına saklanmadan, fakat kimliğiniz ortaya çıkmadan, içten gelen düşüncelerinizi güvenle paylaşabilir, yeni insanlarla tanışabilir ve gerçek bağlantılar kurabilirsiniz.

              FormDom, sadece bir sosyal paylaşım platformu değil; aynı zamanda dijital çağda bireysel düşünce özgürlüğünü destekleyen bir topluluktur. Kendi alanınızı yaratın, sesinizi duyurun ve anonim kalmanın verdiği rahatlıkla fikirlerinizi dünyayla paylaşın.
            </p>
            <h2>© formdom.az. Bütün hüquqlar qorunur.</h2>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default React.memo(Footer);
