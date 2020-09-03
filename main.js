document.addEventListener('DOMContentLoaded', (event) => {

    const apiKey = "5735ba8aa714f2161c6a9f7f267223ef"
    const search = document.querySelector(".search")
    const button = document.querySelector("button")

    button.addEventListener("click", () => {

        const query = search.querySelector("input").value

        const container = document.querySelector(".container")

        fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${query}&include_adult=false`)
            .then((res) => res.text())
            .then((data) => {
                data = JSON.parse(data)

                data.results.forEach((item) => {

                    item.vote_average = item.vote_average / 2
                    item.vote_average = Math.round(item.vote_average)

                    fetch(`https://api.themoviedb.org/3/genre/movie/list?api_key=5735ba8aa714f2161c6a9f7f267223ef&language=en-US`)
                        .then((res) => res.text())
                        .then((dataGen) => {
                            dataGen = JSON.parse(dataGen)

                            const categoriesName = dataGen.genres.reduce(
                                (values, item) => {
                                    if(!values.includes(item.name)){
                                        values.push(item.name)
                                    }
                                      return values;
                                },[]
                            )
                            const categoriesID = dataGen.genres.reduce(
                                (values, item) => {
                                    if(!values.includes(item.id)){
                                        values.push(item.id)
                                    }
                                    return values;
                                },[]
                            )

                            // console.log(item.genre_ids);

                            if(item.genre_ids !== undefined){
                                for(let i = 0; i < item.genre_ids.length; i++){
                                    let queries = item.genre_ids[i]
                                    if(categoriesID.includes(queries)){
                                        let yy = categoriesID.indexOf(queries)
                                        yy = categoriesName[yy]
                                        // console.log(yy);
                                    }
                                }
                            }


                    }).catch(error => console.log("Si è verificato un errore!"))
            })

                if(data.total_results > 0){
                    container.innerHTML = printCD(data.results);
                } else {
                    container.innerHTML = "nessun risultato"
                }


        }).catch(error => console.log("Si è verificato un errore!"))
    })

    function printCD(array){

        const displayArray = array.map((item) => {

            let x = item.vote_average
            let y = 5 - x

            let star = '<i class="fas fa-star"></i>'
            let starOut ='<i class="far fa-star"></i>'
            let imgPath ='https://image.tmdb.org/t/p/w342'
            star = star.repeat(x)
            starOut = starOut.repeat(y)

            if(item.media_type == "movie"){
                item.media_type = "film"
            }
            if(item.original_language == "it"){
                item.original_language = '<span class="flag-icon flag-icon-it"></span>'
            }
            if(item.original_language == "en"){
                item.original_language = '<span class="flag-icon flag-icon-gb-eng"></span>'
            }
            if(item.original_language == "es"){
                item.original_language = '<span class="flag-icon flag-icon-es"></span>'
            }
            if(item.original_language == "de"){
                item.original_language = '<span class="flag-icon flag-icon-de"></span>'
            }
            if(item.original_language == "fr"){
                item.original_language = '<span class="flag-icon flag-icon-fr"></span>'
            }
            if(item.poster_path == null){
                item.poster_path = ""
            }
            if(item.title == undefined){
                item.title = item.name
            }
            if(item.original_title == undefined){
                item.original_title = item.original_name
            }
            if(item.poster_path == ""){
                imgPath = "./img/404.jpg"
                item.poster_path = ""
            }

            return `
                <ul class="${item.media_type}" data-id="${item.id}">
                    <li>${item.title}</li>
                    <li>${item.original_title}</li>
                    <li>${item.original_language}</li>
                    <li>${star}${starOut}</li>
                    <li>${item.media_type}</li>
                    <img src="${imgPath}${item.poster_path}" alt="">
                    <li>${item.overview}</li>
                </ul>`;
            }).join("")
        return displayArray
    }
});
