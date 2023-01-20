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

async function onSearch(e) {
  e.preventDefault();
  aPIService.query = e.currentTarget.elements.searchQuery.value.trim();
  aPIService.resetPage();
  refs.initialImg.style.visibility = 'hidden';

  try {
    const data = await aPIService.fetchPhotos();
    console.log({ data });
    createMarkup(data);
    if (data.hits.length) {
      Notiflix.Notify.success(`Hooray! We found ${data.totalHits} images.`);
    }
    observer.observe(refs.guard);
  } catch (error) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
}
function check(hits, totalHits) {
  if (hits.length === 0) {
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  } else {
    observer.observe(refs.guard);
  }
  if (hits.length && totalHits === refs.galleryContainer.childElementCount) {
    observer.unobserve(refs.guard);
    Notiflix.Notify.info(
      "We're sorry, but you've reached the end of search results."
    );
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
    // check(data.hits, data.totalHits);
    return;
  }
  refs.galleryContainer.insertAdjacentHTML('beforeend', markup.join(''));
  instance.refresh();
  check(data.hits, data.totalHits);
}

function onInfinityLoad(entries) {
  entries.forEach(async entry => {
    if (entry.isIntersecting) {
      try {
        aPIService.incrementPage();
        const data = await aPIService.fetchPhotos();
        createMarkup(data);
      } catch (error) {
        Notiflix.Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
      }
    }
  });
}
// function onClickOpen(e) {
//   e.preventDefault();
//   if (e.target.nodeName !== 'IMG') {
//     return;
//   }
// }
