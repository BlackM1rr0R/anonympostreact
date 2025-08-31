import React, { useContext, useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAboutUser } from "../../api";
import Wrapper from "../../components/UI/wrapper";
import styles from "./index.module.css";
import { useTranslation } from "react-i18next";
import {ThemeContext} from '../../context/ThemeContext'
const AboutUser = () => {
  const { id } = useParams();        // /about-users/:id
  const { t } = useTranslation();    // <- sadece t alınır
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);
  const {darkMode}=useContext(ThemeContext);

 

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setErr(null);
        const userData = await getAboutUser(id);
        const normalizedPosts = (userData?.posts || []).map((p) => ({
          ...p,
          // Kategori ismi her türlü yakalansın:
          _categoryName:
            p.categoryName ??
            p.category?.name ??
            p.category_title ??
            p.category_name ??
            null,
        }));
        setUser(userData);
        setPosts(normalizedPosts);
      } catch (e) {
        console.error(e);
        setErr(e?.response?.data?.message || e.message || "Hata oluştu");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchUser();
  }, [id]);

  const stats = useMemo(() => {
    const total = posts.length;
    const withImg = posts.filter((p) => !!p.imageUrl).length;
    const noImg = total - withImg;
    return { total, withImg, noImg };
  }, [posts]);

  const fmtDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return iso || "";
    }
  };

  return (
    <Wrapper>
      <div className={`${styles.page} ${darkMode ? styles.dark : styles.light}`} >
        {/* Üst başlık */}
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <Link to={"/"} className={styles.backBtn} aria-label="Geri">
              ← {t("back") || "Geri"}
            </Link>
          </div>
          <div className={styles.headerCenter}>
            <h1 className={styles.title}>{t("aboutUser") || "About User"}</h1>
          </div>
         
        </header>

        {/* Hero / Profil kartı */}
        <section className={styles.hero}>
          <div className={styles.heroGlow} aria-hidden="true" />
          <div className={styles.profileCard}>
            <div className={styles.profileMain}>
              <div className={styles.avatar}>
                {(user?.username?.[0] || "?").toUpperCase()}
              </div>
              <div className={styles.profileMeta}>
                <h2 className={styles.username}>
                  {user?.username ?? "—"}
                </h2>
              </div>
            </div>

            <div className={styles.profileStats}>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{stats.total}</div>
                <div className={styles.statLabel}>{t("allPosts") || "Gönderi"}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{stats.withImg}</div>
                <div className={styles.statLabel}>{t("withPhoto") || "Görselli"}</div>
              </div>
              <div className={styles.statItem}>
                <div className={styles.statValue}>{stats.noImg}</div>
                <div className={styles.statLabel}>{t("onlyText") || "Metin"}</div>
              </div>
            </div>
          </div>
        </section>

        {/* İçerik */}
        <main className={styles.content}>
          {/* Hata */}
          {err && (
            <div className={styles.errorAlert}>
              <span>⚠️ {err}</span>
            </div>
          )}

          {/* Yükleniyor (Skeleton) */}
          {loading && (
            <div className={styles.grid}>
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`${styles.card} ${styles.skeletonCard}`}>
                  <div className={`${styles.skel} ${styles.skelImage}`} />
                  <div className={`${styles.skel} ${styles.skelLine}`} />
                  <div className={`${styles.skel} ${styles.skelLineShort}`} />
                </div>
              ))}
            </div>
          )}

          {/* Gönderiler */}
          {!loading && !err && (
            <>
              {posts.length === 0 ? (
                <div className={styles.emptyBox}>
                  <p>{t("noPosts") || "Henüz paylaşım yok."}</p>
                </div>
              ) : (
                <div className={styles.grid}>
                  {posts.map((post, idx) => (
                    <article
                      key={post.id || idx}
                      className={`${styles.card} ${styles.fadeUp}`}
                      style={{ animationDelay: `${idx * 60}ms` }}
                    >
                      {/* Görsel */}
                      {post.imageUrl ? (
                        <div className={styles.imageWrap}>
                          <img
                            src={`/api${post.imageUrl}`}
                            alt={post.title || "Post"}
                            className={styles.image}
                            loading="lazy"
                          />
                       
                        </div>
                      ) : (
                        <div className={styles.imageWrapPlaceholder}>
                          <div className={styles.placeholderIcon}>📝</div>
                      
                        </div>
                      )}

                      {/* İçerik */}
                      <div className={styles.cardBody}>
                        <h3 className={styles.cardTitle}>{post.title}</h3>
                        {post.content && (
                          <p className={styles.cardText}>
                            {post.content.length > 160
                              ? post.content.slice(0, 160) + "…"
                              : post.content}
                          </p>
                        )}

                        <div className={styles.metaRow}>
                      
                          <span className={styles.metaTime}>
                            {fmtDate(post.createdAt)}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </Wrapper>
  );
};

export default AboutUser;
