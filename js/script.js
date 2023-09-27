const global = {
  currentPage: window.location.pathname,
};

async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = '';
  const API_URL = 'https://api.themoviedb.org/3/'; // The 3 is the version

  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );

  const data = await response.json();

  return data;
}
// Highlight active link
function highlightActiveLink() {
  const links = document.querySelectorAll('.nav-link');
  links.forEach((link) => {
    if (link.getAttribute('href') === global.currentPage) {
      link.classList.add('active');
    }
  });
}

// Page Router
function pageRouter() {
  const pages = {
    home: '/flixx-app/' || '/flixx-app/index.html',
    shows: '/flixx-app/shows.html',
    search: '/flixx-app/search.html',
    tv_details: '/flixx-app/tv-details.html',
    movie_details: '/flixx-app/movie-details.html',
  };

  switch (global.currentPage) {
    // case '/flixx-app/index.html':
    case pages.home:
      console.log('Home');
      break;
    case pages.shows:
      console.log('Shows');
      break;
    case pages.movie_details:
      console.log('Movie Details');
      break;
    case pages.tv_details:
      console.log('TV Details');
      break;
    case pages.search:
      console.log('search');
      break;
  }
}

// Initialize app
function init() {
  pageRouter();
  highlightActiveLink();
}

console.log(window.location.pathname);

document.addEventListener('DOMContentLoaded', init);
