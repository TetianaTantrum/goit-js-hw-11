import Notiflix from 'notiflix';

const API_KEY = '32827744-052546b65c11463fcf8d3310a';
const BASE_URL = 'https://pixabay.com/api/';

export default class APIService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }

  fetchPhotos() {
    return fetch(
      `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
    )
      .then(r => {
        if (!r.ok) {
          throw new Error(r.statusText);
        }
        return r.json();
      })
      .then(data => {
        // if (!hits.length) {
        //   Notiflix.Notify.failure(
        //     'Sorry, there are no images matching your search query. Please try again.'
        //   );
        // } else {
        //   this.incrementPage();
        //   Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);
        // }
        return data;
      })
      .catch(err => {
        return console.error(err);
      });
  }
  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}
