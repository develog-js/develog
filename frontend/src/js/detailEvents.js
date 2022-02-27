import axios from 'axios';

const setPostData = ({ post, user }, loginUserId, loginUser, userClickedHeart) =>
  `
<section class="detail">
	<h1 class="detail__title">${post.title}</h1>
	<div class="detail__info">
    <button class="avatar-button avatar-button--size" style="background-image:url('${user.avatarUrl}')"></button>
		<span class="author">${user.nickname}</span>
		<span class="date">${post.createAt}</span>
		<button class="${userClickedHeart ? 'none ' : ''}fullheart heart-btn btn">
			<i class="far fa-heart"></i>
		</button>
		<button class="${userClickedHeart ? '' : 'none '}fullheart heart-btn btn">
			<i class="fas fa-heart"></i>
		</button>
		<button class="${loginUserId === post.userId ? '' : 'none '}edit pencil-btn btn">
			<i class="far fa-edit"></i>
		</button>
		<button class="${loginUserId === post.userId ? '' : 'none '}edit trash-btn btn">
			<i class="far fa-trash-alt"></i>
		</button>
	</div>
	<pre class="detail__content">${post.content}</pre>
</section>

<h2 class="comments-title">댓글</h2>
<section class="user-comment">
	<div class="comment__user-info">
    <button class="avatar-button avatar-button--size" style="background-image:url('${loginUser.avatarUrl}')"></button>
		<span class="user-id">${loginUserId ? loginUser.nickname : 'Guest'}</span>
	</div>
	<div class="textarea-container">
		<textarea class="textarea" id="input-box" rows="3" maxlength="100" placeholder="댓글을 입력해주세요."></textarea>
		<button class="textarea__cancel btn no-display">
			<i class="fas fa-times"></i>
		</button>
	</div>
	<button class="user-comment__upload button">등록</button>
</section>

<section class="comments">
	${post.comments
    .map(
      comment => `
	<div class="comment">
		<div class="comment__user-info">
			<button class="avatar-button avatar-button--size btn" style="background-image:url(${comment.avatarUrl}">
			</button>
			<span class="user-id">${comment.nickname}</span>
		</div>
		<div class="comment__text">
			<span>${comment.comment}</span>
		</div>
		<span class="date">${comment.createAt}</span>
		<button class="${loginUserId === comment.userId ? '' : 'none '}edit trash-btn btn" data-commentid="${
        comment.commentId
      }">
			<i class="far fa-trash-alt"></i>
		</button>
	</div>`
    )
    .join('')}
</section>
`;

const setCommentData = (comments, loginUserId) =>
  comments
    .map(
      comment => `
						<section class="comments">
							<div class="comment">
								<div class="comment__user-info">
									<button class="avatar-button avatar-button--size btn" style="background-image:url(${comment.avatarUrl}">
									</button>
									<span class="user-id">${comment.nickname}</span>
								</div>
								<div class="comment__text">
									<span>${comment.comment}</span>
								</div>
								<span class="date">${comment.createAt}</span>
								<button class="${loginUserId === comment.userId ? '' : 'none '}edit trash-btn btn " data-commentid="${
        comment.commentId
      }">
									<i class="far fa-trash-alt"></i>
								</button>
							</div>
						</section>`
    )
    .join('');

{
  // button template
  /* <button class="${loginUserId === comment.userId ? '' : 'none '}edit pencil-btn btn">
<i class="far fa-edit"></i>
</button>
<button class="${loginUserId === comment.userId ? '' : 'none '}edit trash-btn btn">
<i class="far fa-trash-alt"></i>
</button> */
}

