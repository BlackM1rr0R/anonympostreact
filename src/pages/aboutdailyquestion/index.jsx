import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDailyQuestionById } from "../../api";
import Wrapper from "../../components/UI/wrapper";
import styles from './index.module.css';
import { ThemeContext } from "../../context/ThemeContext";
const AboutDailyQuestion = () => {
    const { id } = useParams();
    const [question, setQuestion] = useState(null);
    const {darkMode}=useContext(ThemeContext)
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

    if (!question) return <p className={styles.loading}>Yükleniyor...</p>;

    return (
        <Wrapper>
            <div className={`${styles.container} ${darkMode ? styles.dark : styles.light}`}>
                <h1 className={styles.title}>{question.question}</h1>

                <h3 className={styles.answersTitle}>
                    Cevaplar ({question.answers?.length || 0})
                </h3>

                <ul className={styles.answerList}>
                    {question.answers.length > 0 ? (
                        question.answers
                            .slice()
                            .reverse()
                            .map((ans) => (
                                <li key={ans.id} className={styles.answerItem}>
                                    <strong className={styles.username}>{ans.username || "Anonim"}:</strong> {ans.answer}
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
