import axios from 'axios';
import header from '../html/header.html';

const createHeaderNode = async () => {
  // const node = document.querySelector('.header');
  const node = document.createElement('div');
  node.innerHTML = header;

  const $searchInput = node.querySelector('#search');

  // search form submit 방지용
  node.querySelector('.search--form').onsubmit = e => {
    e.preventDefault();
  };

  // enter로 검색 시
  $searchInput.onkeyup = e => {
    if (e.key !== 'Enter') return;
    // 초기화
    window.history.pushState(null, null, `/search?title=${e.target.value.trim()}`);
    $searchInput.value = '';
    $searchInput.classList.toggle('search--hidden');
  };
  node.querySelector('.search--form label').onclick = async () => {
    // icon click으로 검색 시
    if (!$searchInput.classList.contains('search--hidden') && $searchInput.value.trim()) {
      window.history.pushState(null, null, `/search?title=${$searchInput.value.trim()}`);
    }
    // 초기화
    $searchInput.value = '';
    $searchInput.classList.toggle('search--hidden');
  };
  node.querySelector('.header--logo').addEventListener('click', () => {
    window.history.pushState(null, null, '/');
  });

  node.querySelector('.button--login').addEventListener('click', () => {
    window.history.pushState({}, '', '/signin');
  });

  try {
    const { data: user } = await axios.get('/checkAuth');
    if (user) {
      node.querySelector('.user').classList.remove('hidden');
      node.querySelector('.button--posting').classList.remove('hidden');
      node.querySelector('.button--login').classList.add('hidden');

      node.querySelector('.button--posting').addEventListener('click', () => {
        window.history.pushState({}, '', '/write');
      });

      node.querySelector('.nav-box ul li:first-child').addEventListener('click', () => {
        window.history.pushState({}, '', `/develog/${user.userId}`); // 유저아이디 있어야함
      });

      node.querySelector('.nav-box ul li:nth-child(2)').addEventListener('click', () => {
        window.history.pushState({}, '', '/mypage');
      });

      node.querySelector('.user').style.backgroundImage = `url('${user.avatarUrl}')`;

      node.querySelector('.user').onclick = () => {
        document.querySelector('.nav-box').classList.toggle('hidden');
      };
      node.querySelector('.nav-box ul li:last-child').onclick = async () => {
        const check = await axios.get('/logout');
        if (check.status === 204) window.history.pushState(null, null, '/');
      };
    } else {
      node.querySelector('.button--login').classList.remove('hidden');
      // if (window.location.pathname !== '/') window.history.pushState(null, null, '/');
    }
  } catch (e) {
    console.error(e);
  }
  return node.children;
};

export default createHeaderNode;
