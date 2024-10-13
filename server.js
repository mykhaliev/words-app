const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Sample dictionary data
const dictionary = [
    { word: "Hello", translation: "Hola" },
    { word: "Goodbye", translation: "Adiós" },
    { word: "Please", translation: "Por favor" },
    { word: "Thank you", translation: "Gracias" },
    { word: "Yes", translation: "Sí" },
    { word: "No", translation: "No" }
];

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
