const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Sample dictionary data
let dictionary = {};

const loadDictionary = () => {
    const filePath = path.join(__dirname, 'dictionary.csv'); // Adjust the path as needed
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading dictionary file:', err);
            return;
        }

        // Transform CSV data into a dictionary object
        const lines = data.trim().split('\n');
        dictionary = lines.reduce((dict, line) => {
            const [word, translation] = line.split(';');
            dict[word.trim()] = translation.trim();
            return dict;
        }, {});
    });
};

// Load dictionary on server start
loadDictionary();

app.get('/words', (req, res) => {
    res.json(dictionary);
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

