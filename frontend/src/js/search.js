import postFunc from './showPost';
import search from '../html/search.html';

const searchNode = () => {
  const node = document.createElement('div');
  node.innerHTML = search;

  const searchTitle = decodeURIComponent(window.location.search.split('=')[1]);

  // Event
  postFunc.showSearchedPosts(
    searchTitle,
    node.querySelector('.search-posts-container'),
    node.querySelector('.no-posts'),
    node.querySelector('.keyword'),
    node.querySelector('.keyword-number'),
    node.querySelector('.posts-info'),
    node.querySelector('.no-keyword')
  );

  node.querySelector('.search-container').addEventListener('click', e => {
    if (e.target.classList.contains('avatar-button') || e.target.classList.contains('user-nickname')) {
      window.history.pushState(null, null, `/develog/${e.target.parentNode.dataset.userId}`);
    } else if (e.target.className.split('__')[0].includes('search-post')) {
      window.history.pushState(null, null, `/detail/${e.target.closest('li').dataset.postId}`);
    }
  });
  return node.children;
};

export default searchNode;
