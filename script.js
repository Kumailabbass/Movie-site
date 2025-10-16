const APIURL =
  "https://api.themoviedb.org/3/discover/movie?/sort_by=popularity.desc&api_key=04c35731a5ee918f014970082a0088b1&page=1";
const IMGPATH = "https://images.tmdb.org/t/p/w1280";
const SEARCHAPI =
  "https://api.themoviedb.org/3/search/movie?&api_key=04c35731a5ee918f014970082a0088b1&query=";
const main = document.getElementById("main");
const totalPriceEl = document.getElementById("total-price");
const confirmBtn = document.getElementById("confirm-btn");
const cartContainer = document.getElementById("cart-items");

let cart = [];
let totalPrice = 0;

getMovies(APIURL);

async function getMovies(url) {
  const resp = await fetch(url);
  const respData = await resp.json();
  searchMovies(respData.results);
}

function searchMovies(movies) {
  main.innerHTML = "";
  movies.forEach((movie) => {
    const movieEl = document.createElement("div");
    movieEl.classList.add("movie");
    const price = Math.floor(Math.random() * 20) + 5; // Generate random price between $5-$25

    movieEl.innerHTML = `
      <img src="${IMGPATH + movie.poster_path}" alt='${movie.title}' />
      <div class="movie-info">
        <h3>${movie.title}</h3>
        <span>${Math.trunc(movie.vote_average)}</span>
      </div>
      <div class="overview">
        <h4>Release date: ${movie.release_date}</h4>
        <h4>Original Language: ${movie.original_language}</h4>
        <h2>Overview:</h2>
        ${movie.overview}
        <p>Price: $${price}</p>
        <button class="btn add-to-cart" data-id="${movie.id}" data-title="${movie.title}" data-price="${price}">Add to Cart</button>
      </div>
    `;

    const addToCartBtn = movieEl.querySelector(".add-to-cart");
    addToCartBtn.addEventListener("click", () => addToCart(movie, price));

    main.appendChild(movieEl);
  });
}

function addToCart(movie, price) {
  const existingMovie = cart.find((item) => item.id === movie.id);

  if (existingMovie) {
    existingMovie.quantity += 1;
    existingMovie.totalPrice += price;
  } else {
    cart.push({ id: movie.id, title: movie.title, price, quantity: 1, totalPrice: price });
  }

  totalPrice += price;
  totalPriceEl.textContent = `$${totalPrice}`;

  updateCart();
  alert(`${movie.title} added to cart for $${price}`);
}

function updateCart() {
  cartContainer.innerHTML = ""; // Clear the cart container

  cart.forEach((item) => {
    const cartItem = document.createElement("div");
    cartItem.classList.add("cart-item");
    cartItem.innerHTML = `
      <span>${item.title} (x${item.quantity})</span>
      <span>Price: $${item.price} | Total: $${item.totalPrice}</span>
    `;

    cartContainer.appendChild(cartItem);
  });
}

confirmBtn.addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
  } else {
    let summary = "Order Summary:\n";
    cart.forEach((item) => {
      summary += `${item.title} (x${item.quantity}) - $${item.totalPrice}\n`;
    });
    summary += `Total Price: $${totalPrice}`;
    alert(summary);

    cart = [];
    totalPrice = 0;
    totalPriceEl.textContent = `$${totalPrice}`;
    updateCart();
  }
});
