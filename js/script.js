const global = {
  // Our global state. Stuff we want to access through aout functions
  current_page: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    total_pages: 1,
    total_results: 0,
  },
  api: {
    api_key: 'e50ce2779d800ddea3c6aa5e577a36a9',
    api_url: 'https://api.themoviedb.org/3/', // The 3 is the version
  },
};

// Display popylar tv shows
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

async function displayMovieDetails() {
  const movie_id = window.location.search.split('=')[1]; // window.loaction.search will return the query string from the url which we then split at the = sign returning an arrray with two elements.

  const movie = await fetchAPIData(`movie/${movie_id}`);

  // Overlay for background image
  displayBackgroundImage('movie', movie.backdrop_path);

  const div = document.createElement('div');

  div.innerHTML = `

  <div class="details-top">
  <div>
  ${
    movie.poster_path
      ? `<img
    src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
    class="card-img-top"
    alt="${movie.title}"
  />`
      : `<img
  src="../images/no-image.jpg"
  class="card-img-top"
  alt="${movie.title}"
/>`
  }
  </div>
  <div>
    <h2>${movie.title}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${movie.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Release Date: ${movie.release_date}</p>
    <p>
      ${movie.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${movie.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
    </ul>
    <a href="${
      movie.homepage
    }" target="_blank" class="btn">Visit Movie Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Movie Info</h2>
  <ul>
    <li><span class="text-secondary">Budget:</span> $${addCommasToNumber(
      movie.budget
    )}</li>
    <li><span class="text-secondary">Revenue:</span> $${addCommasToNumber(
      movie.revenue
    )}</li>
    <li><span class="text-secondary">Runtime:</span> ${
      movie.runtime
    } minutes</li>
    <li><span class="text-secondary">Status:</span> ${movie.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
    ${movie.production_companies
      .map((company) => `<span>${company.name}</span>`)
      .join(', ')}
  </div>
</div>
  `;

  document.querySelector('#movie-details').appendChild(div);
}

async function displayShowDetails() {
  const show_id = window.location.search.split('=')[1];

  const show = await fetchAPIData(`tv/${show_id}`);

  // Overlay for background image
  displayBackgroundImage('tv', show.backdrop_path);

  const div = document.createElement('div');

  div.innerHTML = `
  <div class="details-top">
  <div>
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
  </div>
  <div>
    <h2>${show.name}</h2>
    <p>
      <i class="fas fa-star text-primary"></i>
      ${show.vote_average.toFixed(1)} / 10
    </p>
    <p class="text-muted">Last Air Date: ${show.last_air_date}</p>
    <p>
      ${show.overview}
    </p>
    <h5>Genres</h5>
    <ul class="list-group">
      ${show.genres.map((genre) => `<li>${genre.name}</li>`).join('')}
    </ul>
    <a href="${
      show.homepage
    }" target="_blank" class="btn">Visit show Homepage</a>
  </div>
</div>
<div class="details-bottom">
  <h2>Show Info</h2>
  <ul>
    <li><span class="text-secondary">Number of Episodes:</span> ${
      show.number_of_episodes
    }</li>
    <li><span class="text-secondary">Last Episode To Air:</span> ${
      show.last_episode_to_air.name
    }</li>
    <li><span class="text-secondary">Status:</span> ${show.status}</li>
  </ul>
  <h4>Production Companies</h4>
  <div class="list-group">
    ${show.production_companies
      .map((company) => `<span>${company.name}</span>`)
      .join(', ')}
  </div>
</div>
  `;

  document.querySelector('#show-details').appendChild(div);
}

function displaySearchResults(results) {
  // Clear Previous Results
  document.querySelector('#search-results').innerHTML = '';
  document.querySelector('#search-results-heading').innerHTML = '';
  document.querySelector('#pagination').innerHTML = '';

  results.forEach((result) => {
    const div = document.createElement('div');
    div.classList.add('card');
    div.innerHTML = `
          <a href="${global.search.type}-details.html?id=${result.id}">
            ${
              result.poster_path
                ? `<img
              src="https://image.tmdb.org/t/p/w500/${result.poster_path}"
              class="card-img-top"
              alt="${
                global.search.type === 'movie' ? result.title : result.name
              }"
            />`
                : `<img
            src="../images/no-image.jpg"
            class="card-img-top"
             alt="${
               global.search.type === 'movie' ? result.title : result.name
             }"
          />`
            }
          </a>
          <div class="card-body">
            <h5 class="card-title">${
              global.search.type === 'movie' ? result.title : result.name
            }</h5>
            <p class="card-text">
              <small class="text-muted">Release: ${
                global.search.type === 'movie'
                  ? result.release_date
                  : result.first_air_date
              }</small>
            </p>
          </div>
        `;
    document.querySelector('#search-results-heading').innerHTML = `
      <h2>${results.length} of ${global.search.total_results} Results for ${global.search.term}</h2>
    `;
    document.querySelector('#search-results').appendChild(div);
  });

  displayPagination();
}

