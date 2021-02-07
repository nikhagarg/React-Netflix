import axios from "axios";

// base url to make requests to the movie database 
// Every single request we want to send will have the same starting url.

const instance = axios.create({
    baseURL: "https://api.themoviedb.org/3",
});

// say if i send a get request "instance.get('/foo-bar')".
// i'll be actually sending url - https://api.themoviedb.org/3/foo-bar

export default instance;