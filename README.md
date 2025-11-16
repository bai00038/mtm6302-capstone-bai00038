# mtm6302-capstone-bai00038
### Name:Bing Bai
### Student Number:41144871
### Project Name: Capstone Project - Part 4

## Design Decisions

# Wikimedia Featured Image Viewer

This project is a web application that displays the featured image of the day from the Wikimedia API based on a selected date. It includes features such as viewing HD images, adding favorites, and storing data in local storage.

---

## Steps Taken to Build the Project

1. **Project Setup**
   - Created the basic structure using HTML, CSS, and JavaScript.
   - Set up DOM elements for image, title, date picker, and description.

2. **Fetching API Data**
   - Used the Wikimedia Featured Feed API to get image data based on the selected date.
   - Built a utility function `getWikiApiUrl(date)` to construct the correct endpoint.

3. **Rendering Image**
   - Wrote the `renderMainDisplay()` function to update the DOM with the fetched image, title, date, and description.
   - Handled empty or missing values gracefully.

4. **HD Image Modal**
   - Enabled click-to-enlarge functionality for HD images using a modal popup.
   - Click again to close the modal.

5. **Favorites Feature**
   - Added the ability to favorite images by clicking the star icon.
   - Saved favorites in localStorage to persist across sessions.

6. **Date Picker Interaction**
   - Added event listeners to fetch and update the image when a new date is selected.

---

## Resources Used

- **Wikimedia Featured Feed API**  
  https://api.wikimedia.org/wiki/Feed_API/Reference/Featured_content
  Used to retrieve the featured images.

- **JavaScript Tutorials**  
  - W3Schools: https://www.w3schools.com/

- **Icons**  
  - Favorite icons (`favourite_default.svg`, `favourite_filled.svg`)
  - Delete icon (`delete.svg`)

 - **Bootstrap** 
 - Utilized Bootstrap utility classes in HTML to enhance UI styling and responsiveness without writing extensive custom CSS.

---

## Challenges Faced & Solutions

- **Missing HD image URL in some API responses**  
  - Added a fallback to thumbnail image when HD is not available.

- **Image modal not closing properly**  
  - Added event listener on HD image to toggle modal display.

- **Favorite icon not updating correctly after removing an image**  
  - Compared current `mainImage.src` with removed favorite and reset the heart icon.

- **LocalStorage not persisting favorites after reload**  
  - On DOM load, parsed stored favorites and re-rendered them dynamically.

---

## Accessibility Considerations
- Used semantic HTML elements such as `<header>`, `<main>`, `<section>`, and `<footer>` to structure content meaningfully.
- Added `alt` attributes to all images to provide descriptive text for screen readers.