// Create & Display Pagination For Search
function displayPagination() {
  const div = document.createElement('div');
  div.classList.add('pagination');
  div.innerHTML = `
  <button class="btn btn-primary" id="prev">Prev</button>
  <button class="btn btn-primary" id="next">Next</button>
  <div class="page-counter">Page ${global.search.page} of ${global.search.total_pages}</div>
  `;

  document.querySelector('#pagination').appendChild(div);

  // Disable prev button if on first page
  if (global.search.page === 1) {
    document.querySelector('#prev').disabled = true;
  }

  // Disable next button if on last page
  if (global.search.page === global.search.total_pages) {
    document.querySelector('#next').disabled = true;
  }

  // Next page
  document.querySelector('#next').addEventListener('click', async () => {
    global.search.page++;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });

  // Prev page
  document.querySelector('#prev').addEventListener('click', async () => {
    global.search.page--;
    const { results, total_pages } = await searchAPIData();
    displaySearchResults(results);
  });
}

// Fetch data from TMDB API
async function fetchAPIData(endpoint) {
  const API_KEY = global.api.api_key;
  const API_URL = global.api.api_url;

  showSpinner();
  const response = await fetch(
    `${API_URL}${endpoint}?api_key=${API_KEY}&language=en-US`
  );

  const data = await response.json();

  hideSpinner();

  return data;
}

// Search data from TMDB API
async function searchAPIData() {
  const API_KEY = global.api.api_key;
  const API_URL = global.api.api_url;

  showSpinner();

  const response = await fetch(
    `${API_URL}search/${global.search.type}?api_key=${API_KEY}&language=en-US&query=${global.search.term}&page=${global.search.page}`
  );

  const data = await response.json();

  hideSpinner();

  return data;
}

// Search
async function search() {
  const query_string = window.location.search; // Returns the query strings. Everything from the ?
  const url_params = new URLSearchParams(query_string); // Use URLSearchParams to extract parameters from query strings

  // Add the type and term to the global object
  // Remember the search-term and type  was defined in our form as names to inputs then set to url params
  global.search.type = url_params.get('type');
  global.search.term = url_params.get('search-term');

  if (global.search.term !== '' && global.search.term !== null) {
    const { results, total_pages, total_results, page } = await searchAPIData();
    global.search.page = page;
    global.search.total_pages = total_pages;
    global.search.total_results = total_results;

    if (results.length === 0) {
      showAlert('No results found');
      return;
    }

    displaySearchResults(results);

    document.querySelector('#search-term').value = '';
  } else {
    showAlert('Please enter search term');
  }
}

// Display Slider
async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');

    div.innerHTML = `
      <a href="movie-details.html?id=${movie.id}">
        <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      </a>
      <h4 class="swiper-rating">
        <i class="fas fa-star text-secondary"></i> ${movie.vote_average} / 10
      </h4>
    `;

    document.querySelector('.swiper-wrapper').appendChild(div);

    initSwiper();
  });
}

// Show Alert
function showAlert(message, className = 'error') {
  const alert_el = document.createElement('div');
  const msg = document.createTextNode(message);
  alert_el.classList.add('alert', className);
  alert_el.appendChild(msg);
  document.querySelector('#alert').appendChild(alert_el);

  setTimeout(() => alert_el.remove(), 3000);
}

// Display Backdrop on details pages
function displayBackgroundImage(type, backgroundPath) {
  const overlay_div = document.createElement('div');
  overlay_div.style.backgroundImage = `url(https://image.tmdb.org/t/p/original/${backgroundPath})`;
  overlay_div.style.backgroundSize = 'cover';
  overlay_div.style.backgroundPosition = 'center';
  overlay_div.style.backgroundRepeat = 'no-repeat';
  overlay_div.style.height = '100vh';
  overlay_div.style.width = '100vw';
  overlay_div.style.position = 'absolute';
  overlay_div.style.top = '0';
  overlay_div.style.left = '0';
  overlay_div.style.zIndex = '-1';
  overlay_div.style.opacity = '0.1';

  if (type === 'movie') {
    document.querySelector('#movie-details').appendChild(overlay_div);
  } else {
    document.querySelector('#show-details').appendChild(overlay_div);
  }
}

function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 9000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

function addCommasToNumber(number) {
  return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function showSpinner() {
  document.querySelector('.spinner').classList.add('show');
}

function hideSpinner() {
  document.querySelector('.spinner').classList.remove('show');
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

  switch (global.current_page) {
    // case '/flixx-app/index.html':
    case pages.home:
      displaySlider();
      displayPopularMovies();
      break;
    case pages.shows:
      displayPopularShows();
      break;
    case pages.movie_details:
      displayMovieDetails();
      break;
    case pages.tv_details:
      displayShowDetails();
      break;
    case pages.search:
      search();
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
