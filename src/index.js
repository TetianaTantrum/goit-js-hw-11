import APIService from './js/API-service';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  form: document.querySelector('#search-form'),
  galleryContainer: document.querySelector('.gallery'),
  guard: document.querySelector('.js-guard'),
  initialImg: document.querySelector('.initial-image'),
};

const instance = new SimpleLightbox('.gallery a', {
  captionsData: 'alt',
});

const aPIService = new APIService();
const options = {
  root: null,
  rootMargin: '300px',
  threshold: 1.0,
};
const observer = new IntersectionObserver(onInfinityLoad, options);

refs.form.addEventListener('submit', onSearch);
refs.initialImg.style.visibility = 'visible';
function onSearch(e) {
  e.preventDefault();
  aPIService.query = e.currentTarget.elements.searchQuery.value.trim();
  aPIService.resetPage();
  refs.initialImg.style.visibility = 'hidden';
  aPIService.fetchPhotos().then(createMarkup);
  observer.observe(refs.guard);
}
function check(hits, totalHits) {
  if (hits.length === 0) {
    observer.unobserve(refs.guard);
  }
  if (!hits.length) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    aPIService.incrementPage();
    Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
  }
}
function createMarkup(data) {
  const markup = data.hits.map(hit => {
    return `<div class="photo-card">
   <a class="photo-card__link" href="${hit.largeImageURL}">
   <img class="photo-card__img" src="${hit.webformatURL}" alt="${hit.tags}" loading="lazy" />
   </a>
   <div class="info__list">
    <p class="info-item">
      <b><span class="bold">Likes</span>  ${hit.likes}</b>
    </p>
     <p class="info-item">
       <b><span class="bold">Views</span>  ${hit.views}</b>
    </p>
     <p class="info-item">
       <b><span class="bold">Comments</span>  ${hit.comments}</b>
    </p>
     <p class="info-item">
       <b><span class="bold">Downloads</span>  ${hit.downloads}</b>
     </p>
   </div>
 </div>`;
  });
  if (aPIService.page === 1) {
    refs.galleryContainer.innerHTML = markup.join('');
    instance.refresh();
    check(data.hits, data.totalHits);
    return;
  }
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup.join(''));
  instance.refresh();
  check(data.hits, data.totalHits);
}

function onInfinityLoad(entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      aPIService.fetchPhotos().then(createMarkup);
    }
  });
}
// function onClickOpen(e) {
//   e.preventDefault();
//   if (e.target.nodeName !== 'IMG') {
//     return;
//   }
// }