const detailEvents = async $detailNode => {
  const parseUrlPostId = window.location.pathname.split('/');
  const postId = parseUrlPostId[parseUrlPostId.length - 1];
  let postUserId;
  let isFullHeart;
  let loginUserId;
  let loginUser;

  try {
    // const {
    //   data: { userId },
    // } = await axios.get('/checkAuth');
    // loginUserId = userId;
    const { data: user } = await axios.get('/checkAuth');
    loginUserId = user.userId;
    loginUser = user;

    const postData = await axios.get(`/posts/${postId}`);
    postUserId = postData.data.post.userId;

    const {
      data: { likedUsers },
    } = await axios.get(`/posts/likedUsers/${postId}`);
    const userClickedHeart = likedUsers.find(elem => elem === +loginUserId) ? true : false;

    $detailNode.innerHTML = setPostData(postData.data, loginUserId, loginUser, userClickedHeart);

    // textarea evetns
    $detailNode.querySelector('.textarea').addEventListener('focus', () => {
      const $textareaCancel = document.querySelector('.textarea__cancel');
      $textareaCancel.removeAttribute('disabled');
      $textareaCancel.classList.toggle('no-display');
      $textareaCancel.style.color = 'black';
      $textareaCancel.style.cursor = 'pointer';
    });

    $detailNode.querySelector('.textarea__cancel').addEventListener('click', () => {
      document.querySelector('.textarea').value = '';
    });

    $detailNode.querySelector('.textarea').addEventListener('blur', () => {
      const $textareaCancel = document.querySelector('.textarea__cancel');
      $textareaCancel.classList.toggle('no-display');
      $textareaCancel.style.color = 'transparent';
      $textareaCancel.style.cursor = 'unset';
      // $textareaCancel.setAttribute('disabled', 'true');
    });

    $detailNode.querySelector('.detail__info').addEventListener('click', async e => {
      if (e.target.classList.contains('detail__info') || e.target.classList.contains('author')) return;
      if (e.target.classList.contains('avatar-button')) window.history.pushState({}, '', `/develog/${postUserId}`);
      if (e.target.classList.contains('fa-heart') || e.target.parentNode.classList.contains('fa-heart')) {
        if (!loginUserId) {
          alert('좋아요를 누르시려면 로그인이 필요합니다.');
          window.history.pushState({}, '', '/signin');
        } else {
          $detailNode.querySelectorAll('.heart-btn').forEach(elem => elem.classList.toggle('none'));
          isFullHeart =
            e.target.getAttribute('data-prefix') === 'far'
              ? true
              : e.target.parentNode.getAttribute('data-prefix') === 'far'
              ? true
              : false;
          axios.patch(`/posts/likedUsers/${postId}`, { loginUserId, isFullHeart });
        }
        // await axios.patch('/posts/likedUsers', { postId: url[url.length - 1], userId: user.userId, isFullHeart });
      }
      // 로그인한 사용자의 id로 patch
      // axios.patch

      // 만약 로그인 했다면 edit 버튼들 활성화시키는 로직 추가
      if (
        e.target.parentNode.classList.contains('pencil-btn') ||
        e.target.parentNode.parentNode.classList.contains('pencil-btn')
      ) {
        window.history.pushState({}, '', `/write/${postId}`);
      } else if (
        e.target.parentNode.classList.contains('trash-btn') ||
        e.target.parentNode.parentNode.classList.contains('trash-btn')
      ) {
        axios.delete(`/posts/${postId}`);
        window.history.pushState({}, '', '/');
      }
    });

    // login user profile
    $detailNode.querySelector('.comment__user-info .avatar-button').addEventListener('click', e => {
      window.history.pushState({}, '', `/develog/${loginUserId}`);
    });

    // login user comment upload
    $detailNode.querySelector('.user-comment__upload').addEventListener('click', async e => {
      const $textarea = $detailNode.querySelector('textarea');
      if (!loginUserId) {
        alert('댓글 서비스는 로그인이 필요합니다.');
        window.history.pushState({}, '', '/signin');
      } else {
        if ($textarea.value === '' && e.target.classList.contains('user-comment__upload')) {
          alert('글을 입력해주세요.');
        } else {
          try {
            const content = $textarea.value;
            $textarea.value = '';
            // await axios.post(`/comment/${loginUserId}`, { postId: postId, userComment: $textarea.value });
            // const { data: comments } = await axios.get(`/comments/${postId}`);
            const { data: comments } = await axios.post(`/comment/${loginUserId}`, {
              postId: postId,
              userComment: content,
            });
            const parent = $detailNode.querySelector('.comments');
            const child = setCommentData(comments, loginUserId);
            parent.innerHTML = child;
          } catch (error) {
            console.error(error);
            alert('댓글 등록이 되지 않았습니다. 등록버튼을 다시 눌러주세요');
          }
        }
      }
    });

    $detailNode.querySelector('.comments').addEventListener('click', async e => {
      if (!e.target.classList.contains('avatar-button')) return;
      const nickname = e.target.nextElementSibling.textContent;
      const { data: userId } = await axios.get(`/users/${nickname}`);
      window.history.pushState({}, '', `/develog/${userId}`);
    });

    $detailNode.querySelector('.comments').addEventListener('click', async e => {
      if (e.target.parentNode.classList.contains('trash-btn') || e.target.getAttribute('data-prefix') === 'far') {
        const commentId = e.target.parentNode.dataset.commentid;

        const { data: comments } = await axios.delete(`/posts/${postUserId}/${commentId}`);
        const parent = $detailNode.querySelector('.comments');
        const child = setCommentData(comments, loginUserId);
        parent.innerHTML = child;
      }
    });
  } catch (error) {
    console.error(error);
  }
  return $detailNode.children;
};

export default detailEvents;
