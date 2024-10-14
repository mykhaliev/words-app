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


/*
 * Install the Generative AI SDK
 *
 * $ npm install @google/generative-ai
 */

const {GoogleGenerativeAI} = require('@google/generative-ai');
const apiKey = process.env.GEMINI_API_KEY;
const client = new GoogleGenerativeAI(apiKey);
const modelId = "gemini-pro";
const model = client.getGenerativeModel({model: modelId});

async function getAiDictionary(topic, wordCount) {
    if (!topic || !wordCount) {
        return res.status(400).send('Please provide both topic and count query parameters');
    }

    // Generate the prompt based on user input
    const prompt = `
    Generate me a CSV file with ; delimiter. First column is the Russian word, second column is Portuguese translation.
    Add ${wordCount} most used Portuguese words in the topic of ${topic}, excluding prepositions, articles, and other service words.
    40% should be verbs, 30% nouns, 15% adjectives, and 15% adverbs.
    Use the most common and relevant words for a beginner student.`;

    try {
        // Send request to Google Generative AI for text generation
        const response = await model.generateContent(prompt);
        const generatedText = await response.response.text();
        // Parse the generated CSV text (assuming a well-structured response)
        return parseCsvString(generatedText);
    } catch (error) {
        console.error('Error generating text:', error);
        return error;
    }
}


function parseCsvString(data) {
    const dictionary = {};
    const lines = String(data).split('\n');

    lines.forEach(line => {
        const [word, translation] = line.split(';');
        if (word && translation) {
            dictionary[word.trim()] = translation.trim();
        }
    });
    return dictionary;
}

const loadDictionary = (filename) => {
    const filePath = path.join(__dirname, filename);
    const data = fs.readFileSync(filePath, 'utf8');
    return parseCsvString(data);
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

app.get('/ai-words', async (req, res) => {
    const topic = req.query.topic;
    const wordCount = 1000;  // You can also pass this as a query parameter if needed

    if (!topic) {
        return res.status(400).send('Topic query parameter is required');
    }

    try {
        res.json(await getAiDictionary(topic, wordCount));
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while generating the CSV file');
    }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'client/build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

