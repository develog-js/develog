import axios from 'axios';

let mainIndex = 1;
let develogIndex = 0;

const setPosts = posts =>
  posts
    .map(
      post =>
        `<li class="main-post" data-post-id="${post.postId}">
    <div class="user-info" data-user-id="${post.userId}">
      <button class="avatar-button avatar-button--main" style="background-image:url('${post.userProfile}')"></button>
      <a class="user-nickname">${post.nickname}</a>
    </div>
    <span class="main-post__title">${post.title}</span
    ><span class="main-post__desc">${post.content}</span>
  </li>`
    )
    .join('');

const setSearchPosts = posts =>
  posts
    .map(
      post =>
        `<li class="search-post" data-post-id="${post.postId}">
    <div class="user-info" data-user-id="${post.userId}">
      <button class="avatar-button avatar-button--search" style="background-image:url('${post.userProfile}')"></button>
      <a class="user-nickname">${post.nickname}</a>
    </div>
    <span class="search-post__title">${post.title}</span
    ><span class="search-post__desc">${post.content}</span>
  </li>`
    )
    .join('');

const getPosts = async () => {
  try {
    const { data } = await axios.get(`/posts/${mainIndex}/split`);
    mainIndex += 1;
    if (data.length < 12) {
      document.querySelector('.see-more').classList.add('hidden');
      document.querySelector('.is-last-post').classList.remove('hidden');
    }
    document.querySelector('.posts-container').innerHTML += setPosts(data);
  } catch (e) {
    console.error(e);
  }
};

const mainPageInitialRender = async $postsContainer => {
  try {
    const { data } = await axios.get('/posts/init');
    mainIndex = 1;
    const addedHtml = setPosts(data);
    $postsContainer.innerHTML = addedHtml;
  } catch (e) {
    console.error(e);
  }
};

const addPopularPosts = posts =>
  posts
    .map(
      post =>
        `<li class="post" data-post-id="${post.postId}">
      <span class="post__title">${post.title}</span><span class="post__desc">${post.content}</span>
    </li>`
    )
    .join('');

const setPopularPosts = async ($populaPpostsContainer, userId) => {
  try {
    develogIndex = 0;
    const { data } = await axios.get(`/develog/${userId}/popularposts`);
    const popularposts = addPopularPosts(data);
    $populaPpostsContainer.innerHTML = popularposts;
  } catch (e) {
    console.error(e);
  }
};

const addUserPosts = posts =>
  posts
    .map(
      post =>
        `<li class="post" data-post-id="${post.postId}">
           <span class="post__title">${post.title}</span>
        <span class="post__desc">${post.content}</span>
         </li>`
    )
    .join('');

const getUserPosts = async ($allPostContainer, userId, $postNum) => {
  try {
    const { data } = await axios.get(`/develog/${userId}/posts/${develogIndex}`);
    develogIndex += 1;
    $postNum.textContent = `  ${data[1]}`;
    if (data[0].length < 8) {
      document.querySelector('.see-more--develog').classList.add('hidden');
    }
    const userPosts = addUserPosts(data[0]);
    $allPostContainer.innerHTML += userPosts;
  } catch (e) {
    console.error(e);
  }
};

const develogPageInitialRender = async ($populaPpostsContainer, $allPostContainer, userId, $postNum) => {
  await setPopularPosts($populaPpostsContainer, userId);
  await getUserPosts($allPostContainer, userId, $postNum);
};

const showSearchedPosts = async (
  searchTitle,
  $postsContainer,
  $span,
  $keyword,
  $keywordNum,
  $postsInfo,
  $noKeyword
) => {
  try {
    const { data } = await axios.get(`/search?title=${searchTitle}`);
    if (data.length === 0) {
      $postsInfo.classList.add('hidden');
      $noKeyword.textContent = `"${searchTitle}" `;
      $span.textContent = '키워드가 포함된 포스트가 없습니다.';
    } else {
      $keyword.textContent = `"${searchTitle}" `;
      $keywordNum.textContent = data.length;
      const addedHtml = setSearchPosts(data);
      $postsContainer.innerHTML = addedHtml;
    }
  } catch (e) {
    console.error(e);
  }
};

export default {
  mainPageInitialRender,
  getPosts,
  develogPageInitialRender,
  getUserPosts,
  showSearchedPosts,
};
