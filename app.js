const express = require('express');
const app = express();
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
app.use(express.static('public'));
app.set('view engine', 'ejs');
// Tell Express to use body-parser
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

// app.post("/page2", (req, res) => {
//   var newUrl = req.body.url;
//   console.log(newUrl);
// });

app.get('/', (req, res) => {
  var h1Tittle = 'Davo Movie Database';
  var slogan = 'Movie and Tv Show DataBase';
  res.render('search', {
    h1Tittle: h1Tittle,
    paragraph: slogan,
  });
});

// Compare function for year sorting
function compare(a, b) {
  const movieA = a.Year;
  const movieB = b.Year;
  let comparison = 0;
  if (movieA > movieB) {
    comparison = 1;
  } else if (movieA < movieB) {
    comparison = -1;
  }
  console.log(comparison);
  return comparison * -1;
}

app.get('/results', (req, res) => {
  var search = req.query.search;
  var url = `http://www.omdbapi.com/?s=${search}&apikey=thewdb`;
  var h1Tittle = 'Search Results';
  var paragraph = `Search results for ${search.toUpperCase()}`;
  var totalResults = 0;
  fetch(url)
    .then(body => body.json())
    .then(data => {
      if (data.Response === 'True') {
        // Sort by year calling a compare function to the JSON
        // data.Search.sort(compare);
        // Single line to call a function
        data.Search.sort((a, b) => (a.Year > b.Year ? -1 : 1));
        totalResults = data.totalResults;
        res.render('results', {
          data: data,
          h1Tittle: h1Tittle,
          paragraph: paragraph,
        });
      } else {
        res.render('results', {
          data: data,
          h1Tittle: h1Tittle,
          paragraph: data.Error,
        });
      }
    })
    .catch(err => {
      console.log('Error!', err);
    });
});

app.listen(process.env.PORT || 3050, process.env.IP, () => {
  console.log('Now serving port 3050');
});
