const express = require('express');
const path = require('path');
const app = express();

// Serve static files from node_modules/quikchat/dist
app.use('/static', express.static(path.join(__dirname, 'node_modules/quikchat/dist')));

// Serve the HTML file from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the root URL with the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server on port 9001 or the port specified in the environment
const port = process.env.PORT || 9001;
app.listen(port, () => {
    console.log('Server is running on http://localhost:' + port);
});
