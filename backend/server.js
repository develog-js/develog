require('dotenv').config();
const axios = require('axios');

const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const secureRandom = require('secure-random');
let users = require('./data/users');
let posts = require('./data/posts');

const makeSplitedPosts = (posts, startIdx, endIdx) => {
  const splitedPosts = posts
    .filter((post, i) => i >= startIdx && i < endIdx)
    .map(post => {
      const user = users.filter(user => user.userId === post.userId)[0];
      return {
        ...post,
        userProfile: user.avatarUrl,
        nickname: user.nickname,
      };
    });

  return splitedPosts;
};

const app = express();
const PORT = 9000;

app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());
app.use('/images', express.static('public/assets'));

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'public/assets/');
  },
  filename(req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({
  storage,
});

app.get('/checkAuth', (req, res) => {
  const accessToken = req.headers.authorization || req.cookies.accessToken; // || req.cookies.naverToken;
  try {
    const decoded = jwt.verify(accessToken, process.env.JWT_SECRET_KEY);
    res.send(users.find(user => user.userId === decoded.userId));
  } catch (e) {
    res.send();
  }
});

const createToken = (userId, expirePeriod) =>
  jwt.sign(
    {
      userId,
    },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: expirePeriod,
    }
  );

// social login
const client_id = '9P02ghMjMhgetbYuaf91';
const client_secret = 'iFNUotrjCS';
const state = secureRandom(10, {
  type: 'Buffer',
}).join('');
const redirectURI = encodeURI('http://localhost:8080/callback');

console.log(state);
// login button
app.get('/naverlogin', (req, res) => {
  res.send(state);
  // const api_url = 'https://nid.naver.com/oauth2.0/authorize?response_type=code&client_id=' + client_id + '&redirect_uri=' + redirectURI + '&state=' + state;
  // res.writeHead(200, {
  //   'Content-Type': 'text/html;charset=utf-8'
  // });
  // console.log(api_url);
  // res.end(`<a href="` + api_url + `" class="naver--link"><img class="naver--button" height="50" src="../assets/naverBtn.png"/></a>`);
  // res.end("<a href='" + api_url + "'><img height='50' src='http://static.nid.naver.com/oauth/small_g_in.PNG'/></a>");
});

const checkCode = async (req, res, next) => {
  try {
    const { code } = req.query;
    const { state } = req.query;
    const api_url = 'https://nid.naver.com/oauth2.0/token';

    const {
      data: { access_token, refresh_token, token_type, expires_in },
    } = await axios.post(api_url, null, {
      params: {
        client_id,
        client_secret,
        grant_type: 'authorization_code',
        state,
        code,
      },
    });

    console.log('access_token:', access_token, expires_in);

    const {
      data: {
        response: { email, nickname, profile_image, id, name, mobile },
      },
    } = await axios.post('https://openapi.naver.com/v1/nid/me', null, {
      headers: {
        Authorization: `Bearer ${access_token}`,
        // 'Content-type': 'application/x-www-form-urlencoded;charset=utf-8',
      },
    });
    console.log('========', email, nickname, profile_image, id, name, mobile);

    // =====================
    // social account로 login
    // if (!email || !id) {
    //   return res.status(401).send({
    //     error: '사용자 아이디 또는 패스워드가 전달되지 않았습니다.',
    //   });
    // }

    let user = users.find(user => email === user.email);

    if (!user) {
      // =====================
      // social account로 signup
      user = {
        userId: Math.max(...users.map(user => +user.userId), 0) + 1,
        email,
        password: bcrypt.hashSync(id, 10),
        name,
        nickname,
        phone: mobile,
        social: true,
        avatarUrl: profile_image,
      };
      users = [...users, user];
    }

    res.cookie('accessToken', createToken(user.userId, '7d'), {
      maxAge: 1000 * 60 * 60 * 24 * 7,
      httpOnly: true,
    });

    const _id = user.userId;

    // res.send({
    //   _id,
    // });
    console.log(user);
    next();
  } catch (e) {
    console.error(e);
    res.send({
      message: '로그인이 되지 않았습니다.\n로그인을 다시 시도해주세요.',
    });
  }
};

app.get('/callback', checkCode, (req, res) => {
  res.sendFile(path.join(__dirname, './public/index.html'));

  // res.send();
});

