var commentsNumber = getRandomNumber(1, 25);

for (var i = 0; i < commentsNumber; i++) {
  comments[i] = {
    avatar: 'img/avatar-' + getRandomNumber(1, 6) + '.svg',
    message: SENTENCES[getRandomNumber(0, SENTENCES.length - 1)],
    name: ''
  }
}
