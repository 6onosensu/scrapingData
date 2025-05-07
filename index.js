const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

const url = 'https://www.imdb.com/chart/top';

const moviesData = {};

async function getHTML() {
  try {
    const { data: html } = await axios.get(url, {
      headers: {
        'User-Agent': 
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
    });
    return html;
  } catch (err) {
    console.error(`Error fetching HTML: ${err.message}`);
    return null;
  }
};

getHTML().then((res) => {
  if (!res) return;

  const $ = cheerio.load(res);

  $('.ipc-metadata-list-summary-item').each((i, movie) => {
    const title = $(movie).find('.ipc-title').text().trim();
    const rating = $(movie).find('.ipc-rating-star span').first().text().trim();

    if (title && rating) {
      moviesData[title] = rating;
    }
  });
  fs.writeFile('moviesData.json', JSON.stringify(moviesData, null, 2), (err) => {
    if (err) throw err;
    console.log('file succesfully saved!')
  })
})