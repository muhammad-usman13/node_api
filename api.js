const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const app = express();

let data = [];

fs.createReadStream('data_new.csv')
  .pipe(csv())
  .on('data', (row) => {
    data.push(row);
  })
  .on('end', () => {
    console.log('CSV file successfully processed');
  });

app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the API!', endpoints: ['/search?query={query}'] });
});

app.get('/search', (req, res) => {
  const query = req.query.query;

  if (!query) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  const results = data.filter((row) => row.title.toLowerCase().includes(query.toLowerCase()));
  if (results.length === 0) {
    return res.status(404).json({ error: 'No results found' });
  }

  res.json({ results });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
