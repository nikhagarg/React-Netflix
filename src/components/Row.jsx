import axios from "../axios";
import React, { useEffect, useState } from "react";
import './Row.css';
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";
import { IconButton } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import DoneIcon from '@material-ui/icons/Done';
import AddIcon from '@material-ui/icons/Add';
// import ThumbUpIcon from '@material-ui/icons/ThumbUp';
// import ThumbDownIcon from '@material-ui/icons/ThumbDown';

// Title
// Container-> sliding movie posters. 

function Row({title, fetchUrl, isLargeRow, isMyList, myListItems}) {
    const [movies, setMovies] = useState([]);
    const poster_base_url = "https://image.tmdb.org/t/p/original";
    const [trailerUrl, setTrailerUrl] = useState("");
    const [inMyList, setInMyList] = useState(false);

    useEffect(() => {
        if(!isMyList) {
            // if not My List row, fetch the data using TMDB API
            async function fetchData() {
                const request = await axios.get(fetchUrl);
                // console.log("request",request.data.results);
                setMovies(request.data.results);
                return request;
            }
            fetchData();
        } else {
            // if my List row, get the data from firestore db.
            setMovies(myListItems.map(item => (item.movie)));
        }
        
    },[fetchUrl, myListItems, isMyList]);

    // if(isMyList) {
    //     console.log("myListMovies", movies );
    // }
    
    const yt_options = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay:1 // autoplay when loads
        },
    }

    const handlePosterClick = (movieClicked) => {
        console.log("movie clicked", movieClicked?.title);
        if(trailerUrl) {
            setTrailerUrl('');
        } else {
            // movieTrailer is a npm module
            // will try to finf the trailer for the given name. 
            movieTrailer(movieClicked?.name || movieClicked?.title || "")
            .then((url) => {
                console.log("url", url);
                // url =  https://www.youtube.com/watch?v=a581-Vb-nrQ
                // so we only need v="" as the videoId;
                const urlParams = new URL(url).search; // this will give us everything after the question mark.
                const urlSearchParams = new URLSearchParams(urlParams); // this allows us to do a get request.
                setTrailerUrl(urlSearchParams.get('v'));

            }).catch((error) => {
                console.log(error);
            });
        }
    }

    return(
        <div className="row">
            <h2 className="row_title">{title}</h2>

            <div className="row_poster_container">
                {/* several row_posters */}

                {movies.map(movie => (
                    <div className="row_poster_with_footer">
                    <img 
                    key= {movie.id}
                    className={`row_poster ${isLargeRow && 'row_poster_large'}`}
                    src={`${poster_base_url}${
                        isLargeRow?movie.poster_path:movie.backdrop_path
                    }`} 
                    alt={movie.name}
                    onClick= {() => handlePosterClick(movie)} />

                    <div className="row_poster_footer">
                        <IconButton id="footer_button" onClick= {() => handlePosterClick(movie)}>
                            <PlayArrowIcon/>
                        </IconButton>
                        <IconButton id="footer_button">
                            {inMyList ? <DoneIcon/>: <AddIcon/>}
                        </IconButton>
                        {/* <IconButton id="banner_button">
                            <ThumbUpIcon/>
                        </IconButton>
                        <IconButton id="banner_button">
                            <ThumbDownIcon/>
                        </IconButton> */}
                    </div> 
                    </div>
                ))}
            </div>

            {/* When we have trailer url, then show the yt popup */}
            {trailerUrl && (
                <YouTube videoId={trailerUrl} opts={yt_options} onEnd={() => setTrailerUrl('')}/>
            )}

        </div>
    );
}

export default Row;