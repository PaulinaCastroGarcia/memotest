var username;
var lvlChances;
var lvl;

var clicks = 0;
var actualChance = 1;
var found = 0;

var card1 = {
  id: '',
  container: '',
  src: ''
}

var card2 = {
  id: '',
  container: '',
  src: ''
}

function validateUsername(username) {
  if (username == '') {
    $('#error-username').removeClass('hidden')
    setTimeout(function () {
      $('#error-username').addClass('hidden');
    }, 1500);
  } else {
    $('#start-game').addClass('hidden');
    $('#game').removeClass('hidden');
    return true;
  }
}

function hiUser(username, lvlChances, lvl) {
  $('#hi-username').html('Hola ' + username);
  $('#total-chances').html(lvlChances);
  $('#lvl').html(lvl.toUpperCase());
}

// function randomCards() {
//   var images = ['alce.jpg', 'alce.jpg', 'epelante.jpg', 'epelante.jpg', 'unichancho.jpg', 'unichancho.jpg', 'nena.jpg', 'nena.jpg', 'peces.jpg', 'peces.jpg', 'zapas.jpg', 'zapas.jpg'];

//   //generar cartas
//   var usedImages = [];

//   var backImg = $('.back').find('img');
//   for (var i = 0; i < backImg.length; i++) {
//     var matchIndex = false;
//     while (matchIndex == false) {
//       var randomNum = Math.floor((Math.random() * images.length));
//       if (usedImages.indexOf(randomNum) == -1) {
//         backImg[i].src = './img/' + images[randomNum];
//         usedImages.push(randomNum);
//         matchIndex = true;
//       }
//     }
//   }
// }

function randomCards() {
  const images = [
    'alce.jpg',
    'epelante.jpg',
    'unichancho.jpg',
    'nena.jpg',
    'peces.jpg',
    'zapas.jpg',
    'alce.jpg',
    'epelante.jpg',
    'unichancho.jpg',
    'nena.jpg',
    'peces.jpg',
    'zapas.jpg'
  ];

  function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
     return a;
  }

  const randomImgs = shuffle(images);

  var backImg = $('.back').find('img');
  for (var i = 0; i < images.length; i++) {
    backImg[i].src = './img/' + randomImgs[i];
  }

}

function saveCard(card, clickedContainer) {
  card.id = $('.card-flip-container').index(clickedContainer);
  card.container = clickedContainer;
  card.src = clickedContainer.children('.back').children('img').attr('src')
}

function foundCard(card1, card2) {
  card1.container.children('.back').children('img').addClass('grayscale');
  card1.container.children('.back').css('border-color', '#979797');
  card2.container.children('.back').children('img').addClass('grayscale');
  card2.container.children('.back').css('border-color', '#979797');
}

function wonGame(actualChance) {
  //mostrar el div
  $('#results-container').removeClass('hidden');
  $('#game').css('opacity', '0.3');

  $('#win').parent().removeClass('hidden')
  $('#win').html('GANASTE 🎉 !');
  $('#win-chances').html(actualChance - 1);
}

function lostGame() {
  //mostrar el div
  $('#results-container').removeClass('hidden');
  $('#game').css('opacity', '0.3');

  $('#lost').removeClass('hidden')
}

function saveWinner(username, lvl, actualChance) {
  winners = localStorage.getItem('winners')
  winners = JSON.parse(winners)

  if (winners == null) {
    var winners = []
  } else {
    var winners = winners;
  }

  //guardar
  var winner = {
    username: username,
    lvl: lvl,
    chances: actualChance - 1
  }

  winners.push(winner)
  localStorage.setItem("winners", JSON.stringify(winners))
  console.log(winners)
}

function getWinners() {
  winners = localStorage.getItem('winners')
  winners = JSON.parse(winners)

  if (winners != null) {
    winners.sort((a, b) => (a.chances > b.chances) ? 1 : ((b.chances > a.chances) ? -1 : 0));
    for (var i = 0; i < winners.length; i++) {
      console.log(winners[i])
      $('#chart-username').append(`<p> ${winners[i].username} </p>`)
      $('#chart-lvl').append(`<p> ${winners[i].lvl} </p>`)
      $('#chart-chances').append(`<p> ${winners[i].chances} </p>`)
    }
  }
}

//funcion iniciar juego (on click boton nivel)
function gameInit(e) {
  e.preventDefault();

  username = $('#username').val();

  if (validateUsername(username)) {
    lvlChances = e.target.value;
    lvl = e.target.id;
    hiUser(username, lvlChances, lvl);

    randomCards();
  }
}

$('.lvl-btn').on('click', gameInit);

$('.card-flip-container').on('click', function (e) {
  if ($(this).hasClass('rotar') == false) {
    if (actualChance <= lvlChances) {
      if (clicks == 1) {
        clicks++
        saveCard(card2, $(this));

        if (card2.id != card1.id) {
          $(this).toggleClass('rotar')
          $('#chances-n').html(actualChance)

          if (card2.src != card1.src) {
            setTimeout(function () {
              card1.container.toggleClass('rotar');
              card2.container.toggleClass('rotar');

              clicks = 0
            }, 1000)
          } else {
            foundCard(card1, card2);
            clicks = 0
            found++
          }
        }

        if (actualChance == lvlChances && found < 2) {
          $('#game').css('pointer-events', 'none');
          setTimeout(function () {
            lostGame();
            getWinners();
          }, 1500)
        } else if (found == 2) {
            $('#game').css('pointer-events', 'none');
            setTimeout(function () {
              saveWinner(username, lvl, actualChance);
              wonGame(actualChance);
              getWinners();
            }, 1500)
        }

        actualChance++

      } else if (clicks == 0) {
        $(this).toggleClass('rotar')
        saveCard(card1, $(this));
        clicks++
      }
    }
  }
});




