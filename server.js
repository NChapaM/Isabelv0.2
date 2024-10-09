const express = require('express');
const { Configuration, OpenAIApi } = require("openai");
require('dotenv').config();

const app = express();
app.use(express.json());
app.use(express.static('public'));

const configuration = new Configuration({
    apiKey: process.env.AZURE_OPENAI_KEY,
    basePath: `${process.env.AZURE_OPENAI_ENDPOINT}/openai/deployments/${process.env.AZURE_OPENAI_DEPLOYMENT_NAME}`
});
const openai = new OpenAIApi(configuration);

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo", // Adjust this to match your deployed model
            messages: [
                { role: "system", content: "You are a helpful assistant." },
                { role: "user", content: message }
            ],
        });
        res.json({ response: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'An error occurred while processing your request.' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));