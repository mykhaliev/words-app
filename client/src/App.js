import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faVolumeUp} from '@fortawesome/free-solid-svg-icons';
import './App.css';

const DictionaryComponent = () => {
    const [dictionary, setDictionary] = useState({});
    const [keys, setKeys] = useState([]);
    const [currentKey, setCurrentKey] = useState('');
    const [shownKeys, setShownKeys] = useState(new Set());
    const [isTranslationVisible, setIsTranslationVisible] = useState(false);
    const [activeButton, setActiveButton] = useState(0);
    const [isPhrase, setIsPhrase] = useState(false);
    const [isWords, setIsWords] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); // For input field
    const [isLoading, setIsLoading] = useState(false); // For loading animation

    const host = "https://words-app.onrender.com";

    useEffect(() => {
        const fetchWords = async () => {
            try {
                const response = await fetch(activeButton === 1 ? host + '/phrases' : host + '/words');
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
    }, [activeButton]);


    const handleSearch = async (e) => {
        e.preventDefault();
        setActiveButton(-1);
        setIsLoading(true); // Start loading animation

        try {
            const response = await fetch(`${host}/ai-words?topic=${searchTerm}`);
            if (!response.ok) {
                throw new Error('Failed to fetch the search results.');
            }

            const data = await response.json();
            setDictionary(data); // Update dictionary with search results
            setKeys(Object.keys(data)); // Update the keys
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setIsLoading(false); // Stop loading animation
        }
    };

    const handleBadgeClick = () => {
        if (shownKeys.size === keys.length) {
            alert('All words have been shown!');
            return;
        }

        if (isTranslationVisible) {
            let nextKey;
            do {
                nextKey = getRandomKey(keys);
            } while (shownKeys.has(nextKey));

            setCurrentKey(nextKey);
            setShownKeys((prev) => new Set(prev).add(nextKey));
            setIsTranslationVisible(false);
        } else {
            setIsTranslationVisible(true);
        }
    };

    const readWord = () => {
        if (currentKey) {
            let text = isTranslationVisible ? dictionary[currentKey] : currentKey;
            const utterance = new SpeechSynthesisUtterance(text);
            let lang = 'en-US';
            if (isTranslationVisible) {
                lang = 'pt-BR';
            } else {
                lang = 'ru-RU';
            }
            const voices = speechSynthesis.getVoices();
            const selectedVoice = voices.find(voice => voice.lang === lang);
            utterance.lang = lang;
            utterance.voice = selectedVoice;
            speechSynthesis.speak(utterance);
        }
    };

    const getRandomKey = (availableKeys) => {
        const randomIndex = Math.floor(Math.random() * availableKeys.length);
        return availableKeys[randomIndex];
    };

    useEffect(() => {
        if (keys.length > 0) {
            const initialKey = getRandomKey(keys);
            setCurrentKey(initialKey);
            setShownKeys((prev) => new Set(prev).add(initialKey));
        }
    }, [keys]);

    return (
        <div className="app">
            <div>
                {/* Search Section */}
                <form onSubmit={handleSearch} style={{textAlign: 'center', margin: '20px 0'}}>
                    <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Enter topic to search..."
                        style={{
                            padding: '10px',
                            fontSize: '1.2em',
                            marginRight: '10px',
                            width: '250px',
                            border: '1px solid #007bff',
                            borderRadius: '5px'
                        }}
                    />
                    <button type="submit" style={{
                        padding: '10px 20px',
                        fontSize: '1.2em',
                        backgroundColor: '#007bff',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer'
                    }}>
                        Search
                    </button>
                </form>

                {/* Loading Animation */}
                {isLoading ? (
                    <div style={{textAlign: 'center', margin: '20px 0'}}>Loading...</div>
                ) : (
                    <>
                        {/* Words/Phrases Toggle */}
                        <div style={{textAlign: 'center', margin: '20px 0'}}>
                            <button
                                onClick={function () {
                                    setActiveButton(0);
                                }}
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '1.2em',
                                    marginRight: '10px',
                                    backgroundColor: activeButton !== 0 ? '#ddd' : '#007bff',
                                    color: activeButton === 1 ? '#000' : '#fff',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Words
                            </button>
                            <button
                                onClick={function () {
                                    setActiveButton(1);
                                }}
                                style={{
                                    padding: '10px 20px',
                                    fontSize: '1.2em',
                                    backgroundColor: activeButton !== 1 ? '#ddd' : '#007bff',
                                    color: activeButton === 0 ? '#000' : '#fff',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                Phrases
                            </button>
                        </div>

                        {/* Badge with words */}
                        {currentKey ? (
                            <div
                                className="badge"
                                onClick={handleBadgeClick}
                                style={{
                                    padding: '60px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    borderRadius: '10px',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    margin: '20px',
                                    fontSize: '2.25em',
                                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                    transition: 'transform 0.2s',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'scale(1.05)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'scale(1)';
                                }}
                            >
                                {isTranslationVisible ? dictionary[currentKey] : currentKey}
                            </div>
                        ) : (
                            <button onClick={handleBadgeClick} style={{padding: '10px 20px', fontSize: '1.2em'}}>
                                Start
                            </button>
                        )}

                        {/* Sound Button */}
                        <div className="badge">
                            <button onClick={readWord} className="sound-button">
                                <FontAwesomeIcon icon={faVolumeUp}/>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default DictionaryComponent;
