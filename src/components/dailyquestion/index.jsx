import React, { useState } from 'react';
import Wrapper from '../UI/wrapper';
import { addDailyQuestion } from '../../api';
import styles from './index.module.css';

const DailyQuestion = () => {
  const [questionText, setQuestionText] = useState("");
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "ADMIN";

  const handleAddQuestion = async () => {
    if (!questionText.trim()) {
      alert("Lütfen geçerli bir soru girin.");
      return;
    }
    try {
      await addDailyQuestion({ question: questionText });
      setQuestionText("");
    } catch (error) {
      console.error("Error adding daily question:", error);
      alert("Soru eklenirken hata oluştu.");
    }
  };

  if (!isAdmin) {
    return null; 
  }

  return (
    <Wrapper>
      <div className={styles.container}>
        <input
          type="text"
          placeholder="Yeni günlük soruyu buraya yazın..."
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
          className={styles.input}
        />
        <button onClick={handleAddQuestion} className={styles.addButton}>
          Yeni Günlük Soru Ekle
        </button>
      </div>
    </Wrapper>
  );
};

export default DailyQuestion;
