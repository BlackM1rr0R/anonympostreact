import React, { useContext, useEffect, useState } from 'react';
import Wrapper from '../UI/wrapper';
import { addAnswerToDailyQuestion, getDailyQuestion } from '../../api';
import { Link } from 'react-router-dom';
import styles from './index.module.css'
import { ThemeContext } from '../../context/ThemeContext';
import { useTranslation } from 'react-i18next';
const DailyQuestionView = () => {
    const [latestQuestion, setLatestQuestion] = useState(null);
    const [answer, setAnswer] = useState('');
    const { darkMode } = useContext(ThemeContext);
    const { t } = useTranslation();
    useEffect(() => {
        const fetchQuestion = async () => {
            try {
                const questions = await getDailyQuestion();
                if (questions.length > 0) {
                    setLatestQuestion(questions[questions.length - 1]);
                } else {
                    setLatestQuestion(null);
                }
            } catch (error) {
                console.error('Soru alınırken hata:', error);
            }
        };

        fetchQuestion();
    }, []);

    const handleAnswerSubmit = async () => {
        if (!latestQuestion) {
            alert("Önce soru gelmeli");
            return;
        }
        try {
            await addAnswerToDailyQuestion({
                answer: answer,
                question: { id: latestQuestion.id }
            });
            setAnswer('');
            const questions = await getDailyQuestion();
            setLatestQuestion(questions[questions.length - 1]);
        } catch (error) {
            alert('Cevap eklenirken hata oluştu.');
        }
    };

    return (
        <Wrapper>
            <div className={`${styles.container} ${darkMode ? styles.dark : styles.light}`}>

                {latestQuestion ? (
                    <>
                        <h2 className={styles.title}>
                            <Link className={styles.dailyQuestTitle} to={`/daily-question/${latestQuestion.id}`}>{t("dailyQuestion")}</Link>
                        </h2>
                        <p className={styles.question}>{latestQuestion.question}</p>

                        <textarea
                            className={styles.textarea}
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                            placeholder={t("writeAnswer")}
                            rows={4}
                            style={{ width: '100%', marginTop: '1rem' }}
                        />
                        <button className={styles.button} onClick={handleAnswerSubmit}>
                            {t("sendAnswer")}
                        </button>

                        <h3 className={styles.answersTitle}>
                            {t("answerQuestions")} ({latestQuestion.answers?.length || 0})
                        </h3>
                        <ul className={styles.answerList}>
                            {latestQuestion.answers.length > 0 ? (
                                latestQuestion.answers
                                    .slice(-3)
                                    .reverse()
                                    .map((ans) => (
                                        <Link to={`/daily-question/${latestQuestion.id}`} className={styles.answerItem} key={ans.id}>
                                            <strong className={styles.username}>{ans.username || 'Anonim'}:</strong>
                                            <p className={styles.answerUser}>{ans.answer}</p>
                                        </Link>
                                    ))

                            ) : (
                                <li className={styles.answerItem}>{t("noComment")}</li>
                            )}
                        </ul>
                        <div className={styles.linkContainer}>

                            <Link className={styles.getLink} to={`/daily-question/${latestQuestion.id}`}>{t("allComments")}</Link>
                        </div>

                    </>
                ) : (
                    <p>Soru yükleniyor...</p>
                )}
            </div>
        </Wrapper>

    );
};

export default DailyQuestionView;
