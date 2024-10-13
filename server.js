const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Sample dictionary data
let words = {};
let phrases = {};

const loadDictionary = (filename) => {
    const filePath = path.join(__dirname, filename);
    const data = fs.readFileSync(filePath, 'utf8');

    const dictionary = {};
    const lines = data.split('\n');

    lines.forEach(line => {
        const [word, translation] = line.split(';');
        if (word && translation) {
            dictionary[word.trim()] = translation.trim();
        }
    });
    return dictionary;
};

const wordsDictionary = loadDictionary('dictionary.csv');
const phrasesDictionary = loadDictionary('phrases.csv');

app.get('/words', (req, res) => {
    res.json(wordsDictionary);
});

// Example endpoint to get phrases
app.get('/phrases', (req, res) => {
    res.json(phrasesDictionary);
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

