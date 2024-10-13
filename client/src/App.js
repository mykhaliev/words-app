// src/App.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

const App = () => {
    const [words, setWords] = useState([]);
    const [currentWord, setCurrentWord] = useState(null);
    const [showTranslation, setShowTranslation] = useState(false);

    useEffect(() => {
        const fetchWords = async () => {
            const response = await axios.get('http://localhost:5000/words');
            setWords(response.data);
        };

        fetchWords();
    }, []);

    const handleWordClick = (word) => {
        setCurrentWord(word);
        setShowTranslation(false);
    };

    const handleTranslationClick = () => {
        setShowTranslation(true);
    };

    return (
        <div className="App" style={{ padding: '20px' }}>
            <h1>Dictionary</h1>
            {showTranslation && currentWord ? (
                <div onClick={handleWordClick} style={styles.card}>
                    <h2>{currentWord.translation}</h2>
                </div>
            ) : (
                words.map((word, index) => (
                    <div key={index} onClick={() => handleWordClick(word)} style={styles.card}>
                        <h2>{word.word}</h2>
                    </div>
                ))
            )}
        </div>
    );
};

const styles = {
    card: {
        border: '1px solid #ccc',
        borderRadius: '8px',
        padding: '15px',
        margin: '10px 0',
        cursor: 'pointer',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        transition: 'background-color 0.3s',
    },
};

export default App;
