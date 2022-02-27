import Main from './main';
import Signin from './signin';
import Mypage from './mypage';
import MypageEdit from './mypageEdit';
import Signup from './signup';
import Develog from './develog';
import Search from './search';
import Detail from './detail';
import Write from './write';
import NotFound from './notFound';

const routes = [
  { path: '/', component: Main },
  { path: '/callback', component: Main },
  { path: '/search', component: Search },
  { path: '/develog', component: Develog },
  { path: '/detail', component: Detail },
  { path: '/write', component: Write },
  { path: '/mypage', component: Mypage },
  { path: '/mypageEdit', component: MypageEdit },
  { path: '/signin', component: Signin },
  { path: '/signup', component: Signup },
];

const router = () => {
  const path = window.location.pathname.split('/');
  const targetPath = '/' + path[1];
  const route = routes.find(route => route.path === targetPath);
  return route ? route.component() : NotFound();
};

export default router;
