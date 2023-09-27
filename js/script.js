const global = {
  currentPage: window.location.pathname,
};

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
}

async function displayPopularShows() {
  const { results } = await fetchAPIData('tv/popular');

  results.forEach((show) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
      <a href="tv-details.html?id=${show.id}">
      ${
        show.poster_path
          ? `<img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />`
          : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
            alt="${show.name}"
          />`
      }
      </a>
      <div class="card-body">
        <h5 class="card-title">${show.name}</h5>
        <p class="card-text">
          <small class="text-muted">Air Date: ${show.first_air_date}</small>
        </p>
      </div>
    `;

    document.querySelector('#popular-shows').appendChild(div);
  });
}

async function displayPopularMovies() {
  const { results } = await fetchAPIData('movie/popular');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
        <a href="movie-details.html?id=${movie.id}">
          ${
            movie.poster_path
              ? `<img 
                src="https://image.tmdb.org/t/p/w500${movie.poster_path}" 
                class="card-img-top" 
                alt="${movie.title}" 
                />`
              : `<img src="images/no-image.jpg" class="card-img-top" alt="${movie.title}" />`
          }
        </a>
        <div class="card-body">
          <h5 class="card-title">${movie.title}</h5>
          <p class="card-text">
            <small class="text-muted">Release: ${movie.release_date}</small>
          </p>
        </div>
    `;
    document.querySelector('#popular-movies').appendChild(div);
  });
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = 'e50ce2779d800ddea3c6aa5e577a36a9';
  const API_URL = 'https://api.themoviedb.org/3/'; // The 3 is the version

  showSpinner();
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );

  const data = await response.json();

  hideSpinner();

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
      displayPopularMovies();
      break;
    case pages.shows:
      displayPopularShows();
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
