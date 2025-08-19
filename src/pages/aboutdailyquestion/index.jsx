import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { deleteAnswer, getDailyQuestionById } from "../../api";
import Wrapper from "../../components/UI/wrapper";
import styles from './index.module.css';
import { ThemeContext } from "../../context/ThemeContext";
import { useTranslation } from "react-i18next";

const AboutDailyQuestion = () => {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [deletingAnswerId, setDeletingAnswerId] = useState(null);
  const { darkMode } = useContext(ThemeContext);
  const { t } = useTranslation();
  // Burada user objesini JSON parse ile alıyoruz
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    const fetchQuestion = async () => {
      try {
        const data = await getDailyQuestionById(id);
        setQuestion(data);
      } catch (error) {
        console.error("Soru alınırken hata:", error);
      }
    };
    fetchQuestion();
  }, [id]);

  const handleDeleteAnswer = async (answerId) => {
   const confirmed = window.confirm(t("removeComment"));

    if (!confirmed) return;

    setDeletingAnswerId(answerId);
    try {
      await deleteAnswer(answerId);
      setQuestion((prev) => ({
        ...prev,
        answers: prev.answers.filter((ans) => ans.id !== answerId),
      }));
    } catch (error) {
      alert(t("errorRemove"));
    } finally {
      setDeletingAnswerId(null);
    }
  };

  if (!question) return <p className={styles.loading}>Yükleniyor...</p>;

  return (
    <Wrapper>
      <div className={`${styles.container} ${darkMode ? styles.dark : styles.light}`}>
        <h1 className={styles.title}>{question.question}</h1>

        <h3 className={styles.answersTitle}>
          {t("allComments")} ({question.answers?.length || 0})
        </h3>

        <ul className={styles.answerList}>
          {question.answers.length > 0 ? (
            question.answers
              .slice()
              .reverse()
              .map((ans) => (
                <li key={ans.id} className={styles.answerItem}>
                  <strong className={styles.username}>{ans.username || "Anonim"}:</strong> {ans.answer}
                  {/* Sadece giriş yapan kullanıcının cevaplarında sil butonu gözüksün */}
                  
                  {user && ans.username?.toLowerCase() === user.username?.toLowerCase() && (
                    <button
                      onClick={() => handleDeleteAnswer(ans.id)}
                    
                      disabled={deletingAnswerId === ans.id}
                      className={styles.deleteButton}
                    >
                      {deletingAnswerId === ans.id ? t("deletinAnswer") : "Sil"}
                    </button>
                  )}
                </li>
              ))
          ) : (
            <li className={styles.answerItem}>Henüz cevap yok.</li>
          )}
        </ul>
      </div>
    </Wrapper>
  );
};

export default AboutDailyQuestion;
