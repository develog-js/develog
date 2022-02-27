import axios from 'axios';
import validate from './validate';
import signup from '../html/signup.html';

const signupNode = () => {
  const node = document.createElement('div');
  node.innerHTML = signup;

  const $signupBtn = node.querySelector('.sign-buttons.signup .button');

  node.querySelector('.sign-form').oninput = e => {
    if (e.target === document.querySelector('#email')) validate.emailValidate(e.target.value);
    if (e.target === document.querySelector('#password'))
      validate.passwordValidate(e.target.value, document.querySelector('#confirmPassword').value);
    if (e.target === document.querySelector('#confirmPassword'))
      validate.passwordValidate(document.querySelector('#password').value, e.target.value);
    if (e.target === document.querySelector('#name')) validate.nameValidate(e.target.value);
    if (e.target === document.querySelector('#nickname')) validate.nicknameValidate(e.target.value);
    if (e.target === document.querySelector('#phone')) validate.phoneValidate(e.target.value);
  };

  node.querySelector('.double-check.emailVal').onclick = async () => {
    const {
      data: isDuplicate
    } = await axios.get('/check/email/' + document.querySelector('#email').value);
    validate.isEmailDuplicate(isDuplicate.isDuplicate);
  };

  node.querySelector('.double-check.nicknameVal').onclick = async () => {
    const {
      data: isDuplicate
    } = await axios.get('/check/nickname/' + document.querySelector('#nickname').value);
    validate.isNicknameDuplicate(isDuplicate.isDuplicate);
  };

  $signupBtn.onclick = async e => {
    e.preventDefault();

    try {
      const {
        data: maxId
      } = await axios.get('/users/createId');
      const newId = maxId.maxId;
      const {
        data: user
      } = await axios.post('/signup', {
        userId: newId,
        email: document.querySelector('#email').value,
        password: document.querySelector('#password').value,
        name: document.querySelector('#name').value,
        nickname: document.querySelector('#nickname').value,
        phone: document.querySelector('#phone').value,
        avatarUrl: 'images/defaultAvatar.png',
      });
      if (user) {
        window.history.pushState(null, null, '/signin');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return node.children;
};

export default signupNode;