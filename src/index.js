import APIService from './js/API-service';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('.gallery'),
  guard: document.querySelector('.js-guard'),
};

const aPIService = new APIService();
const options = {
  root: null,
  rootMargin: '50px',
  threshold: 1.0,
};
const observer = new IntersectionObserver(onInfinityLoad, options);
let instance;

refs.form.addEventListener('submit', onSearch);
refs.galleryContainer.addEventListener('click', onClickOpen);

function onSearch(e) {
  e.preventDefault();
  aPIService.query = e.currentTarget.elements.searchQuery.value.trim();
  // if (!aPIService.query) {
  //   Notiflix.Notify.failure(
  //     'Sorry, there are no images matching your search query. Please try again.'
  //   );
  // }
  check();
  aPIService.resetPage();
  clearGalleryContainer();
  aPIService.fetchPhotos().then(createMarkup);
  observer.observe(refs.guard);
}
function check() {
  if (!aPIService.length) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    this.incrementPage();
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }
}
function createMarkup(hits) {
  const markup = hits.map(hit => {
    return `<div class="photo-card">
   <a href="${hit.largeImageURL}">
   <img src="${hit.webformatURL} " alt="${hit.tags}" loading="lazy" />
   </a>
   <div class="info">
    <p class="info-item">
      <b><span class="bold">Likes</span> ${hit.likes}</b>
    </p>
     <p class="info-item">
       <b><span class="bold">Views</span> ${hit.views}</b>
    </p>
     <p class="info-item">
       <b><span class="bold">Comments</span>${hit.comments}</b>
    </p>
     <p class="info-item">
       <b><span class="bold">Downloads</span>${hit.downloads}</b>
     </p>
   </div>
 </div>`;
  });
  refs.galleryContainer.innerHTML = markup.join('');
  instance = new SimpleLightbox('.gallery a');
}
function clearGalleryContainer() {
  refs.galleryContainer.innerHTML = '';
}
function onInfinityLoad(entries, observer) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      aPIService.incrementPage();
      aPIService.fetchPhotos().then(createMarkup);

      if (hits.length <= 0) {
        observer.unobserve(refs.guard);
      }
      endOfSearch();
      instance.refresh();
    }
  });
}
function onClickOpen(e) {
  e.preventDefault();
  if (e.target.nodeName !== 'IMG') {
    return;
  }
}
function endOfSearch() {
  Notiflix.Notify.info(
    "We're sorry, but you've reached the end of search results."
  );
}
