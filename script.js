// --- Main Display Image ---
// Define DOM Elements
const $mainImage = document.getElementById('main_image')
const $mainTitle = document.getElementById('main_image_title')
const $mainDate = document.getElementById('date_picker')
const $mainDescription = document.getElementById('main_image_description')
let currentImageHDUrl = "";

// Render Main Display Image
function renderMainDisplay(data) {
    $mainImage.src = data.url;
    $mainImage.alt = data.title;
    $mainTitle.textContent = data.title;
    $mainDate.value = data.date;
    $mainDescription.textContent = data.explanation;
    currentImageHDUrl = data.hdUrl;

    // Set favourite icon based on whether the image is already in the favourites list
    const alreadyFavourited = favourites.some(item => item.url === data.url);
    if (alreadyFavourited) {
        $addToFavourite.src = './images/favourite_filled.svg';
    } else {
        $addToFavourite.src = './images/favourite_default.svg';
    }
}

// Add interact to calendar
$mainDate.addEventListener('change', function (e) {
    const selectedDate = e.target.value;
    fetchFeaturedImage(selectedDate);
    localStorage.setItem('lastSelectedDate', selectedDate);
})

// --- Construct Wikimedia API URL from selected date ---
// Build API URL for Wikimedia Featured Image by date
function getWikiApiUrl(dateString) {
    const [year, month, day] = dateString.split('-');
    return `https://api.wikimedia.org/feed/v1/wikipedia/en/featured/${year}/${month}/${day}`;
}

// --- Fetch Wikimedia Featured Image for the selected date ---
function fetchFeaturedImage(date) {
    const formattedDate = date;
    const url = getWikiApiUrl(date);
    fetch(url)
        .then(res => res.json())
        .then(data => {
            const image = data.tfa;
            const thumbnailUrl = image.thumbnail?.source || '';

            // Use HD image if available, otherwise fallback to thumbnail
            let hdUrl = "";
            if (image.originalimage?.source) {
                hdUrl = image.originalimage.source;
            }
            renderMainDisplay({
                url: thumbnailUrl,
                hdUrl: hdUrl,
                title: image.title || 'No title',
                explanation: image.description.text || 'No description available.',
                date: date
            });
        })
        .catch(err => {
            console.error("Error", err);
            $mainDescription.textContent = "Sorry, something went wrong. Please try again later.";
        });
}


// Handle add to favourite
const $addToFavourite = document.getElementById('icon_favourite');
// Add event listener to add favourite icon
$addToFavourite.addEventListener('click', () => {
    const thumbnailUrl = $mainImage.src;
    const currentData = {
        url: thumbnailUrl,
        title: $mainTitle.textContent,
        explanation: $mainDescription.textContent,
        date: $mainDate.value,
        hdUrl: currentImageHDUrl
    };

    // Whether favourited before?
    const exists = favourites.some(item => item.url === currentData.url);
    if (exists) return;

    // Render favourite item
    favourites.push(currentData);
    renderFavouriteItem(currentData);
    $addToFavourite.src = './images/favourite_filled.svg';
    updateLocalStorage();
});

// --- Favourite Feature ---
// Define variables for the favourite list section
const $favouriteEmepty = document.getElementById('favourite_empty')
const $favouriteList = document.getElementById('favourite_list');
const favourites = [];

// Render favourite item
function renderFavouriteItem(data) {
    const item = document.createElement('div');
    item.innerHTML = `
  <div class="image_content">
    <img class="img thumbnail" src="${data.url}" data-hdurl="${data.hdUrl}" alt="${data.title}">
    <div class="info">
      <p class="item_title">${data.title}</p>
      <p class="item_date">${data.date}</p>
      <p class="item_description">${data.explanation}</p>
    </div>
  </div>
  <img class="delete_favourite_icon" src="./images/delete.svg" alt="Remove">
`;
    item.classList.add('favourite_item');

    // Delete icon eventlistener
    const $deleteIcon = item.querySelector('.delete_favourite_icon');
    $deleteIcon.addEventListener('click', () => {
        const index = favourites.findIndex(fav => fav.url === data.url);
        if (index !== -1) favourites.splice(index, 1);
        item.remove(); // Remove item
        updateLocalStorage();

        // Change favourite icon
        const currentMainImageUrl = document.getElementById('main_image').src;
        if (currentMainImageUrl.includes(data.url)) {
            $addToFavourite.src = './images/favourite_default.svg';
        }
    });
    // Add the new favourite item to the top of the favourites list
    $favouriteList.prepend(item);
    $favouriteEmepty.style.display = 'none';
}

// --- HD Modal Popup--- 
// Main display image HD popup
$mainImage.addEventListener('click', function () {
    const hdModal = document.getElementById('hd_modal');
    const hdImage = document.getElementById('hd_image');
    hdImage.src = currentImageHDUrl;
    hdModal.style.display = "flex";
})

// Favouite list image HD popup
$favouriteList.addEventListener('click', function (e) {
    if (e.target.classList.contains('img')) {
        const hdUrl = e.target.dataset.hdurl;
        const hdModal = document.getElementById('hd_modal');
        const hdImage = document.getElementById('hd_image');
        hdImage.src = hdUrl;
        hdModal.style.display = "flex";
    }
});

// close modal
const hdImage = document.getElementById('hd_image');
hdImage.addEventListener('click', function () {
    document.getElementById('hd_modal').style.display = "none";
});


// Define local storage function
function updateLocalStorage() {
    localStorage.setItem('favourites', JSON.stringify(favourites));
}

// Local storage
document.addEventListener('DOMContentLoaded', () => {
    const storedDate = localStorage.getItem('lastSelectedDate');
    const defaultDate = storedDate || new Date().toISOString().split('T')[0];
    $mainDate.value = defaultDate;
    fetchFeaturedImage(defaultDate);
    const storedFavourites = localStorage.getItem('favourites');
    if (storedFavourites) {
        const parsed = JSON.parse(storedFavourites);
        parsed.forEach(item => {
            favourites.push(item);
            renderFavouriteItem(item);
        });
    }
    document.getElementById('hd_modal').style.display = 'none';
});

