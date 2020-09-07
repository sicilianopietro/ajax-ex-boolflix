document.addEventListener('DOMContentLoaded', (event) => {

    const filter = document.querySelector(".filter")
    const upComing = document.querySelector(".upComingMovie")
    const container = document.querySelector(".container")
    const sectionmovies = document.querySelector(".film")
    const sectionTv = document.querySelector(".tv")
    const containerTv = document.querySelector(".containerTv")
    const input = document.querySelector("input")

    const api_key = "5d30d2a36f43238040a203ecca48cbf5"
    const path = "https://api.themoviedb.org/3"

    input.addEventListener("keyup", (e) => {
        sectionmovies.classList.remove("hide")
        sectionTv.classList.remove("hide")
        const value = input.value
        if(value != ""){
            query(value, queryMovie(), container, movieDetails, movieCredit)
            query(value, queryPathTv(), containerTv, tvDetails, tvCredit)
        } else {
            container.innerHTML = ""
        }
        if(e.which == 13) {
            input.value = ""
        }
    })

    // append category buttons
    btnFilter()    
    // nuove uscite
    query("", queryPathUpComing(), upComing, movieDetails, movieCredit)

    //* FUNCTION *//

    // category buttons
    function btnFilter(){
        const url = `${path}/genre/movie/list?api_key=${api_key}&language=it-IT`
        fetch(url)
            .then((res) => res.json())
            .then((data) => btnGenres(data.genres))
            .catch((err) => console.log(err))
    }
    function btnGenres(array){

        const myArr = array

        myArr.unshift({id: 0, name: "All"})

        const categoryBtns = myArr.map((genres) => {
            return `
            <button type="button" class="filter-btn" data-id=${genres.name}>${genres.name}</button>`
        }).join("");

        filter.innerHTML = categoryBtns;

        const filterBtns = filter.querySelectorAll(".filter-btn");

        filterBtns.forEach((btn) => {
            btn.addEventListener("click", (e) => {
                const genre = e.currentTarget.dataset.id

                const y = document.querySelectorAll(".movie")

                y.forEach((item) => {

                    const p = item.querySelectorAll('p')

                    p.forEach((item) => {

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


    }

    // query
    function query(input, type, container, details, credit){

        const moviePath = type
        const url = `${path}${moviePath}?api_key=${api_key}&language=it-IT&query=${input}&include_adult=false`

        fetch(url)
            .then((res) => res.json())
            .then((data) => result(data.results, type, container, details, credit))
            .catch((err) => console.log(err))

    }


    // path
    function queryMovie(){
        const moviePath = "/search/movie"
        return moviePath
    }
    function queryPathUpComing(){
        const tvPath = "/movie/upcoming"
        return tvPath
    }
    function queryPathTv(){
        const tvPath = "/search/tv"
        return tvPath
    }
    function movieDetails(movie_id){
        const movieDet = `/movie/${movie_id}`
        return movieDet
    }
    function movieCredit(movie_id){
        const movieCred = `/movie/${movie_id}/credits`
        return movieCred
    }
    function tvDetails(movie_id){
        const movieDet = `/tv/${movie_id}`
        return movieDet
    }
    function tvCredit(movie_id){
        const movieCred = `/tv/${movie_id}/credits`
        return movieCred
    }

    // risultati ricerca
    function result(array, type, container, parametro1, parametro2){

        if(array.length > 0) {

            const myArr = []

            array.forEach((item) => {
                myArr.push(item.id)
            });

            container.innerHTML = printTemplate(array, type, "w342")

            myArr.forEach((item) => {

                const movie = container.querySelector(`div.movie[data-id='${item}']`)

                let moviePath = parametro1(item)
                let url = `${path}${moviePath}?api_key=${api_key}&language=it-IT&include_adult=false`

                fetch(url)
                    .then((res) => res.json())
                    .then((data) => genres(data.genres, item, movie))
                    .catch((err) => console.log(err))

                moviePath = parametro2(item)
                url = `${path}${moviePath}?api_key=${api_key}&language=it-IT&include_adult=false`

                fetch(url)
                    .then((res) => res.json())
                    .then((data) => cast(data.cast, item, movie))
                    .catch((err) => console.log(err))

            })

        }else {
            container.innerHTML = "nessun risultato"
        }

    }

    // genres
    function genres(genres, item, movie){

        const myArr = []

        genres.forEach((item) => {
            myArr.push(item.name)
        });

        appendNodeGenres(myArr, movie)

    }
    function appendNodeGenres(myArr, movie){

        const node = document.createElement("p")

        for (let i = 0; i < myArr.length; i++) {
            if(myArr[i] == "Action & Adventure"){
                myArr[i] = "Action&Adventure"
            }
            if(myArr[i] == "Sci-Fi & Fantasy"){
                myArr[i] = "Sci-Fi&Fantasye"
            }
            if(myArr[i] == "televisione film"){
                myArr[i] = "Telefilm"
            }
            if(myArr[i] == "War & Politics"){
                myArr[i] = "War&Politics"
            }
            node.classList.add(myArr[i])
        }

        node.innerHTML = myArr.join(", ")

        movie.appendChild(node)
    }

    //cast
    function cast(cast, item, movie){

        const myArr = []

        for (let i = 0; i < 5; i++) {
            if(cast[i] != undefined){
                myArr.push(cast[i].name)
            }
        }

        appendNodeCast(myArr, movie)

    }
    function appendNodeCast(myArr, movie){

        const node = document.createElement("span")

        node.innerHTML = myArr.join(", ")

        movie.appendChild(node)
    }

    // stampa il template
    function printTemplate(array, type, imgSize){

        if(type == "/search/movie" || type == "/movie/upcoming"){
            type = "movie"
        }
        if(type == "/search/tv"){
            type = "tv"
        }


        const displayArray = array.map((movie) => {

            if(movie.title == undefined){
               movie.title = movie.name
           }
           if(movie.original_title == undefined){
               movie.original_title = movie.original_name
           }

            let star = stars(movie).join("")

            const myArrLang = ["it", "es", "de", "fr"]
            if (myArrLang.includes(movie.original_language)){
                let index = myArrLang.indexOf(movie.original_language)
                movie.original_language = `<span class="flag-icon flag-icon-${myArrLang[index]}"></span>`
            }
            if (movie.original_language == "en"){
                movie.original_language = '<span class="flag-icon flag-icon-gb"></span>'
            }

            // imgSize = "w342"

            let src = `https://image.tmdb.org/t/p/${imgSize}/${movie.poster_path}`
            if (movie.poster_path == null){
                src = `./img/404.jpg`
            }

            return `
            <div class="movie" data-id="${movie.id}">
                <div class="title">${movie.title}</div>
                <div class="original_title">${movie.original_title}</div>
                <div class="star">${star}</div>
                <div class="type">${type}</div>
                <div class="original_language">${movie.original_language}</div>
                <img class="poster" src="${src}" alt="">
            </div>
            `

        }).join("")

        return displayArray
    }

    // converte il voto medio in stelle
    function stars(movie) {
        movie.vote_average = Math.round(movie.vote_average / 2)
        let y = 5 - movie.vote_average
        let star = '<i class="fas fa-star"></i>'
        let starOut ='<i class="far fa-star"></i>'
        star = star.repeat(movie.vote_average)
        starOut = starOut.repeat(y)
        return [star, starOut]
    }

});
