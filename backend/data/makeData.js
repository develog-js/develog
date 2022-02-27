const post = [];

function make() {
  for (let i = 1; i < 4; i++) {
    post.push({
      postId: 26 + i,
      userId: 4,
      title: `제목${i}`,
      content:
        i % 3 === 0
          ? 'Aliqua nulla do ea laboris velit nisi reprehenderit elit occaecat.'
          : 'Enim consequat Lorem ipsum ut laborum officia cillum qui id fugiat duis. Sit incididunt fugiat reprehenderit aute mollit et nostrud laboris do aliqua sint. Magna laboris incididunt voluptate sunt ullamco nostrud exercitation reprehenderit excepteur sunt enim. Velit sunt excepteur tempor id ut. Laborum Lorem duis dolor dolor magna non deserunt quis.',
      createAt: `2021-01-${i + 1}`,
      likedUsers: [],
    });
  }
}

make();
console.log(post);
