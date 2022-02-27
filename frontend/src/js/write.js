import axios from 'axios';
import write from '../html/write.html';

const writeNode = () => {
  const node = document.createElement('div');
  const path = window.location.pathname;

  const button = /\/.*\/[0-9]+\/?/.test(path)
    ? '<button type="submit" class="upload__form__submit button">수정완료</button>'
    : '<button type="submit" class="upload__form__submit button">작성완료</button>';

  node.innerHTML = write.replace('{{submitButton}}', button);

  // path에 따라서 write, edit
  if (/\/.*\/[0-9]+\/?/.test(path)) {
    const postId = path.replace(/[^0-9]/g, '');
    // 수정페이지
    // 내 페이지가 아니면 팅김
    // 포스트 번호가 유효하지 않으면 팅김
    // 모두 아닌경우에 데이터 받아옴

    const title = node.querySelector('#upload-title');
    const content = node.querySelector('.upload__form__textarea');

    let user;

    (async () => {
      try {
        const { data } = await axios.get('/checkAuth');
        user = data;
        const { status, data: post } = await axios.post(`/checkPost/${postId}`, user);
        if (status === 400) history.pushState('{}', '', '/');
        else {
          title.value = post.title;
          content.value = post.content;
        }
      } catch (e) {
        console.error(e);
      }
    })();

    node.querySelector('.upload__form__submit').addEventListener('click', async e => {
      e.preventDefault();
      try {
        if (!user) history.pushState('{}', '', '/');
        await axios.patch(`/post/write/${postId}`, {
          title: title.value,
          content: content.value,
        });
        history.pushState({}, '', `/detail/${postId}`);
      } catch (e) {
        console.error(e);
      }
    });
  } else {
    // 작성페이지
    let user;

    (async () => {
      const { data } = await axios.get('/checkAuth');
      user = data;

      // 로그인되지 않은 유저는 로그인으로 보냄
      if (!user) history.pushState('{}', '', '/signin');
    })();

    node.querySelector('.upload__form__submit').addEventListener('click', async e => {
      e.preventDefault();

      try {
        const {
          data: { newPostId: postId },
        } = await axios.post('/post/write', {
          userId: user.userId,
          title: document.querySelector('#upload-title').value,
          content: document.querySelector('.upload__form__textarea').value,
        });
        history.pushState({}, '', `/detail/${postId}`);
      } catch (e) {
        console.error(e);
      }
    });
  }

  return node.children;
};

export default writeNode;
