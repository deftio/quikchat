const express = require('express');
const path = require('path');
const dotenv = require('dotenv');
const axios = require('axios');
const bodyParser = require('body-parser');
const { Readable } = require('stream');

// Load environment variables
dotenv.config();

const app = express();
app.use(bodyParser.json());

// Mount the static files directory to serve CSS, JS, and other assets
app.use('/static', express.static(path.join(__dirname, 'static')));

console.log('OPENAI_BASE_URL:', process.env.OPENAI_BASE_URL);

// Serve the chat page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'static/index.html'));
});

// Endpoint to serve the chat in embeddable widget
app.get('/widget', (req, res) => {
    res.sendFile(path.join(__dirname, 'static/widget.html'));
});

// Endpoint to get a completion response
app.post('/api/completion', async (req, res) => {
    const userMessage = req.body.message || '';

    try {
        const response = await axios.post(
            `${process.env.OPENAI_BASE_URL}/chat/completions`,
            {
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: userMessage }
                ],
                max_tokens: 1000
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status === 200 && response.data.choices && response.data.choices.length > 0) {
            const choice = response.data.choices[0];
            let completionText = '';
            if (choice.text) {
                completionText = choice.text.trim();
            } else if (choice.message && choice.message.content) {
                completionText = choice.message.content.trim();
            } else {
                return res.json({ error: 'Unexpected response structure from API.' });
            }
            return res.json({ response: completionText });
        } else {
            return res.json({ error: 'No completion text found in the response' });
        }
    } catch (error) {
        console.error(`Error: ${error.response?.status}, Response: ${error.response?.data}`);
        return res.json({ error: `Failed to fetch completion response. Status code: ${error.response?.status}` });
    }
});

// Endpoint to get a completion response with full message history
app.post('/api/completion-history', async (req, res) => {
    const userMessages = req.body.history || [];
    userMessages.unshift({ role: 'system', content: 'You are a helpful assistant.' });

    try {
        const response = await axios.post(
            `${process.env.OPENAI_BASE_URL}/chat/completions`,
            {
                model: 'gpt-4o',
                messages: userMessages,
                max_tokens: 1000
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response.status === 200 && response.data.choices && response.data.choices.length > 0) {
            const choice = response.data.choices[0];
            let completionText = '';
            if (choice.text) {
                completionText = choice.text.trim();
            } else if (choice.message && choice.message.content) {
                completionText = choice.message.content.trim();
            } else {
                return res.json({ error: 'Unexpected response structure from API.' });
            }
            return res.json({ response: completionText });
        } else {
            return res.json({ error: 'No completion text found in the response' });
        }
    } catch (error) {
        console.error(`Error: ${error.response?.status}, Response: ${error.response?.data}`);
        return res.json({ error: `Failed to fetch completion response. Status code: ${error.response?.status}` });
    }
});

// Endpoint to stream a response
app.post('/api/streaming-completion', (req, res) => {
    const userMessage = req.body.message || '';

    const generate = async () => {
        const response = await axios.post(
            `${process.env.OPENAI_BASE_URL}/chat/completions`,
            {
                model: 'gpt-4o',
                messages: [
                    { role: 'system', content: 'You are a helpful assistant.' },
                    { role: 'user', content: userMessage }
                ],
                max_tokens: 1000,
                stream: true
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                responseType: 'stream'
            }
        );

        const stream = new Readable({
            read() {}
        });

        response.data.on('data', (chunk) => {
            const lines = chunk.toString().split('\n');
            for (let line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonLine = line.substring(6);
                    try {
                        const parsedLine = JSON.parse(jsonLine);
                        const token = parsedLine.choices[0].delta?.content || '';
                        if (token) {
                            stream.push(token);
                        }
                    } catch (e) {
                        // handle JSON parsing error
                    }
                }
            }
        });

        response.data.on('end', () => {
            stream.push(null);
        });

        return stream;
    };

    generate().then(stream => {
        res.setHeader('Content-Type', 'text/event-stream');
        stream.pipe(res);
    });
});

// Endpoint to stream a response with full message history
app.post('/api/streaming-completion-history', (req, res) => {
    const userMessages = req.body.history || [];
    userMessages.unshift({ role: 'system', content: 'You are a helpful assistant.' });

    const generate = async () => {
        const response = await axios.post(
            `${process.env.OPENAI_BASE_URL}/chat/completions`,
            {
                model: 'gpt-4o',
                messages: userMessages,
                max_tokens: 1000,
                stream: true
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                responseType: 'stream'
            }
        );

        const stream = new Readable({
            read() {}
        });

        response.data.on('data', (chunk) => {
            const lines = chunk.toString().split('\n');
            for (let line of lines) {
                if (line.startsWith('data: ')) {
                    const jsonLine = line.substring(6);
                    try {
                        const parsedLine = JSON.parse(jsonLine);
                        const token = parsedLine.choices[0].delta?.content || '';
                        if (token) {
                            stream.push(token);
                        }
                    } catch (e) {
                        // handle JSON parsing error
                    }
                }
            }
        });

        response.data.on('end', () => {
            stream.push(null);
        });

        return stream;
    };

    generate().then(stream => {
        res.setHeader('Content-Type', 'text/event-stream');
        stream.pipe(res);
    });
});

// Start the Express server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
