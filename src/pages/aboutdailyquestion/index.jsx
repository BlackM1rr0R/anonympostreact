import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getDailyQuestionById } from "../../api";
import Wrapper from "../../components/UI/wrapper";
import styles from './index.module.css'

const AboutDailyQuestion = () => {
    const { id } = useParams();
    const [question, setQuestion] = useState(null);

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

    if (!question) return <p>Yükleniyor...</p>;

    return (
        <Wrapper className={styles.wrapper}>
            <div>
                <h1 className={styles.h1}>{question.question}</h1>
                <h3 className={styles.h3}>Cevaplar:</h3>
                <ul className={styles.ul}>
                    {question.answers.length > 0 ? (
                        question.answers.map(ans => (
                            <li key={ans.id} className={styles.li}>
                                <strong>{ans.username || "Anonim"}:</strong>
                                {ans.answer}
                            </li>
                        ))
                    ) : (
                        <li className={styles.li}>Henüz cevap yok.</li>
                    )}
                </ul>
            </div>
        </Wrapper>


    );
};

export default AboutDailyQuestion;
