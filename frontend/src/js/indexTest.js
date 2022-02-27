import createHeaderNode from './js/header';
import Main from './js/main';

import detailUrlEvents from './js/detail';

// import signin from './js/signin';
// import signup from './js/signup';
// import develog from './js/develog';
// import mypage from './js/mypage';
// import mypageEdit from './js/mypageEdit';
// import search from './js/search';
// import writeUrlEvents from './js/write';
// import { reduceRight } from '../../backend/data/posts';

const history = require('history-events');

const $root = document.getElementById('root');

const render = async ele => {
  const headerNode = await createHeaderNode();
  $root.replaceChildren(...headerNode, ...ele);
};

const routes = [
  // { path: '/', component: render(mainNode) },
  { path: '/', component: Main },
  // { path: '/search', component: Search },
  // { path: '/develog', component: Develog },
  // { path: '/detail', component: Detail },
  // { path: '/signin', component: Signin },
  // { path: '/signup', component: Signup },
  // { path: '/mypage', component: Mypage },
  // { path: '/mypageEdit', component: MypageEdit },
  // { path: '/write', component: Write },
  // { path: '**', component: NotFound },
];

const renderByRoute = () => {
  const path = window.location.pathname.split('/');
  const targetPath = '/' + path[1];

  render(routes.find(route => route.path === targetPath).component);
};

// const render = ele => {
//   $root.replaceChildren();
//   $root.appendChild(ele); // fragment node
//   // $root.innerHTML = html;
//   // main.indexEvent;
// };

// const switchDependsOnUrl = () => {
//   const path = window.location.pathname.split('/');
//   // /\/[a-z]*/.test(path)
//   console.log(path);

//   const targetPath = '/' + path[1];

//   // if (/\/develog\/\d/.test(window.location.pathname)) {
//   //   const userId = path[2];
//   //   render(develog.develogHtml);
//   //   develog.develogEvent(userId);
//   // } else if (/\/search\/*/.test(window.location.pathname)) {
//   //   const searchTitle = decodeURIComponent(path[2]);
//   //   render(search.searchHtml);
//   //   search.searchEvent(searchTitle);
//   // } else {
//   //   const targetPath = '/' + path[1];
// };

// switchDependsOnUrl();

render(Main);

// url 변경감지
window.addEventListener('changestate', () => {
  renderByRoute();
});