// 로그인
app.post('/signin', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(401).send({
      error: '사용자 아이디 또는 패스워드가 전달되지 않았습니다.',
    });
  }
  const user = users.find(user => email === user.email && bcrypt.compareSync(password, user.password));

  console.log('user', user);
  if (!user) {
    return res.status(401).send({
      error: '등록되지 않은 사용자입니다.',
    });
  }

  res.cookie('accessToken', createToken(user.userId, '7d'), {
    maxAge: 1000 * 60 * 60 * 24 * 7,
    httpOnly: true,
  });

  const _id = user.userId;

  res.send({
    _id,
  });
});

// 로그아웃
app.get('/logout', (req, res) => {
  req.cookies.accessToken
    ? res.clearCookie('accessToken').sendStatus(204)
    : res.clearCookie('naverToken').sendStatus(204);
});

// 회원가입
app.post('/signup', (req, res) => {
  users = [
    ...users,
    {
      ...req.body,
      social: false,
      password: bcrypt.hashSync(req.body.password, 10),
    },
  ];

  res.send(users);
});

app.get('/check/social/:id', (req, res) => {
  const { id } = req.params;
  const user = users.find(user => user.id === id);
  const isSocial = user.social;

  res.send({
    isSocial,
  });
});

// 중복확인(이메일, 닉네임)
app.get('/check/email/:email', (req, res) => {
  const { email } = req.params;
  const user = users.find(user => user.email === email);
  const isDuplicate = !!user;

  res.send({
    isDuplicate,
  });
});

app.get('/check/nickname/:nickname', (req, res) => {
  const { nickname } = req.params;
  const user = users.find(user => user.nickname === nickname);
  const isDuplicate = !!user;

  res.send({
    isDuplicate,
  });
});

// _id 생성(user, post)
app.get('/users/createId', (req, res) => {
  const maxId = Math.max(...users.map(user => +user.userId), 0) + 1;

  res.send({
    maxId,
  });
});

// 검색
app.get('/search', (req, res) => {
  const searchTitle = req.query.title;
  const filterPosts = posts.filter(post => post.title.includes(searchTitle) || post.content.includes(searchTitle));
  res.send(makeSplitedPosts(filterPosts, 0, filterPosts.length));
});

// 메인화면 초기 렌더링
app.get('/posts/init', (req, res) => {
  res.send(makeSplitedPosts(posts, 0, 12));
});

// 메인화면
app.get('/posts/:mainIndex/split', (req, res) => {
  let { mainIndex } = req.params;
  mainIndex = Number(mainIndex);

  res.send(makeSplitedPosts(posts, mainIndex * 12, mainIndex * 12 + 12));
});

app.get('/develog/:userId/popularposts', (req, res) => {
  let { userId } = req.params;
  userId = Number(userId);
  const userPost = posts.filter(post => post.userId === userId);
  userPost.sort((a, b) => b.likedUsers.length - a.likedUsers.length);
  res.send(userPost.filter((post, i) => i < 3));
});

app.get('/develog/:userId/posts/:develogIndex', (req, res) => {
  let { userId, develogIndex } = req.params;

  userId = Number(userId);
  develogIndex = Number(develogIndex);
  const userPost = posts.filter(post => post.userId === userId);
  res.send([makeSplitedPosts(userPost, develogIndex * 8, develogIndex * 8 + 8), userPost.length]);
});

app.get('/develog/userPostsNum', (req, res) => {});

app.post('/uploadImage', upload.single('selectImage'), (req, res) => {
  res.send(req.files);
});

app.patch('/editUser/:userId', (req, res) => {
  const { userId } = req.params;
  users = users.map(user =>
    user.userId === +userId
      ? user.social
        ? {
            ...user,
            ...req.body,
          }
        : {
            ...user,
            ...req.body,
            password: bcrypt.hashSync(req.body.password, 10),
          }
      : user
  );
  res.sendStatus(204);
});

app.post('/checkPassword/:userId', (req, res) => {
  const { userId } = req.params;
  const user = users.find(user => user.userId === +userId);

  if (bcrypt.compareSync(req.body.password, user.password)) res.sendStatus(204);
  else res.send('failed');
});

// 유저 탈퇴
app.post('/delete/user/:userId', (req, res) => {
  const { userId } = req.params;
  const user = users.find(user => user.userId === +userId);

  if (user.social) res.clearCookie('accessToken').sendStatus(204);
  else if (bcrypt.compareSync(req.body.password, user.password)) {
    users = users.filter(user => user.userId !== +userId);
    posts = posts.filter(post => post.userId !== +userId);
    res.clearCookie('accessToken').sendStatus(204);
  } else {
    res.send('failed');
  }
});

