import axios from 'axios';

const mypageNode = () => {
  const node = document.createElement('div');
  node.innerHTML = `
<div class="cover hidden"></div>

<div class="container">
  <section class="user-profile">
    <h2 class="a11yHidden">회원 정보</h2>
    <div class="user-profile-avatar"></div>
    <div class="user-profile-info">
      <div class="nickname">
        <span></span>
        <span>님, 환영합니다.</span>
      </div>
      <div class="user-profile-info-input">
        <label for="name">name :</label>
        <input id="name" type="text" disabled>
      </div>
      <div class="user-profile-info-input">
        <label for="email">email :</label>
        <input id="email" type="email" disabled>
      </div>
      <div class="user-profile-info-input">
        <label for="phone">phone :</label>
        <input id="phone" type="text" disabled>
      </div>
    </div>
  </section>

  <section class="information">
    <h2 class="a11yHidden">좋아요한 블로그 포스팅 목록</h2>
    <div class="postNum">
      <span>내 블로그 글 개수</span>
      <span>12</span>
    </div>

  </section>
  <section class="button-box">
    <button class="button button--edit">회원정보 수정</button>
    <button class="button button--withdrawal">회원탈퇴</button>
  </section>

  <section class="withdrawal hidden">
    <h2 class="a11yHidden">회원탈퇴 확인 팝업</h2>
    <button class="withdrawal--close"><i class="fas fa-times"></i></button>
    <h3>회원탈퇴를 하시려면 비밀번호를 입력후 회원탈퇴 버튼을 눌러주세요.</h3>
    <input class="withdrawal--password" type="password" placeholder="비밀번호를 입력해주세요.">
    <span class="error-message hidden">비밀번호가 일치하지 않습니다. 3회 이상 틀리면 로그아웃됩니다.</span>
    <button type="button" class="button button--withdrawal withdrawal-confirm">회원탈퇴</button>
  </section>
  
  <section class="profileEdit hidden">
    <h2 class="a11yHidden">수정페이지 이동 전 비밀번호 확인</h2>
    <button class="profileEdit--close"><i class="fas fa-times"></i></button>
    <h3>수정페이지로 이동하시려면 비밀번호를 입력하세요.</h3>
    <input class="profileEdit--password" type="password" placeholder="비밀번호를 입력해주세요.">
    <span class="error-message hidden">비밀번호가 일치하지 않습니다. 3회 이상 틀리면 로그아웃됩니다.</span>
    <button type="button" class="button button--edit profileEdit-confirm">비밀번호 확인</button>
  </section>
</div>`;

  // Event
  (async () => {
    try {
      const { data: user } = await axios.get('/checkAuth');
      node.querySelector('.nickname span').textContent = user.nickname;
      node.getElementById('name').value = user.name;
      node.getElementById('email').value = user.email;
      node.getElementById('phone').value = user.phone;
      node.querySelector('.user-profile-avatar').style.backgroundImage = `url('${user.avatarUrl}')`;
    } catch (e) {
      console.error(e);
      window.history.pushState({}, '', '/signin');
    }
  })();

  let checkPasswordCnt = 0;
  userProfileSet();

  header.headerEvent();

  const withdrawalToggle = () => {
    node.querySelector('.cover').classList.toggle('hidden');
    node.querySelector('.withdrawal').classList.toggle('hidden');
  };

  const editToggle = () => {
    node.querySelector('.cover').classList.toggle('hidden');
    node.querySelector('.profileEdit').classList.toggle('hidden');
  };

  node.querySelector('.button--withdrawal').onclick = withdrawalToggle;
  node.querySelector('.withdrawal--close').onclick = withdrawalToggle;
  node.querySelector('.button--edit').onclick = editToggle;
  node.querySelector('.profileEdit--close').onclick = editToggle;

  const $error = node.querySelectorAll('.error-message');

  node.querySelector('.profileEdit-confirm').onclick = async restApi => {
    try {
      const { data: user } = await axios.get('/checkAuth');
      const data = await axios.post(`/checkPassword/${user.userId}`, {
        password: node.querySelector('.profileEdit--password').value,
      });
      // console.log(data);
      if (data.status === 204) window.history.pushState({ data: 'user' }, '', '/mypageEdit');
      else if (data.data === 'failed') {
        checkPasswordCnt += 1;
        if (checkPasswordCnt < 4) {
          $error[1].textContent = `비밀번호가 일치하지 않습니다. 4회 이상 틀리면 로그아웃됩니다. (${checkPasswordCnt}/4)`;
        } else {
          const check = await axios.get('/logout');
          if (check.status === 204) window.history.pushState({}, '', '/');
        }
      }
      $error[1].classList.remove('hidden');
    } catch (e) {
      console.log(e);
    }
  };

  node.querySelector('.withdrawal-confirm').onclick = async restApi => {
    try {
      const { data: user } = await axios.get('/checkAuth');
      const data = await axios.post(`/delete/user/${user.userId}`, {
        password: node.querySelector('.withdrawal--password').value,
      });
      // console.log(data);
      if (data.status === 204) window.history.pushState({}, '', '/');
      else if (data.data === 'failed') {
        checkPasswordCnt += 1;
        if (checkPasswordCnt < 4) {
          $error[0].textContent = `비밀번호가 일치하지 않습니다. 4회 이상 틀리면 로그아웃됩니다. (${checkPasswordCnt}/4)`;
        } else {
          const check = await axios.get('/logout');
          if (check.status === 204) window.history.pushState({}, '', '/');
        }
      }
      $error[0].classList.remove('hidden');
    } catch (e) {
      console.log(e);
    }
  };

  return node.children;
};

export default mypageNode;
