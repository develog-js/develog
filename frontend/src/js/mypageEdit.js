import validate from './validate.js';
import axios from 'axios';
import mypageEdit from '../html/mypageEdit.html';

const mypageEditNode = () => {
  const node = document.createElement('div');
  node.innerHTML = mypageEdit;

  const userProfileSet = async avatar => {
    try {
      const { data: user } = await axios.get('/checkAuth');
      if (user.social) {
        node.querySelector('.complete.passwordVal').classList.remove('hidden');
        node.querySelector('.complete.passwordConfirmVal').classList.remove('hidden');

        node.querySelector('.input--password').classList.add('hidden');
        node.querySelector('.input--confirmPassword').classList.add('hidden');
      }
      node.querySelector('#nickname').value = user.nickname;
      node.querySelector('#name').value = user.name;
      node.querySelector('#email').value = user.email;
      node.querySelector('#phone').value = user.phone;
      avatar.style.backgroundImage = `url('${user.avatarUrl}')`;
    } catch (e) {
      console.error(e);
    }
  };

  // const activeBtn = () => {
  //   const $checkComplete = [...node.querySelectorAll('.complete')].filter(i => !i.classList.contains('hidden'));
  //   if (node.querySelector('.double-check').style.backgroundColor === 'green' && $checkComplete.length === 6)
  //     $editBtn.removeAttribute('disabled');
  // };

  const $avatar = node.querySelector('.mypageEdit--avatar');
  userProfileSet($avatar);

  const $editBtn = node.querySelector('.button--editComplete');
  const $nickName = node.querySelector('#nickname');
  const $doubleCheckBtn = node.querySelector('.double-check');
  const $doubleCheckMsg = node.querySelector('.doubleCheck-message');
  const $checkMsg = node.querySelector('.check-message');
  const $errorMsg = node.querySelector('.error-message.nicknameVal');

  const showDoubleCheckMsg = () => {
    if (
      $doubleCheckBtn.classList.contains('checking') ||
      !$checkMsg.classList.contains('hidden') ||
      !$errorMsg.classList.contains('hidden')
    )
      $doubleCheckMsg.classList.add('hidden');
    else $doubleCheckMsg.classList.remove('hidden');
  };

  node.querySelector('.mypageEdit--form').oninput = e => {
    if (e.target === document.querySelector('#password'))
      validate.passwordValidate(e.target.value, document.querySelector('#confirmPassword').value);
    if (e.target === document.querySelector('#confirmPassword'))
      validate.passwordValidate(document.querySelector('#password').value, e.target.value);
    if (e.target === document.querySelector('#name')) validate.nameValidate(e.target.value);
    if (e.target === document.querySelector('#nickname')) validate.nicknameValidate(e.target.value);
    if (e.target === document.querySelector('#phone')) validate.phoneValidate(e.target.value);
    showDoubleCheckMsg();
  };

  $doubleCheckBtn.onclick = async () => {
    const { data: user } = await axios.get('/checkAuth');
    if (user.nickname === $nickName.value) {
      $checkMsg.classList.add('hidden');
      $doubleCheckBtn.classList.add('checking');
      validate.activeSubmitButton();
    } else {
      const { data: isDuplicate } = await axios.get('/check/nickname/' + $nickName.value);
      validate.isNicknameDuplicate(isDuplicate.isDuplicate);
    }
    showDoubleCheckMsg();
  };

  const reader = new FileReader();
  reader.onload = () => {
    $avatar.style.backgroundImage = `url('${reader.result}')`;
  };
  node.querySelector('#selectImage').onchange = e => {
    reader.readAsDataURL(e.target.files[0]);
  };

  node.querySelector('.button--back').addEventListener('click', e => {
    e.preventDefault();
    window.history.back(1);
  });

  node.querySelector('.button--editComplete').addEventListener('click', async e => {
    e.preventDefault();

    const config = {
      header: {
        'content-type': 'multipart/form-data',
      },
    };

    try {
      const { data: user } = await axios.get('/checkAuth');

      console.log(user.avatarUrl);

      const $fileImage = document.querySelector('#selectImage');

      const formData = new FormData();

      console.log($fileImage.files[0]);
      // avatar를 수정했을때
      if ($fileImage.files[0]) {
        formData.append('selectImage', $fileImage.files[0]);
        formData.append('filename', $fileImage.files[0].name);

        console.log(formData);

        await axios.post('/uploadImage', formData, config).then(response => {
          if (response.status === 200) {
            axios.patch(
              `/editUser/${user.userId}`,
              user.social
                ? {
                    nickname: document.querySelector('#nickname').value,
                    name: document.querySelector('#name').value,
                    phone: document.querySelector('#phone').value,
                    avatarUrl: $fileImage.files[0] ? `/images/${$fileImage.files[0].name}` : user.avatarUrl,
                  }
                : {
                    password: document.querySelector('#password').value,
                    nickname: document.querySelector('#nickname').value,
                    name: document.querySelector('#name').value,
                    phone: document.querySelector('#phone').value,
                    avatarUrl: $fileImage.files[0] ? `/images/${$fileImage.files[0].name}` : user.avatarUrl,
                  }
            );
          }
        });
        // avatar를 수정하지 않았을때
      } else {
        console.log('else');
        axios.patch(
          `/editUser/${user.userId}`,
          user.social
            ? {
                nickname: document.querySelector('#nickname').value,
                name: document.querySelector('#name').value,
                phone: document.querySelector('#phone').value,
                avatarUrl: $fileImage.files[0] ? `/images/${$fileImage.files[0].name}` : user.avatarUrl,
              }
            : {
                password: document.querySelector('#password').value,
                nickname: document.querySelector('#nickname').value,
                name: document.querySelector('#name').value,
                phone: document.querySelector('#phone').value,
                avatarUrl: $fileImage.files[0] ? `/images/${$fileImage.files[0].name}` : user.avatarUrl,
              }
        );
      }
    } catch (e) {
      console.log(e);
    }
    window.history.back(1);
  });

  return node.children;
};

export default mypageEditNode;
