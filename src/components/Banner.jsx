import React, { useEffect, useState } from 'react';
import requests from '../requests';
import axios from '../axios';
import './Banner.css';
import { IconButton } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import DoneIcon from '@material-ui/icons/Done';
import AddIcon from '@material-ui/icons/Add';
import db from "../firebase";
import firebase from "firebase";
import YouTube from "react-youtube";
import movieTrailer from "movie-trailer";

//   -------------------------------------------------------------------------------------------------------------------
// 
//   FOR NOW DISABLED THE PLAY BUTTON since not a good UI Look. THOUGH FUNCTIONALITY IS PRESENT IN THIS COMPONENT.
//   TO CHECK THE PLAY BUTTON FUNCTIONALITY, remove DISABLED from the button. 
// 
//   -------------------------------------------------------------------------------------------------------------------


function Banner({myListItems}) {
    const [bannerMovie, setBannerMovie] = useState({});
    const [trailerUrl, setTrailerUrl] = useState("");
    const [inMyList, setInMyList] = useState(false);

    // Fetches the Random movie from Netflix originals to display on Banner.
    useEffect(() => {
        async function fetchData() {
            const request = await axios.get(requests.fetchNetflixOriginals);
            // console.log("Banner request", request.data.results);

            // We want a random movie on the banner everytime app is refreshed.
            const randomNumber = Math.floor(Math.random() * request.data.results.length - 1);
            setBannerMovie(request.data.results[randomNumber]);

            return request;
        }
        fetchData();
    }, []);

    console.log("bannerMovie : ", bannerMovie);

    // CHECK IF BANNER MOVIE IS ALREADY IN MY LIST. will set inMyList= true.
    useEffect(() => {
        if(myListItems.length > 0) {
            // Array.filter creates a new array with items only that satisfies the condn "item.movie.id === bannerMovie.id"
            let temp = myListItems.filter(item => item.movie?.id === bannerMovie?.id);
            if(temp.length>0) {
                setInMyList(true);
            } else {
                setInMyList(false);
            }
        } else {
            setInMyList(false);
        }
    },[inMyList, myListItems, bannerMovie]);

    // THIS HANDLES MY LIST ADDITION/DELETION
    const handleMyList = () => {
        if(inMyList) {
            // if already banner movie is in My List, remove Movie from my list
            // get the doc id for the banner movie first. Since banner movie is in my list, can filter my list to get id.
            let temp = myListItems.filter(item => item.movie.id === bannerMovie.id);
            const bannerMovieDocId = temp[0]?.id;
            if(bannerMovieDocId) {
                db.collection('myList').doc(bannerMovieDocId).delete();
            }
            setInMyList(false);
        } else {
            // if banner movie is not in My List, add Movie into my list
            db.collection('myList').add({
                movie: bannerMovie,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
            console.log("added in the db");
            setInMyList(true);
        }
    }

    // If description(text) length is greater than 250(length), will truncate it. adds ...
    function truncate(text, length) {
        return text?.length > length ? text.substr(0,length-1) + "..." : text;
    }

    // THIS IS FOR BANNER YOUTUBE PLAYING 
    const yt_options = {
        height: "390",
        width: "100%",
        playerVars: {
            autoplay:1 // autoplay when loads
        },
    }

    // Handles the Play button on Banner Movie
    const handleBannerPlay = () => {
        console.log("movie clicked", bannerMovie?.title || bannerMovie?.name);
        if(trailerUrl) {
            setTrailerUrl('');
        } else {
            // movieTrailer is a npm module
            // will try to find the trailer for the given name. 
            movieTrailer(bannerMovie?.name || bannerMovie?.title || "")
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

    return (
        <>
        {
        trailerUrl ? (
            // {/* When we have trailer url, then show the yt popup */}
            <YouTube videoId={trailerUrl} opts={yt_options} onEnd={() => setTrailerUrl('')}/>
        ):(
            // else show <header> Background Image +  Banner contents + Banner fading
            <header className="banner"
            style = {{
                backgroundSize: "cover",
                backgroundImage: `url(
                    "https://image.tmdb.org/t/p/original${bannerMovie?.backdrop_path}"
                )`,
                backgroundPosition: "center center"
            }}
            >
            <div className="banner_contents">
                {/* Title */}
                <h1 className="banner_title">{bannerMovie?.title || bannerMovie?.name || bannerMovie?.original_name}</h1>

                {/* div -> 2 buttons-> play+myList */}
                <div className="banner_buttons">
                    <IconButton id="banner_button" onClick={handleBannerPlay} disabled>
                        <PlayArrowIcon/>Play
                    </IconButton>
                    <IconButton id="banner_button" onClick={handleMyList}>
                        {inMyList ? <DoneIcon/>: <AddIcon/>}My List
                    </IconButton>
                    {/* <button className="banner_button">Play</button> */}
                    {/* <button className="banner_button">My List</button> */}
                </div>

                {/* description */}
                <h1 className="banner_description">{truncate(bannerMovie?.overview,250)}</h1>
            </div> 
            
            {/* Empty div for Banner Fading Bottom */}
            <div className="banner_fadeBottom"/>   
            </header>
        )
        } 
        </>

        
        
    )
}

export default Banner;