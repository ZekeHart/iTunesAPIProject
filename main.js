const searchButton = document.querySelector('#search-button')
const searchBar = document.querySelector('#search-bar')
const searchForm = document.querySelector('#search-form')
const audioPlayer = document.querySelector('#music-player')
const displayMore = document.querySelector('.more-results')
const subHeader = document.querySelector(".subheader")
const songFilter = document.querySelector(".songs-search")
const albumFilter = document.querySelector(".albums-search")
const bandFilter = document.querySelector(".bands-search")
const playButton = document.querySelector('#playbutton')
const pauseButton = document.querySelector('#pausebutton')
const neonTitle = document.querySelector('.neon-title')
const nowPlaying = document.querySelector('#now-playing')
let searchType = 'songs'

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
    displayMore.style.display = 'inline'
    subHeader.style.display = 'block'
    document.querySelector(".results-type").style.display = 'inline'
    neonTitle.classList.add("f-subheadline")
})

displayMore.addEventListener('click', function () {
    let searchUrl = makeUrl(searchBar.value)
    displayMore.style.display = 'none'
    fetch(searchUrl)
        .then(response => response.json()
        )
        .then(function (data) {
            console.log(data)
            populateResults(data.results, 'sourKiss')

        })
})

bandFilter.addEventListener('click', function () {
    searchType = 'bands'
    let searchUrl = makeUrl(searchBar.value)
    fetch(searchUrl)
        .then(response => response.json()
        )
        .then(function (data) {
            console.log(data)
            populateResults(data.results)

        })
    displayMore.style.display = 'inline'
})

songFilter.addEventListener('click', function () {
    searchType = 'songs'
    let searchUrl = makeUrl(searchBar.value)
    fetch(searchUrl)
        .then(response => response.json()
        )
        .then(function (data) {
            console.log(data)
            populateResults(data.results)

        })
    displayMore.style.display = 'inline'
})

albumFilter.addEventListener('click', function () {
    searchType = 'albums'
    let searchUrl = makeUrl(searchBar.value)
    console.log(searchUrl)
    fetch(searchUrl)
        .then(response => response.json()
        )
        .then(function (data) {
            console.log(data)
            populateResults(data.results)

        })
    displayMore.style.display = 'inline'
})

function populateResults(rawResults, secondArg) {
    const displaySection = document.querySelector('#results-display')
    displaySection.innerHTML = ''
    if (!secondArg) {
        rawResults.length = Math.min(rawResults.length, 16)
    }
    for (let track of rawResults) {
        displaySection.appendChild(makeBox(track))
    }
}

function makeBox(trackInfo) {
    const trackDiv = document.createElement('div')
    console.log(trackInfo.previewUrl)
    trackDiv.classList.add('track', 'fl', 'center', 'w-50', 'w-25-ns', 'tc', 'ma2')
    if (searchType === 'songs') {
        if (trackInfo.trackName.length >= 30) {
            trackInfo.trackName = trackInfo.trackName.substring(0, 30) + "..."
        }
        if (trackInfo.artistName.length >= 30) {
            trackInfo.artistName = trackInfo.artistName.substring(0, 30) + "..."
        }
        trackDiv.innerHTML = `
        <img class="mt2 br3 ba bw1 b--hot-pink" src="${trackInfo.artworkUrl100}">
        <h3 class="results-info hot-pink">${trackInfo.trackName}</h3>
        <h4 class="results-info hot-pink">${trackInfo.artistName}</h4>
        <button class="play-preview mb2 bg-pink o-80 white bw0 pa1 br3 link dim mb2 dib white" data-artist-name=${trackInfo.artistName} data-track-name=${trackInfo.trackName} data-preview="${trackInfo.previewUrl}">Play preview</button>
        `
    }
    if (searchType === 'albums') {
        trackInfo.releaseDate = trackInfo.releaseDate.substring(0, 7)
        trackDiv.innerHTML = `
        <img class="mt2 br3 ba bw1 b--hot-pink" src="${trackInfo.artworkUrl100}">
        <h3 class="results-info hot-pink">${trackInfo.collectionName}</h3>
        <h4 class="results-info hot-pink">${trackInfo.artistName}</h4>
        <h4 class="results-info hot-pink">${trackInfo.releaseDate}</h4>
        `
    }
    if (searchType === 'bands') {
        trackDiv.innerHTML = `
        <h2 class="results-info hot-pink">${trackInfo.artistName}</h2>
        <h3 class="results-info hot-pink">${trackInfo.primaryGenreName}</h3>
        `
    }
    return trackDiv
}

function makeUrl(searchText) {
    let uriConverted = encodeURIComponent(searchText)
    // let entity = 
    if (searchType === 'songs') {
        return `https://itunes-api-proxy.glitch.me/search?term=${uriConverted}&media=music&entity=song&attribute=songTerm`
    }
    else if (searchType === 'bands') {
        return `https://itunes-api-proxy.glitch.me/search?term=${uriConverted}&media=music&entity=musicArtist&attribute=artistTerm`
    }
    else if (searchType === 'albums') {
        return `https://itunes-api-proxy.glitch.me/search?term=${uriConverted}&media=music&entity=album&attribute=albumTerm`
    }
}

document.querySelector('#results-display').addEventListener('click', function (event) {
    if (event.target && event.target.matches('button.play-preview')) {
        audioPlayer.src = event.target.dataset['preview']
        audioPlayer.autoplay = 'true'

        playButton.style.display = 'none'
        pauseButton.style.display = 'inline'

        nowPlaying.style.display = 'inline'
        nowPlaying.innerHTML = `<p>Now Playing: ${event.target.dataset['trackName']} by ${event.target.dataset['artistName']}<p>`
    }
})

playButton.addEventListener('click', function () {
    document.querySelector('#music-player').play()
    playButton.style.display = 'none'
    pauseButton.style.display = 'inline'
})

pauseButton.addEventListener('click', function () {
    document.querySelector('#music-player').pause()
    playButton.style.display = 'inline'
    pauseButton.style.display = 'none'
})