// User 정보
app.get('/users/:nickname', (req, res) => {
  const { nickname } = req.params;
  const { userId } = users.find(user => user.nickname === nickname);
  res.send(`${userId}`);
});

// 포스트 정보
app.get('/posts/:id', (req, res) => {
  const { id } = req.params;
  const post = posts.find(post => post.postId === +id);
  const user = users.find(user => user.userId === post.userId);
  // console.log('post : ', post, 'user :', user);
  res.send({
    post,
    user,
  });
});

// 좋아요 배열
app.get('/posts/likedUsers/:id', (req, res) => {
  const { id } = req.params;
  const findPostLikedUsers = posts.find(post => post.postId === +id);
  // console.log(findPostLikedUsers);
  res.send(findPostLikedUsers);
});

// 좋아요 배열 수정
app.patch('/posts/likedUsers/:id', (req, res) => {
  // 로그인된 userId
  const { id } = req.params;
  const { loginUserId, isFullHeart } = req.body;
  // console.log('id:', id, 'loginUserId:', loginUserId, 'isFullHeart:', isFullHeart);
  posts = posts.map(post =>
    post.postId === +id
      ? {
          ...post,
          likedUsers: isFullHeart
            ? [...post.likedUsers, loginUserId]
            : post.likedUsers.filter(elem => elem !== loginUserId),
        }
      : post
  );
});

// 댓글 등록
app.post('/comment/:userId', (req, res) => {
  const { userId: loginUserId } = req.params;
  const { postId, userComment } = req.body;
  const user = users.find(user => user.userId === +loginUserId);
  const date = new Date();
  const { userId, nickname, avatarUrl } = user;
  posts = posts.map(post =>
    post.postId === +postId
      ? {
          ...post,
          comments: [
            {
              userId,
              nickname,
              commentId: Math.max(...post.comments.map(comment => comment.commentId)) + 1,
              comment: userComment,
              createAt: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
                .getDate()
                .toString()
                .padStart(2, '0')}`,
              avatarUrl,
            },
            ...post.comments,
          ],
        }
      : post
  );
  const post = posts.find(post => post.postId === +postId);
  // console.log(post.comments);
  res.send(post.comments);
});

// 댓글 삭제
app.delete('/posts/:id/:commentId', (req, res) => {
  const { id: postId, commentId } = req.params;
  console.log(postId, commentId);
  posts = posts.map(post =>
    post.postId === +postId
      ? {
          ...post,
          comments: post.comments.filter(comment => comment.commentId !== +commentId),
        }
      : post
  );
  res.send(posts.find(post => post.postId === +postId).comments);
});

// 글 삭제
app.delete('/posts/:id', (req, res) => {
  const { id } = req.params;
  // console.log('postid: ', id);
  posts = posts.filter(post => post.postId !== +id);
});

// 포스트작성
app.post('/post/write', (req, res) => {
  const newPostId = Math.max(...posts.map(post => +post.postId)) + 1;
  const date = new Date();
  posts = [
    {
      ...req.body,
      postId: newPostId,
      createAt: `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date
        .getDate()
        .toString()
        .padStart(2, '0')}`,
      likedUsers: [],
      comments: [],
    },
    ...posts,
  ];
  // console.log(posts)
  res.send({
    newPostId,
  });
});

app.post('/checkPost/:postId', (req, res) => {
  const { postId } = req.params;
  console.log(postId);
  const post = posts.find(post => post.postId === +postId);
  console.log(post);
  // 해당 포스트가 존재하지 않거나, 해당 유저의 페이지가 아닌경우
  if (!post || !(post.userId === req.body.userId)) res.sendStatus(400);
  else res.send(post);
});

// 포스트 수정
app.patch('/post/write/:postId', (req, res) => {
  const { postId } = req.params;
  posts = posts.map(post =>
    post.postId === +postId
      ? {
          ...post,
          ...req.body,
        }
      : post
  );
  res.send(204);
});

app.get('/likePostCnt/:userId', (req, res) => {
  const { userId } = req.params;
  const likePost = posts.filter(post => post.likedUsers.includes(+userId));
  res.send(likePost);
});

app.get('*', (req, res) => {
  // console.log('sendFile', req.headers.referer);
  res.sendFile(path.join(__dirname, './public/index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`);
});
