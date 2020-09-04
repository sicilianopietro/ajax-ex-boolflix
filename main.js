document.addEventListener('DOMContentLoaded', (event) => {

    const search = document.querySelector(".search")
    const button = document.querySelector("button")
    const input = document.querySelector("input")
    const container = document.querySelector(".container")

    button.addEventListener("click", () => {
        query()
        input.focus();
    })

    input.addEventListener("keydown", (e) => {
        if (e.keyCode === 13) {
           query()
           input.focus();
        }
    })

    function query() {

        const apiKey = "5735ba8aa714f2161c6a9f7f267223ef"
        const language = "it-IT"

        const query = search.querySelector("input").value
        search.querySelector("input").value = ""

        fetch(`https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&language=${language}&query=${query}&include_adult=false`)
            .then((res) => res.text())
            .then((data) => {
                data = JSON.parse(data)

                data.results.forEach((item) => {

                    item.vote_average = item.vote_average / 2
                    console.log(item.vote_average);
                    console.log(item.vote_average % 2);
                    item.vote_average = Math.round(item.vote_average)

                })

                if(data.total_results > 0){
                    container.innerHTML = printCD(data.results);
                } else {
                    container.innerHTML = "nessun risultato"
                }


        }).catch(error => console.log("Si è verificato un errore!"))
    }

    function printCD(array){

        const displayArray = array.map((item) => {

            let x = item.vote_average
            let y = 5 - x

            let star = '<i class="fas fa-star"></i>'
            let starOut ='<i class="far fa-star"></i>'
            let startHalf = '<i class="fas fa-star-half-alt"></i>'
            let imgPath ='https://image.tmdb.org/t/p/w342'
            star = star.repeat(x)
            starOut = starOut.repeat(y)


            const myArrLang = ["it", "es", "de", "fr"]

            if (myArrLang.includes(item.original_language)){
                let index = myArrLang.indexOf(item.original_language)
                item.original_language = `<span class="flag-icon flag-icon-${myArrLang[index]}"></span>`
            }
            if(item.original_language == "en"){
                item.original_language = '<span class="flag-icon flag-icon-gb"></span>'
            }
            if(item.media_type == "movie"){
                item.media_type = "film"
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

            return `<ul class="${item.media_type}" data-id="${item.id}">
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
