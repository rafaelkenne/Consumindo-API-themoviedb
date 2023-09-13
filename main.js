const key = 'e405e6f0cbbd8f8c90bbb4d04b264cce';
const $ = document.querySelector.bind(document);
const url_image = 'https://image.tmdb.org/t/p/w500';


const allMovies = $('.allMovies');
const inicio = $('#inicio');

inicio.addEventListener('click', function () {
  popularMovies();
  desmarcarCheckbox();
});

$('.searchIcon').addEventListener('click', function () {
  desmarcarCheckbox();
  buscar();
});

$('.inputText').addEventListener('keyup', function (event) {
  console.log(event.key);
  desmarcarCheckbox();
  if ($('.inputText') != '') {
    buscar()
  }
  if (event.key === 'Enter') {
    buscar()
  }
})

function clean() {
  allMovies.innerHTML = '';
}

async function buscarFavoritos() {
  for (let i = 0; i < localStorage.length; i++) {
    let chave = localStorage.key(i);
    let dados = JSON.parse(localStorage.getItem(chave))
    url_busca = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${dados.nome}&language=en-US&page=1`;
    const fetchBuscarFavoritos = await fetch(url_busca)
    const busca = await fetchBuscarFavoritos.json();

    // .then(response => response.json())
    // .then(data => data.results);
    busca.results.forEach(function (movie) {
      movie.release_date = new Date(movie.release_date).getFullYear();

      if (chave == movie.id) {
        renderMovie(movie);
      }
    })
  }
}

$('#checar').addEventListener('change', function () {
  if (this.checked) {
    clean();
    buscarFavoritos();
  } else {
    clean();
    popularMovies();
  }
});

function desmarcarCheckbox() {
  $('#checar').checked = 0;
}

async function popularMovies() {
  const url = `https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=en-US&page=1`;

  const fetchResponse = await fetch(url);
  // .then(response => response.json())
  // .then(data => data.results)
  const busca = await fetchResponse.json();
  clean();
  busca.results.forEach(function (movie) {
    movie.release_date = new Date(movie.release_date).getFullYear();
    renderMovie(movie)
  })
}

function favoritar(id_movie, isFavorited, name_movie) {
  dados = {
    nome: name_movie,
    favorito: isFavorited
  }
  localStorage.setItem(id_movie, JSON.stringify(dados));
}

function excluir(id_movie) {
  localStorage.removeItem(id_movie);
}


async function buscar() {
  const texto = $('.inputText').value;
  let url_busca;
  if (texto != '') {
    url_busca = `https://api.themoviedb.org/3/search/movie?api_key=${key}&query=${texto}&language=en-US&page=1`;
  } else {
    url_busca = `https://api.themoviedb.org/3/movie/popular?api_key=${key}&language=en-US&page=1`;
  }

  const fetchBuscar = await fetch(url_busca)
    .then(response => response.json())
    .then(data => data.results);

  clean();
  fetchBuscar.forEach(function (movie) {
    movie.release_date = new Date(movie.release_date).getFullYear();
    renderMovie(movie);
  })
}


window.onload = async function () {
  popularMovies();
}

function getIdMovie() {

}

function renderMovie(movie) {
  let isFavorited;
  for (let i = 0; i < localStorage.length; i++) {
    let chave = localStorage.key(i);
    if (chave == movie.id) {
      isFavorited = true;
    }
  }

  const section = document.createElement('section');
  allMovies.appendChild(section);

  const divInfosMovie = document.createElement('div');
  divInfosMovie.className = 'infos-movie';
  section.appendChild(divInfosMovie);

  const divImageMovie = document.createElement('div');
  divImageMovie.className = 'image-movie';
  divInfosMovie.appendChild(divImageMovie);

  const imgMovie = document.createElement('img');
  imgMovie.src = url_image + movie.poster_path;
  divImageMovie.appendChild(imgMovie);

  const divMovieText = document.createElement('div');
  divMovieText.className = 'movie-text';
  divInfosMovie.appendChild(divMovieText);

  const h4 = document.createElement('h4');
  h4.textContent = `${movie.title} (${movie.release_date})`;
  divMovieText.appendChild(h4);

  const divScoreFavorito = document.createElement('div');
  divScoreFavorito.className = 'score-favorito';
  divMovieText.appendChild(divScoreFavorito);

  const divScore = document.createElement('div');
  divScore.className = 'score';
  divScoreFavorito.appendChild(divScore);

  const imgStar = document.createElement('img');
  imgStar.src = 'imagens/estrela.svg';
  divScore.appendChild(imgStar);

  const spanMovie = document.createElement('span');
  spanMovie.textContent = movie.vote_average.toFixed(1);
  divScore.appendChild(spanMovie);

  const divFavorito = document.createElement('div');
  divFavorito.className = 'favorito';
  divScoreFavorito.appendChild(divFavorito);

  const imgFavorito = document.createElement('img');
  imgFavorito.className = 'imgFavoritar'
  imgFavorito.addEventListener('click', function (evento) {
    evento.preventDefault();
    if (isFavorited == true) {
      isFavorited = false;
      excluir(movie.id);
      imgFavorito.src = 'imagens/coracao.svg';
    } else {
      isFavorited = true;
      favoritar(movie.id, isFavorited, movie.title);
      imgFavorito.src = 'imagens/heart-fill.svg'
    }
  })
  imgFavorito.src = isFavorited ? 'imagens/heart-fill.svg' : 'imagens/coracao.svg';
  divFavorito.appendChild(imgFavorito);

  const spanMovie2 = document.createElement('span');
  spanMovie2.textContent = 'Favoritar';
  divFavorito.appendChild(spanMovie2);

  divSinopse = document.createElement('div');
  divSinopse.className = 'sinopse';
  divSinopse.textContent = movie.overview;
  section.appendChild(divSinopse);

}