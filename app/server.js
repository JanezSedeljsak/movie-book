const express = require('express')
const app = express()

app.use(express.static(__dirname + '/dist'));

app.get('/api/config', (req, res) => {
    res.json({
        DIRECTUS_URI: process.env.DIRECTUS_URI,
        API_URI: process.env.API_URI,
    });
});

app.get('/health', (req, res) => {
    res.json({ status: 'UP' });
});

app.get('*', (req, res) => {
    res.sendFile(__dirname + '/dist/index.html')
});

app.listen(3000, () => {
    console.log('Server is running on port 3000')
});