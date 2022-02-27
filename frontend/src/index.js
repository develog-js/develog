import '@fortawesome/fontawesome-free/js/fontawesome';
import '@fortawesome/fontawesome-free/js/solid';
import '@fortawesome/fontawesome-free/js/regular';
import '@fortawesome/fontawesome-free/js/brands';
import 'boxicons';

import App from './js/app';
import createHeaderNode from './js/header';

const history = require('history-events');

const $root = document.getElementById('root');

const render = async elem => {
  const headerNode = await createHeaderNode();
  $root.replaceChildren(...headerNode, ...elem);
};

render(App());

// url 변경감지
window.addEventListener('changestate', () => {
  render(App());
});
