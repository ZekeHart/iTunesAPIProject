const searchButton = document.querySelector('#search-button')
const searchBar = document.querySelector('#search-bar')
const searchForm = document.querySelector('#search-form')
const audioPlayer = document.querySelector('#music-player')

searchForm.addEventListener('submit', function (event) {
    event.preventDefault()
    let searchUrl = makeUrl(searchBar.value)
    fetch(searchUrl)
        .then(response => response.json()
        )
        .then(function (data) {
            console.log(data)
            populateResults(data.results)

        })
})

function populateResults(rawResults) {
    const displaySection = document.querySelector('#results-display')
    displaySection.innerHTML = ''
    rawResults.length = Math.min(rawResults.length, 16)
    for (let track of rawResults) {
        displaySection.appendChild(makeBox(track))
    }
}

function makeBox(trackInfo) {
    const trackDiv = document.createElement('div')
    trackDiv.classList.add('track', 'fl', 'center', 'w-50', 'w-25-ns', 'tc', 'ma2')
    trackDiv.innerHTML = `
    <img class="mt2" src="${trackInfo.artworkUrl100}">
    <h3 class="red">${trackInfo.trackName}</h3>
    <h4 class="red">${trackInfo.artistName}</h4>
    <button class="play-preview mb2 bg-pink o-80 red bw0 pa1 br3 link dim mb2 dib white" data-preview="${trackInfo.previewUrl}">Play preview</button>
    `
    return trackDiv
}

function makeUrl(searchText) {
    let uriConverted = encodeURIComponent(searchText)
    return `https://itunes-api-proxy.glitch.me/search?term=${uriConverted}&media=music&entity=song&attribute=artistTerm`

}



document.querySelector('#results-display').addEventListener('click', function (event) {
    if (event.target && event.target.matches('button.play-preview')) {
        audioPlayer.src = event.target.dataset['preview']
        audioPlayer.autoplay = 'true'
    }
})
