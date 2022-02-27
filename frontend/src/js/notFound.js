import notFound from '../html/notFound.html';

const notFoundNode = () => {
  const node = document.getElementById('root');
  node.innerHTML = notFound;

  return node.children;
};

export default notFoundNode;
