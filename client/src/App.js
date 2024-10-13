import React, {useEffect, useState} from 'react';

const DictionaryComponent = () => {
    const [dictionary, setDictionary] = useState({});
    const [keys, setKeys] = useState([]);
    const [currentKey, setCurrentKey] = useState('');
    const [shownKeys, setShownKeys] = useState(new Set());
    const [isTranslationVisible, setIsTranslationVisible] = useState(false); // State to toggle translation visibility
    const [isPhrase, setIsPhrase] = useState(false); // State to toggle between words and phrases
    // const host = "http://localhost:5000";
    const host = "https://words-app.onrender.com";

    useEffect(() => {
        const fetchWords = async () => {
            try {
                const response = await fetch(isPhrase ? host + '/phrases' : host + '/words');
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
    }, [isPhrase]); // Fetch words or phrases based on the category

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
            height: '100vh',
            padding: '0 20px' // Add padding for better mobile view
        }}>
            <div>
                <div style={{textAlign: 'center', margin: '20px 0'}}>
                    <button
                        onClick={() => setIsPhrase(false)}
                        style={{
                            padding: '10px 20px',
                            fontSize: '1.2em',
                            marginRight: '10px',
                            backgroundColor: isPhrase ? '#ddd' : '#007bff',
                            color: isPhrase ? '#000' : '#fff',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Words
                    </button>
                    <button
                        onClick={() => setIsPhrase(true)}
                        style={{
                            padding: '10px 20px',
                            fontSize: '1.2em',
                            backgroundColor: isPhrase ? '#007bff' : '#ddd',
                            color: isPhrase ? '#fff' : '#000',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Phrases
                    </button>
                </div>
                {currentKey ? (
                    <div
                        className="badge"
                        onClick={handleBadgeClick}
                        style={{
                            padding: '60px', // Increased padding for a larger badge
                            backgroundColor: '#007bff',
                            color: 'white',
                            borderRadius: '10px', // Slightly more rounded corners
                            cursor: 'pointer',
                            textAlign: 'center',
                            margin: '20px',
                            fontSize: '2.25em', // Increased font size
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Added shadow for a better look
                            transition: 'transform 0.2s', // Transition for hover effect
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                        }} // Slightly grow on hover
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                        }} // Return to original size
                    >
                        {isTranslationVisible ? dictionary[currentKey] : currentKey}
                    </div>
                ) : (
                    <button onClick={handleBadgeClick} style={{padding: '10px 20px', fontSize: '1.2em'}}>
                        Start
                    </button>
                )}
            </div>
        </div>
    );
};

export default DictionaryComponent;
