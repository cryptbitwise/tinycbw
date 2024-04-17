// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const shortid = require('shortid');

// Initialize Express app
const app = express();
app.use(bodyParser.json());

// Create an object to store URLs
const urlDatabase = {};

// Define route to shorten a URL
app.post('/shorten', async (req, res) => {
  const { url } = req.body;
  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  try {
    // Generate short code using shortid
    let shortCode;
    do {
      shortCode = shortid.generate();
    } while (urlDatabase[shortCode]); // Ensure unique shortCode

    urlDatabase[shortCode] = url;

    // Use localhost URL for testing
    res.json({ shortUrl: `http://localhost:3000/${shortCode}` });
  } catch (error) {
    console.error('Error generating short code:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Define route to redirect to original URL
app.get('/:shortCode', (req, res) => {
  const { shortCode } = req.params;
  const originalUrl = urlDatabase[shortCode];
  if (!originalUrl) {
    return res.status(404).json({ error: 'URL not found' });
  }
  res.redirect(originalUrl);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

