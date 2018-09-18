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
var likesCount = bigPicture.querySelector('.likes-count');
var commentsCount = bigPicture.querySelector('.comments-count');
var socialCommentCount = bigPicture.querySelector('.social__comment-count');
var socialCommentLoad = bigPicture.querySelector('.comments-loader');
var bigPictureClose = document.querySelector('#picture-cancel');
var fileUpload = document.querySelector('#upload-file');
var imgUpload = document.querySelector('.img-upload__overlay');
var uploadCancel = document.querySelector('#upload-cancel');
var effectLevelPin = document.querySelector('.effect-level__pin');
var effectLevelDepth = document.querySelector('.effect-level__depth');
var imgUploadPreview = document.querySelector('.img-upload__preview');
var imgPreview = imgUploadPreview.querySelector('img');
var effectsList = document.querySelector('.effects__list');
var effectNone = document. querySelector('#effect-none');
var effectChrome = document. querySelector('#effect-chrome');
var effectSepia = document. querySelector('#effect-sepia');
var effectMarvin = document. querySelector('#effect-marvin');
var effectPhobos = document. querySelector('#effect-phobos');
var effectHeat = document. querySelector('#effect-heat');
var scaleControlSmaller = document.querySelector('.scale__control--smaller');
var scaleControlBigger = document.querySelector('.scale__control--bigger');
var scaleControlValue = document.querySelector('.scale__control--value');


/* Вспомогательные функции
   ========================================================================== */

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

  for (var i = 0; i < length; i++) {
    newArray[i] = text[i];
  }

  return newArray;
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


/* Основные функции
   ========================================================================== */

// Создание массива фоточек
var createPictures = function () {
  var pictures = [];
  var comments = createTextArray(SENTENCES, PICTURES_NUMBER);
  var descriptions = createTextArray(DESCRIPTIONS, PICTURES_NUMBER);

  for (var i = 0; i < PICTURES_NUMBER; i++) {
    pictures[i] = {
      url: 'photos/' + (i + 1) + '.jpg',
      likes: getRandomNumber(15, 200),
      comments: comments,
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


// Удаление комментариев
var removeComment = function () {
  while (commentsList.firstChild) {
    commentsList.removeChild(commentsList.firstChild);
  }
};


// Создание комментария
var createComment = function (comment) {
  var commentItem = makeElement('li', 'social__comment');
  var avatar = makeElement('img', 'social__picture');

  avatar.src = 'img/avatar-' + getRandomNumber(1, 6) + '.svg';
  avatar.alt = 'Аватар комментатора фотографии';
  avatar.width = AVATAR_SIZE;
  avatar.height = AVATAR_SIZE;

  commentItem.appendChild(avatar);
  commentItem.appendChild(document.createTextNode(comment));

  return commentItem;
};


// Добавление комментария
var addComments = function (picture) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < picture.comments.length; i++) {
    var comment = picture.comments[i];
    fragment.appendChild(createComment(comment));
  }

  commentsList.appendChild(fragment);
};


// Заполнение и показ большой фоточки
var fillOverlay = function (picture) {
  bigPictureImg.src = picture.url;
  likesCount.textContent = picture.likes;
  commentsCount.textContent = picture.comments.length;
  socialCaption.textContent = picture.description;

  removeComment(); // Удаляем дефолтные комментарии из разметки
  addComments(picture);

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

    currentPicture.setAttribute('data-id', i);
    fragment.appendChild(currentPicture);

    currentPicture.addEventListener('click', function (evt) {
      evt.preventDefault();
      fillOverlay(array[evt.currentTarget.dataset.id]);
    });
  }

  picturesList.appendChild(fragment);
};


// Закрытие большой фоточки
var closeBigPicture = function () {
  bigPicture.classList.add('hidden');
};


// Закрытие большой фоточки эскейпом
var onBigPictureCloseEscKeydown = function (evt) {
  if (evt.keyCode === Keycode.ESC) {
    closeBigPicture();
  }
};


// Закрытие формы редактирования изображения
var closeImgUpload = function () {
  imgUpload.classList.add('hidden');
  fileUpload.reset();
};


// Закрытие формы редактирования изображения эскейпом
var onImgUploadCloseEscKeydown = function (evt) {
  if (evt.keyCode === Keycode.ESC) {
    closeImgUpload();
  }
};


// Открытие формы редактирования изображения
var openImgUpload = function () {
  imgUpload.classList.remove('hidden');
};


// Применяем эффекты к фоточке
var addEffects = function () {
  if (effectNone.checked) {
    imgPreview.className = '';
  } else if (effectChrome.checked) {
    imgPreview.className = '';
    imgPreview.classList.add('effects__preview--chrome');
  } else if (effectSepia.checked) {
    imgPreview.className = '';
    imgPreview.classList.add('effects__preview--sepia');
  } else if (effectMarvin.checked) {
    imgPreview.className = '';
    imgPreview.classList.add('effects__preview--marvin');
  } else if (effectPhobos.checked) {
    imgPreview.className = '';
    imgPreview.classList.add('effects__preview--phobos');
  } else {
    imgPreview.className = '';
    imgPreview.classList.add('effects__preview--heat');
  }
};


// Уменьшаем фоточку
var scaleSmaller = function () {
  var value = parseInt(scaleControlValue.value);

  if (value > 25) {
    value -= 25;
    imgPreview.setAttribute('style', 'transform:scale(0.' + value + ')');
    scaleControlValue.value = value + '%';
  } else if (value === 25) {
    imgPreview.setAttribute('style', 'transform:scale(0.25)');
    scaleControlValue.value = value + '%';
  }
};


// Увеличиваем фоточку
var scaleBigger = function () {
  var value = parseInt(scaleControlValue.value);

  if (value < 75) {
    value += 25;
    imgPreview.setAttribute('style', 'transform:scale(0.' + value + ')');
    scaleControlValue.value = value + '%';
  } else if (value >= 75 && value < 100) {
    value += 25;
    imgPreview.removeAttribute('style');
    scaleControlValue.value = value + '%';
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

fileUpload.addEventListener('change', function () {
  openImgUpload();
});

uploadCancel.addEventListener('click', function () {
  closeImgUpload();
});

uploadCancel.addEventListener('keydown', function (evt) {
  if (evt.keyCode === Keycode.ENTER) {
    closeImgUpload();
  }
});

effectsList.addEventListener('click', function () {
  addEffects();
});

scaleControlSmaller.addEventListener('click', function () {
  scaleSmaller();
});

scaleControlBigger.addEventListener('click', function () {
  scaleBigger();
});

document.addEventListener('keydown', onBigPictureCloseEscKeydown);
document.addEventListener('keydown', onImgUploadCloseEscKeydown);
