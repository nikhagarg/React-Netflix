const APIKEY = "d5df95a2c2e8176a0cbb7cd50d5bdb11";

const requests = {
    fetchTrending: `/trending/all/week?api_key=${APIKEY}&language=en-US`,
    fetchNetflixOriginals: `/discover/tv?api_key=${APIKEY}&with_networks=213`,
    fetchTopRated: `/movie/top_rated?api_key=${APIKEY}&language=en-US`,
    fetchActionMovies: `/discover/movie?api_key=${APIKEY}&with_genres=28`,
    fetchComedyMovies: `/discover/movie?api_key=${APIKEY}&with_genres=35`,
    fetchHorrorMovies: `/discover/movie?api_key=${APIKEY}&with_genres=27`,
    fetchRomanticMovies: `/discover/movie?api_key=${APIKEY}&with_genres=10749`,
    fetchDocumantaries: `/discover/movie?api_key=${APIKEY}&with_genres=99`,
}

export default requests;