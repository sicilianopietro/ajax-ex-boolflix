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

                 container.innerHTML = printCD(data.results);

                data.results.forEach((item) => {
                    console.log(item.title);
                    console.log(item.original_title);
                    console.log(item.original_language);
                    console.log(item.vote_average);
                });

        }).catch(error => {
            container.innerHTML = "nessun risultato"
            console.log("Si è verificato un errore!")
        })

    })

    function printCD(array){

        const displayArray = array.map((item) => {
            return `
                <ul class="film">
                    <li>${item.title}</li>
                    <li>${item.original_title}</li>
                    <li>${item.original_language}</li>
                    <li>${item.vote_average}</li>
                </ul>
              `

            }).join("")

        return displayArray
    }
});
