const reg = {
  email: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/,
  password: /^[A-Za-z0-9]{6,12}$/,
  name: /^[^\s]{1,}$/,
  phone: /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/,
};

const activeSubmitButton = () => {
  const complete = [...document.querySelectorAll('.complete')].filter(complete =>
    complete.classList.contains('hidden')
  ).length;
  let check = 0;

  if (document.querySelector('.double-check.nicknameVal')) {
    check =
      document.querySelectorAll('.double-check').length - [...document.querySelectorAll('.double-check')].filter(check => check.classList.contains('checking')).length;
  }

  if (!complete && !check) {
    if (document.querySelector('.sign-buttons button:last-child'))
      document.querySelector('.sign-buttons button:last-child').removeAttribute('disabled');
    else document.querySelector('.button--editComplete').removeAttribute('disabled');
  } else if (document.querySelector('.sign-buttons button:last-child'))
    document.querySelector('.sign-buttons button:last-child').setAttribute('disabled', '');
  else document.querySelector('.button--editComplete').setAttribute('disabled', '');
  console.log(complete, check);
};

const emailValidate = value => {
  if (document.querySelector('.double-check.emailVal')) {
    document.querySelector('.double-check.emailVal').classList.remove('checking');
    document.querySelector('.check-message.emailVal').classList.add('hidden');
  }
  if (!reg.email.test(value)) {
    document.querySelector('.complete.emailVal').classList.add('hidden');
    document.querySelector('.error.emailVal').classList.remove('hidden');
    document.querySelector('.error-message.emailVal').classList.remove('hidden');
    if (document.querySelector('.double-check.emailVal'))
      document.querySelector('.double-check.emailVal').setAttribute('disabled', '');
  } else {
    document.querySelector('.complete.emailVal').classList.remove('hidden');
    document.querySelector('.error.emailVal').classList.add('hidden');
    document.querySelector('.error-message.emailVal').classList.add('hidden');
    if (document.querySelector('.double-check.emailVal'))
      document.querySelector('.double-check.emailVal').removeAttribute('disabled');
  }
  activeSubmitButton();
};

const passwordValidate = (value1, value2) => {
  if (!reg.password.test(value1)) {
    document.querySelector('.complete.passwordVal').classList.add('hidden');
    document.querySelector('.error.passwordVal').classList.remove('hidden');
    document.querySelector('.error-message.passwordVal').classList.remove('hidden');
  } else {
    document.querySelector('.complete.passwordVal').classList.remove('hidden');
    document.querySelector('.error.passwordVal').classList.add('hidden');
    document.querySelector('.error-message.passwordVal').classList.add('hidden');
  }
  if (value2) {
    if (!reg.password.test(value2) || value1 !== value2) {
      document.querySelector('.complete.passwordConfirmVal').classList.add('hidden');
      document.querySelector('.error.passwordConfirmVal').classList.remove('hidden');
      document.querySelector('.error-message.passwordConfirmVal').classList.remove('hidden');
    } else {
      document.querySelector('.complete.passwordConfirmVal').classList.remove('hidden');
      document.querySelector('.error.passwordConfirmVal').classList.add('hidden');
      document.querySelector('.error-message.passwordConfirmVal').classList.add('hidden');
    }
  }
  activeSubmitButton();
};

const nameValidate = value => {
  if (!reg.name.test(value)) {
    document.querySelector('.complete.nameVal').classList.add('hidden');
    document.querySelector('.error.nameVal').classList.remove('hidden');
    document.querySelector('.error-message.nameVal').classList.remove('hidden');
  } else {
    document.querySelector('.complete.nameVal').classList.remove('hidden');
    document.querySelector('.error.nameVal').classList.add('hidden');
    document.querySelector('.error-message.nameVal').classList.add('hidden');
  }
  activeSubmitButton();
};

const nicknameValidate = value => {
  if (document.querySelector('.double-check.nicknameVal')) {
    document.querySelector('.double-check.nicknameVal').classList.remove('checking');
    document.querySelector('.check-message.nicknameVal').classList.add('hidden');
  }
  if (!reg.name.test(value)) {
    document.querySelector('.complete.nicknameVal').classList.add('hidden');
    document.querySelector('.error.nicknameVal').classList.remove('hidden');
    document.querySelector('.error-message.nicknameVal').classList.remove('hidden');
    if (document.querySelector('.double-check.nicknameVal'))
      document.querySelector('.double-check.nicknameVal').setAttribute('disabled', '');
  } else {
    document.querySelector('.complete.nicknameVal').classList.remove('hidden');
    document.querySelector('.error.nicknameVal').classList.add('hidden');
    document.querySelector('.error-message.nicknameVal').classList.add('hidden');
    if (document.querySelector('.double-check.nicknameVal'))
      document.querySelector('.double-check.nicknameVal').removeAttribute('disabled');
  }
  activeSubmitButton();
};

const phoneValidate = value => {
  if (!reg.phone.test(value)) {
    document.querySelector('.complete.phoneVal').classList.add('hidden');
    document.querySelector('.error.phoneVal').classList.remove('hidden');
    document.querySelector('.error-message.phoneVal').classList.remove('hidden');
  } else {
    document.querySelector('.complete.phoneVal').classList.remove('hidden');
    document.querySelector('.error.phoneVal').classList.add('hidden');
    document.querySelector('.error-message.phoneVal').classList.add('hidden');
  }
  activeSubmitButton();
};

const isEmailDuplicate = duplicate => {
  if (!duplicate) document.querySelector('.double-check.emailVal').classList.add('checking');
  else {
    document.querySelector('.double-check.emailVal').classList.remove('checking');
    document.querySelector('.check-message.emailVal').classList.remove('hidden');
  }
  activeSubmitButton();
};

const isNicknameDuplicate = duplicate => {
  if (!duplicate) document.querySelector('.double-check.nicknameVal').classList.add('checking');
  else {
    document.querySelector('.double-check.nicknameVal').classList.remove('checking');
    document.querySelector('.check-message.nicknameVal').classList.remove('hidden');
  }
  activeSubmitButton();
};

export default {
  emailValidate,
  passwordValidate,
  nameValidate,
  nicknameValidate,
  phoneValidate,
  isEmailDuplicate,
  isNicknameDuplicate,
  activeSubmitButton,
};