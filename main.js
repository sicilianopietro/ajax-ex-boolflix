document.addEventListener('DOMContentLoaded', (event) => {

    const container = document.querySelector(".container")
    const movies = container.querySelector(".reSearchMovie")
    const tv = container.querySelector(".reSearchTv")
    const upComingMovie = container.querySelector(".upComingMovie")
    const upComingTv = container.querySelector(".upComingTv")
    const input = container.querySelector("input")
    const search = container.querySelector(".search")
    const filter = container.querySelector(".filter")

    const api_key = "5d30d2a36f43238040a203ecca48cbf5"
    let path = "https://api.themoviedb.org/3"

    input.addEventListener("keyup", (e) => {
        search.style.display = "block";
        const value = input.value
        query(value, movies)
        query(value, tv)

        if (e.keyCode === 13) {
            const query = input.value
            input.value = ""
            search_1(query, movies)
            search_1(query, tv)
            input.focus();
        }
    })

    movieUpcoming(upComingMovie, movies)
    // tvUpcoming(upComingTv, tv)

    fetch("https://api.themoviedb.org/3/genre/movie/list?api_key=5d30d2a36f43238040a203ecca48cbf5&language=it-IT")
        .then((res) => res.json())
        .then((data) =>  {

            const myArr = data.genres

            myArr.unshift({id: 0, name: "All"})
            const categoryBtns = myArr.map((genres) => {
            return `
                <button type="button" class="filter-btn" data-id=${genres.name}>
                    ${genres.name}
                </button>
            `
            }).join("");

            filter.innerHTML = categoryBtns;

            const filterBtns = filter.querySelectorAll(".filter-btn");


            filterBtns.forEach((btn) => {
                btn.addEventListener("click", (e) => {
                    const genre = e.currentTarget.dataset.id                    

                    // const x = upComingMovie.querySelectorAll('p')
                    // const x = container.querySelectorAll('p')
                    const y = container.querySelectorAll('[class$="Movie"]')

                    y.forEach((item) => {

                        const x = item.querySelectorAll('p')
                        x.forEach((item) => {

                            item.parentElement.classList.remove("hide")

                            if(!item.classList.contains(genre)) {
                                item.parentElement.classList.add("hide")
                            }
                            if(genre == "All") {
                                item.parentElement.classList.remove("hide")
                            }
                        });
                    });


                })
            });

        }).catch((err) => console.log(err));



    function movieUpcoming(append, type) {

        append == tv ? type = "tv" : type = "movie"

        const upComingPath = "/movie/upcoming"

        const url = `${path}${upComingPath}?api_key=${api_key}&language=it-IT`

        fetch(url)
            .then((res) => res.json())
            .then((data) => {append.innerHTML = printCD(data.results, type, upComingMovie)})
            .catch((err) => console.log(err));
    }

    function tvUpcoming(append, type) {

        append == tv ? type = "tv" : type = "movie"

        const upComingPath = "/tv/popular"

        const url = `${path}${upComingPath}?api_key=${api_key}&language=it-IT`

        fetch(url)
            .then((res) => res.json())
            .then((data) => {append.innerHTML = printCD(data.results, type)})
            .catch((err) => console.log(err));
    }

    function query(value, append, type) {

        append == tv ? type = "tv" : type = "movie"

        const url = `${path}/search/${type}?api_key=${api_key}&language=it-IT&query=${value}&include_adult=false`

        fetch(url)
            .then((res) => res.json())
            .then((data) => {append.innerHTML = printCD(data.results, type, append)})
            .catch((err) => console.log(err));
    }

    function printCD(array, type, append){

        let indice = 0;

        const displayArray = array.map((movie) => {

            const genresPath = "/genre/movie/list"
            const url = `${path}${genresPath}?api_key=${api_key}&language=it-IT`

            fetch(url)
                .then((res) => res.json())
                .then((data) =>  {
                    // console.log(movie.title);
                    // console.log(movie.genre_ids);
                    const movieGenres = searchGenres (data, movie)
                    // console.log(movieGenres);
                    printGenres(movieGenres, append, indice)
                    indice++;
                    }
                )
                .catch((err) => console.log(err));

            if(movie.title == undefined){
                movie.title = movie.name
            }
            if(movie.original_title == undefined){
                movie.original_title = movie.original_name
            }

            const myArrLang = ["it", "es", "de", "fr"]
            if (myArrLang.includes(movie.original_language)){
                let index = myArrLang.indexOf(movie.original_language)
                movie.original_language = `<span class="flag-icon flag-icon-${myArrLang[index]}"></span>`
            }
            if(movie.original_language == "en"){
                movie.original_language = '<span class="flag-icon flag-icon-gb"></span>'
            }

            let star = stars(movie).join("")

            movie.overview = movie.overview.substring(0, 20);

            let src = `https://image.tmdb.org/t/p/w185/${movie.poster_path}`
            if (movie.poster_path == null){
                src = `./img/404.jpg`
            }

            return `
            <div class="movie" data-id="${movie.id}">
                <div class="title">${movie.title}</div>
                <div class="original_title">${movie.original_title}</div>
                <div class="original_language">${movie.original_language}</div>
                <div class="star">${star}</div>
                <div class="type">${type}</div>
                <div class="overview">${movie.overview}...</div>
                <img class="poster" src="${src}" alt="">
            </div>
            `
        }).join("")

        return displayArray
    }

    function searchGenres (data, movie) {
        const generi = [];
        for (let i = 0; i < movie.genre_ids.length; i++){
            for (let j = 0; j < data.genres.length; j++ ){
                if(movie.genre_ids[i] == data.genres[j].id){
                    generi.push(data.genres[j].name)
                }
            }
        }
        return generi
    }

    function printGenres(generi, append, indice) {

        const mymovieElement = document.createElement("p")

        for (let i = 0; i < generi.length; i++) {
            mymovieElement.classList.add(generi[i])
        }

        // mymovieElement.setAttribute("value", [generi]);
        mymovieElement.innerHTML = generi

        const miei_generi = append.querySelectorAll(".movie")

        if(miei_generi.length > 0) {
            miei_generi[indice].appendChild(mymovieElement)
        }

    }

    function stars(movie) {
        movie.vote_average = Math.round(movie.vote_average / 2)
        let y = 5 - movie.vote_average
        let star = '<i class="fas fa-star"></i>'
        let starOut ='<i class="far fa-star"></i>'
        star = star.repeat(movie.vote_average)
        starOut = starOut.repeat(y)
        return [star, starOut]
    }

    // function searchMultipla(value) {
    //
    //     const url_movie = "/search/movie"
    //     const url_tv = "/search/tv"
    //
    //     const url_1 = `${path}${url_movie}?api_key=${api_key}&language=it-IT&query=${query}&include_adult=false`
    //     const url_2 = `${path}${url_tv}?api_key=${api_key}&language=it-IT&query=${query}&include_adult=false`
    //
    //     Promise.all([
    //         fetch(url_1).then(value => value.json()),
    //         fetch(url_2).then(value => value.json())
    //     ]).then(allResponses => {
    //         movies.innerHTML = printCD(allResponses[0].results)
    //         tv.innerHTML = printCD(allResponses[1].results)
    //     })
    //
    // }




});
