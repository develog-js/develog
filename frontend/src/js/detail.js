import detail from '../html/detail.html';
import detailEvents from './detailEvents';
// console.log(detail);

const $root = document.querySelector('.root');

const Detail = () => {
  let $detailNode = document.createElement('div');
  $detailNode.innerHTML = detail;
  detailEvents($detailNode.querySelector('.detail-container'));

  return $detailNode.children;
};

export default Detail;
