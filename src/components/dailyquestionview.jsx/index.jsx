import React, { useEffect, useState } from 'react';
import Wrapper from '../UI/wrapper';
import { addAnswerToDailyQuestion, getDailyQuestion } from '../../api';
import { Link } from 'react-router-dom';
import styles from './index.module.css'
const DailyQuestionView = () => {
    const [latestQuestion, setLatestQuestion] = useState(null);
    const [answer, setAnswer] = useState('');

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
            alert('Cevabınız kaydedildi.');
            setAnswer('');
            const questions = await getDailyQuestion();
            setLatestQuestion(questions[questions.length - 1]);
        } catch (error) {
            alert('Cevap eklenirken hata oluştu.');
        }
    };

    return (
        <Wrapper className={styles.container}>
            {latestQuestion ? (
                <>
                    <h2 className={styles.title}>
                        <Link to={`/daily-question/${latestQuestion.id}`}>Günün Sorusu</Link>
                    </h2>
                    <p className={styles.question}>{latestQuestion.question}</p>

                    <textarea
                        className={styles.textarea}
                        value={answer}
                        onChange={(e) => setAnswer(e.target.value)}
                        placeholder="Cevabınızı yazın..."
                        rows={4}
                        style={{ width: '100%', marginTop: '1rem' }}
                    />
                    <button className={styles.button} onClick={handleAnswerSubmit}>
                        Cevabı Gönder
                    </button>

                    <h3 className={styles.answersTitle}>
                        Bu sorunun cevapları ({latestQuestion.answers?.length || 0})
                    </h3>
                    <ul className={styles.answerList}>
                        {latestQuestion.answers.length > 0 ? (
                            latestQuestion.answers
                            .slice(-3)
                            .reverse()
                            .map((ans) => (
                                <li className={styles.answerItem} key={ans.id}>
                                    <strong className={styles.username}>{ans.username || 'Anonim'}:</strong> {ans.answer}
                                </li>
                            ))
                        ) : (
                            <li className={styles.answerItem}>Henüz cevap yok.</li>
                        )}
                    </ul>
                </>
            ) : (
                <p>Soru yükleniyor...</p>
            )}
        </Wrapper>

    );
};

export default DailyQuestionView;
