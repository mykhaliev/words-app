import React, {useEffect, useState} from 'react';

const DictionaryComponent = () => {
    const [dictionary, setDictionary] = useState({});
    const [keys, setKeys] = useState([]);
    const [currentKey, setCurrentKey] = useState('');
    const [shownKeys, setShownKeys] = useState(new Set());
    const [isTranslationVisible, setIsTranslationVisible] = useState(false); // State to toggle translation visibility


    useEffect(() => {
        const fetchWords = async () => {
            try {
                const response = await fetch('https://words-app.onrender.com/words');
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setDictionary(data);
                setKeys(Object.keys(data));
            } catch (error) {
                console.error('Error fetching the dictionary:', error);
            }
        };

        fetchWords();
    }, []);

    const getRandomKey = (availableKeys) => {
        const randomIndex = Math.floor(Math.random() * availableKeys.length);
        return availableKeys[randomIndex];
    };

    const handleBadgeClick = () => {
        if (shownKeys.size === keys.length) {
            alert('All words have been shown!');
            return; // All words have been shown
        }

        // If the translation is currently shown, select a new key
        if (isTranslationVisible) {
            let nextKey;
            do {
                nextKey = getRandomKey(keys);
            } while (shownKeys.has(nextKey)); // Ensure it's a new key

            // Update the current key and shown keys, reset translation visibility
            setCurrentKey(nextKey);
            setShownKeys((prev) => new Set(prev).add(nextKey));
            setIsTranslationVisible(false); // Reset translation visibility
        } else {
            // If the translation is not visible, just show the translation
            setIsTranslationVisible(true);
        }
    };

    // On the initial render, get the first random key
    useEffect(() => {
        if (keys.length > 0) {
            const initialKey = getRandomKey(keys);
            setCurrentKey(initialKey);
            setShownKeys((prev) => new Set(prev).add(initialKey));
        }
    }, [keys]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh' // Full height to center vertically
        }}>
            <div>
                {currentKey ? (
                    <div
                        className="badge"
                        onClick={handleBadgeClick}
                        style={{
                            padding: '20px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            margin: '20px',
                            fontSize: '24px'
                        }}
                    >
                        {isTranslationVisible ? dictionary[currentKey] : currentKey}
                    </div>
                ) : (
                    <button onClick={handleBadgeClick}>Start</button>
                )}
            </div>
        </div>
    );
};

export default DictionaryComponent;
