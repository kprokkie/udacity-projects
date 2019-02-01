let restaurant;
var newMap;

/**
 * Initialize map as soon as the page is loaded.
 */
document.addEventListener('DOMContentLoaded', (event) => {
  initMap();
});

/**
 * Initialize leaflet map
 */
initMap = () => {
  fetchRestaurantFromURL((error, restaurant) => {
    if (error) { // Got an error!
      console.error(error);
    } else {
      self.newMap = L.map('map', {
        center: [restaurant.latlng.lat, restaurant.latlng.lng],
        zoom: 16,
        scrollWheelZoom: false
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.jpg70?access_token=pk.eyJ1Ijoia3Byb2traWUiLCJhIjoiY2pxZnM5Yjc4NTdvYTQzcGQxZmRpbTl2NSJ9.FZFln1ecozqcSjI7AlATWw', {
        mapboxToken: 'pk.eyJ1Ijoia3Byb2traWUiLCJhIjoiY2pxZnM5Yjc4NTdvYTQzcGQxZmRpbTl2NSJ9.FZFln1ecozqcSjI7AlATWw',
        maxZoom: 18,
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
          '<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
          'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox.streets'
      }).addTo(newMap);
      fillBreadcrumb();
      DBHelper.mapMarkerForRestaurant(self.restaurant, self.newMap);
    }
  });
};

/**
 * Get current restaurant from page URL.
 */
fetchRestaurantFromURL = (callback) => {
  if (self.restaurant) { // restaurant already fetched!
    callback(null, self.restaurant);
    return;
  }
  const id = getParameterByName('id');
  if (!id) { // no id found in URL
    error = 'No restaurant id in URL';
    callback(error, null);
  } else {
    DBHelper.fetchRestaurantById(id, (error, restaurant) => {
      self.restaurant = restaurant;
      if (!restaurant) {
        console.error(error);
        return;
      }
      fillRestaurantHTML();
      callback(null, restaurant);
    });
  }
};

/**
 * Create restaurant HTML and add it to the webpage
 */
fillRestaurantHTML = (restaurant = self.restaurant) => {
  const name = document.getElementById('restaurant-name');
  name.innerHTML = restaurant.name;

  const rating = document.getElementById('restaurant-rating');
  rating.innerHTML = 'Rating: ' + restaurantRating(restaurant);

  const neighborhood = document.getElementById('restaurant-neighborhood');
  neighborhood.innerHTML = restaurant.neighborhood;

  const address = document.getElementById('restaurant-address');
  address.setAttribute('aria-label', 'Address: ' + restaurant.address + ', ' + restaurant.neighborhood);
  address.innerHTML = restaurant.address;

  const image = document.getElementById('restaurant-img');
  image.className = 'restaurant-img';
  image.alt = 'Image of ' + restaurant.name + ' restaurant';
  image.setAttribute('aria-label', 'Image ' + restaurant.name + ' restaurant, ');
  image.src = DBHelper.imageUrlForRestaurant(restaurant);

  const cuisine = document.getElementById('restaurant-cuisine');
  cuisine.setAttribute('aria-label', 'Cuisine type: ' + restaurant.cuisine_type);
  cuisine.innerHTML = restaurant.cuisine_type;

  // fill operating hours
  if (restaurant.operating_hours) {
    fillRestaurantHoursHTML();
  }
  // fill reviews
  fillReviewsHTML();
};

/**
 * Calculate rating based on reviews rating
 */
restaurantRating = (restaurant) => {
  let reviews = restaurant.reviews.map((r) => r.rating);
  let rating = reviews.reduce((a, b) => a + b, 0) / reviews.length;
  rating = rating.toFixed(1);

  return rating;
};

/**
 * Create restaurant operating hours HTML table and add it to the webpage.
 */
fillRestaurantHoursHTML = (operatingHours = self.restaurant.operating_hours) => {
  const hours = document.getElementById('restaurant-hours');
  for (let key in operatingHours) {
    const row = document.createElement('tr');

    const day = document.createElement('td');
    day.innerHTML = key;
    row.appendChild(day);

    const time = document.createElement('td');
    time.innerHTML = operatingHours[key];
    row.appendChild(time);

    hours.appendChild(row);
  }
};

/**
 * Create all reviews HTML and add them to the webpage.
 */
fillReviewsHTML = (reviews = self.restaurant.reviews) => {
  const container = document.getElementById('reviews-container');
  const title = document.createElement('h2');
  title.innerHTML = 'Reviews';
  container.appendChild(title);

  if (!reviews) {
    const noReviews = document.createElement('p');
    noReviews.innerHTML = 'No reviews yet!';
    container.appendChild(noReviews);
    return;
  }
  const ul = document.getElementById('reviews-list');
  reviews.forEach(review => {
    ul.appendChild(createReviewHTML(review));
  });
  container.appendChild(ul);
};

/**
 * Create review HTML and add it to the webpage.
 */
createReviewHTML = (review) => {
  const li = document.createElement('li');

  const commentHeader = document.createElement('div');
  commentHeader.className = 'comment-header';

  const commentCustomer = document.createElement('div');
  commentCustomer.className = 'comment-customer';

  const name = document.createElement('p');
  name.className = 'name';
  name.innerHTML = review.name;
  commentCustomer.appendChild(name);

  const date = document.createElement('p');
  date.className = 'date';
  date.innerHTML = review.date;
  commentCustomer.appendChild(date);

  commentHeader.appendChild(commentCustomer);

  const rating = document.createElement('p');
  rating.className = 'rating';
  rating.innerHTML = `Rating: ${review.rating}`;
  commentHeader.appendChild(rating);

  li.appendChild(commentHeader);

  const comments = document.createElement('p');
  comments.innerHTML = review.comments;
  li.appendChild(comments);

  return li;
};

/**
 * Add restaurant name to the breadcrumb navigation menu
 */
fillBreadcrumb = (restaurant = self.restaurant) => {
  const breadcrumb = document.getElementById('breadcrumb');
  const li = document.createElement('li');
  li.innerHTML = restaurant.name;
  breadcrumb.appendChild(li);
};

/**
 * Get a parameter by name from page URL.
 */
getParameterByName = (name, url) => {
  if (!url)
    url = window.location.href;
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp(`[?&]${name}(=([^&#]*)|&|#|$)`),
    results = regex.exec(url);
  if (!results)
    return null;
  if (!results[2])
    return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

/**
 * @description Adding click event listener to game info button
 */
const viewMapBtn = document.getElementById('viewMap');
const mapContainer = document.getElementById('map');
viewMapBtn.addEventListener('click', () => {
  var mapTop = mapContainer.offsetTop;
  if (mapTop) {
    window.scrollTo(0, mapTop - 135);
  }
});
