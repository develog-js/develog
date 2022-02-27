const bcrypt = require('bcrypt');

let users = [{
    userId: 1,
    email: 'test1@gmail.com',
    password: '123123',
    nickname: 'User1',
    name: '송진영',
    phone: '010-1234-5678',
    social: false,
    avatarUrl: '/images/defaultAvatar.png',
  },
  {
    userId: 2,
    email: 'test2@gmail.com',
    password: '234234',
    nickname: 'User2',
    name: '김민성',
    phone: '010-2345-6789',
    social: false,
    avatarUrl: '/images/defaultAvatar.png',
  },
  {
    userId: 3,
    email: '1410ahs@gmail.com',
    password: 'gustj123',
    nickname: 'User3',
    name: '안현서',
    phone: '010-3456-7890',
    social: false,
    avatarUrl: '/images/defaultAvatar.png',
  },
  {
    userId: 4,
    email: 'test4@gmail.com',
    password: '456456',
    nickname: 'User4',
    name: '원종빈',
    phone: '010-4567-8901',
    social: false,
    avatarUrl: '/images/defaultAvatar.png',
  },
  {
    userId: 5,
    email: 'test5@gmail.com',
    password: '123456',
    nickname: 'User5',
    name: '앤트맨',
    phone: '010-4362-1156',
    social: false,
    avatarUrl: '/images/defaultAvatar.png',
  },
  {
    userId: 6,
    email: 'test6@gmail.com',
    password: '567890',
    nickname: 'User6',
    name: '원종빈',
    phone: '010-4782-4367',
    social: false,
    avatarUrl: '/images/defaultAvatar.png',
  },
];

users = users.map(user => ({
  ...user,
  password: bcrypt.hashSync(user.password, 10),
}));

module.exports = users;