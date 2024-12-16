document.addEventListener('DOMContentLoaded', function () {
    const filmsList = document.getElementById('films');
    const baseURL = 'http://localhost:3000/'; 

    // Function to fetch movie data
    function fetchMovieData() {
        return fetch(`${baseURL}films`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    }

    // Function to display movie details
    function displayMovieDetails(movie) {
        const poster = document.getElementById('poster');
        const title = document.getElementById('title');
        const runtime = document.getElementById('runtime');
        const filmInfo = document.getElementById('film-info');
        const showtime = document.getElementById('showtime');
        const ticketNumber = document.getElementById('ticket-num');
        const buyTicketButton = document.getElementById('buy-ticket');

        poster.src = movie.poster;
        title.textContent = movie.title;
        runtime.textContent = `${movie.runtime} minutes`;
        filmInfo.textContent = movie.description;
        showtime.textContent = movie.showtime;
        const availableTickets = movie.capacity - movie.tickets_sold;
        ticketNumber.textContent = `${availableTickets} remaining tickets`;

        if (availableTickets <= 0) {
            buyTicketButton.textContent = 'Sold Out';
            buyTicketButton.disabled = true;
        } else {
            buyTicketButton.textContent = 'Buy Ticket';
            buyTicketButton.disabled = false;

            // Add event listener for buying tickets
            buyTicketButton.onclick = function () {
                buyTicket(movie.id, movie.tickets_sold);
            };
        }
    }

    // Function to buy a ticket
    function buyTicket(movieId, currentTicketsSold) {
        fetch(`${baseURL}films/${movieId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ tickets_sold: currentTicketsSold + 1 }),
        })
        .then(response => response.json())
        .then(updatedMovie => {
            displayMovieDetails(updatedMovie);
        })
        .catch(error => {
            console.error('Error purchasing ticket:', error);
        });
    }

    // Function to render the list of movies
    function renderMovies(movies) {
        filmsList.innerHTML = '';
        movies.forEach(movie => {
            const listItem = document.createElement('li');
            listItem.className = 'item';
            listItem.textContent = movie.title;
            listItem.onclick = () => displayMovieDetails(movie);
            filmsList.appendChild(listItem);
        });

        // Display the first movie's details by default
        if (movies.length > 0) {
            displayMovieDetails(movies[0]);
        }
    }

    // Fetch and display movies on page load
    fetchMovieData().then(movies => {
        renderMovies(movies);
    });
});

function fetchMovieData() {
    const loadingIndicator = document.getElementById('loading');
    loadingIndicator.style.display = 'block'; // Show loader

    return fetch(`${baseURL}films`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(movies => {
            loadingIndicator.style.display = 'none'; // Hide loader
            return movies;
        })
        .catch(error => {
            loadingIndicator.style.display = 'none'; // Hide loader
            console.error('There was a problem with the fetch operation:', error);
        });
}