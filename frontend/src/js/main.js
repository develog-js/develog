import postFunc from './showPost';
import main from '../html/main.html';

const mainNode = () => {
  const node = document.createElement('div');
  node.innerHTML = main;
  if (window.location.pathname !== '/') window.history.pushState(null, null, '/');
  // Event

  postFunc.mainPageInitialRender(node.querySelector('.posts-container'));

  node.querySelector('.see-more').addEventListener('click', postFunc.getPosts);

  node.querySelector('.main-container').addEventListener('click', e => {
    if (e.target.classList.contains('avatar-button') || e.target.classList.contains('user-nickname')) {
      window.history.pushState(null, null, `/develog/${e.target.parentNode.dataset.userId}`);
    } else if (e.target.className.split('__')[0].includes('main-post')) {
      window.history.pushState(null, null, `/detail/${e.target.closest('li').dataset.postId}`);
    }
  });

  return node.children;
};

export default mainNode;
