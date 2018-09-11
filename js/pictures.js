'use strict';

var PICTURES_NUMBER = 25;
var AVATAR_SIZE = '35';

var SENTENCES = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

var DESCRIPTIONS = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];

var Keycode = {
  ESC: 27,
  ENTER: 13
};

var template = document.querySelector('#picture');
var pictureTemplate = template.content.querySelector('.picture');
var picturesList = document.querySelector('.pictures');
var bigPicture = document.querySelector('.big-picture');
var bigPictureImage = bigPicture.querySelector('.big-picture__img');
var bigPictureImg = bigPictureImage.querySelector('img');
var socialCaption = bigPicture.querySelector('.social__caption');
var commentsList = bigPicture.querySelector('.social__comments');
// var socialComment = bigPicture.querySelector('.social__comment');
var likesCount = bigPicture.querySelector('.likes-count');
var commentsCount = bigPicture.querySelector('.comments-count');
var socialCommentCount = bigPicture.querySelector('.social__comment-count');
var socialCommentLoad = bigPicture.querySelector('.social__comment-loadmore');
var bigPictureClose = document.querySelector('#picture-cancel');


// Получение случайного числа
var getRandomNumber = function (min, max) {
  return Math.round(Math.random() * (max - min) + min);
};


// Перестановка двух элементов в массиве
var swapElements = function (array, index1, index2) {
  var temporaryValue = array[index1];
  array[index1] = array[index2];
  array[index2] = temporaryValue;
};


// Копирование массива
var copyArray = function (array) {
  var newArray = [];

  for (var i = 0; i < array.length; i++) {
    newArray[i] = array[i];
  }

  return newArray;
};


// Создание массива нужной длины
var createArray = function (array, length) {
  var newArray = [];

  for (var i = 0; i < length; i++) {
    var randomIndex = getRandomNumber(0, array.length - 1);
    newArray[i] = array[randomIndex];
  }

  return newArray;
};


// Перемешивание массива
var shuffleArray = function (array) {
  for (var i = 0; i < array.length; i++) {
    var randomIndex = getRandomNumber(0, array.length - 1);
    swapElements(array, i, randomIndex);
  }

  return array;
};


// Потенциально универсальная функция для создания массива комментов или описаний
var createTextArray = function (array, length) {
  var newArray = [];
  var text = createArray(copyArray(array), length);

  for (var i = 0; i < PICTURES_NUMBER; i++) {
    newArray[i] = text[i];
  }

  return newArray;
};


// Создание массива фоточек
var createPictures = function () {
  var pictures = [];
  var comments = createTextArray(SENTENCES, PICTURES_NUMBER);
  var descriptions = createTextArray(DESCRIPTIONS, PICTURES_NUMBER);

  for (var i = 0; i < PICTURES_NUMBER; i++) {
    pictures[i] = {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomNumber(15, 200),
      comments: comments[i],
      description: descriptions[i]
    };
  }

  return shuffleArray(pictures);
};


// Создание болванки для превьюшки
var getPicture = function (picture) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture__img').src = picture.url;
  pictureElement.querySelector('.picture__likes').textContent = picture.likes;
  pictureElement.querySelector('.picture__comments').textContent = picture.comments.length;

  return pictureElement;
};


// Создание какого-нибудь элемента
var makeElement = function (tagName, className, text) {
  var element = document.createElement(tagName);
  element.classList.add(className);

  if (text) {
    element.textContent = text;
  }

  return element;
};


// Удаление комментариев
var removeComment = function () {
  while (commentsList.firstChild) {
    commentsList.removeChild(commentsList.firstChild);
  }
};


// Добавление комментария
var addComment = function () {
  removeComment();

  var commentItem = makeElement('li', 'social__comment');
  var avatar = makeElement('img', 'social__picture');
  var comment = SENTENCES[getRandomNumber(0, SENTENCES.length - 1)];

  avatar.src = 'img/avatar-' + getRandomNumber(1, 6) + '.svg';
  avatar.alt = 'Аватар комментатора фотографии';
  avatar.width = AVATAR_SIZE;
  avatar.height = AVATAR_SIZE;

  commentItem.appendChild(avatar);
  commentItem.appendChild(document.createTextNode(comment));
  commentsList.appendChild(commentItem);

  return commentsList;
};


// Заполнение и показ большой фоточки
var fillOverlay = function (picture) {
  bigPictureImg.src = picture.querySelector('.picture__img').getAttribute('src');
  likesCount.textContent = picture.querySelector('.picture__likes').textContent;
  commentsCount.textContent = picture.querySelector('.picture__comments').textContent;
  socialCaption.textContent = DESCRIPTIONS[getRandomNumber(0, DESCRIPTIONS.length - 1)];

  addComment();

  bigPicture.classList.remove('hidden');
  socialCommentCount.classList.add('visually-hidden');
  socialCommentLoad.classList.add('visually-hidden');
  document.addEventListener('keydown', onBigPictureCloseEscKeydown);
};


// Отрисовывание фоточек
var renderPictures = function (array) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < array.length; i++) {
    var currentPicture = getPicture(array[i]);

    fragment.appendChild(currentPicture);
    currentPicture.addEventListener('click', function (evt) {
      evt.preventDefault();
      fillOverlay(evt.currentTarget);
    });
  }

  picturesList.appendChild(fragment);
};


// Закрытие большой фоточки
var closeBigPicture = function () {
  bigPicture.classList.add('hidden');
  // document.removeEventListener('keydown', onBigPictureCloseEscKeydown);
};


// Закрытие большой фоточки эскейпом
var onBigPictureCloseEscKeydown = function (evt) {
  if (evt.keyCode === Keycode.ESC) {
    closeBigPicture();
  }
};


// Отрисовка фоточек
var pictures = createPictures();
renderPictures(pictures);


// Пошли обработчики
bigPictureClose.addEventListener('click', function () {
  closeBigPicture();
});

bigPictureClose.addEventListener('keydown', function (evt) {
  if (evt.keyCode === Keycode.ENTER) {
    closeBigPicture();
  }
});

document.addEventListener('keydown', onBigPictureCloseEscKeydown);
