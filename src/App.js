import './App.css';
import Banner from './components/Banner';
import Nav from './components/Nav';
import Row from './components/Row';
import requests from './requests';
import { useEffect, useState } from 'react';
import db from "./firebase";

// Navbar
// Banner
// Rows

function App() {
  const [myListItems, setMyListItems] = useState([]);

  useEffect(() => {
    db.collection('myList').orderBy('timestamp', 'asc').onSnapshot(snapshot => {
      setMyListItems(snapshot.docs.map(doc => ({id: doc.id, movie: doc.data().movie})))
    });
  },[]);

    console.log("myListItems",myListItems);

  return (
    <div className="App">
      {/* NAV BAR */}
      <Nav/>

      {/* BANNER */}
      <Banner myListItems={myListItems}/>

      {/* ROWS */}
      {/* Show the myList row only if there are items in my list. */}
      {myListItems.length>0 && (
        <Row title="My List" isMyList myListItems={myListItems}/>)
      }
      <Row title="Trending Now" fetchUrl={requests.fetchTrending}/>
      <Row title="Top Rated" fetchUrl={requests.fetchTopRated}/>
      <Row title="Netflix Originals" 
        fetchUrl={requests.fetchNetflixOriginals}
        isLargeRow />
      <Row title="Action Movies" fetchUrl={requests.fetchActionMovies}/>
      <Row title="Comedy Movies" fetchUrl={requests.fetchComedyMovies}/>
      <Row title="Horror Movies" fetchUrl={requests.fetchHorrorMovies}/>
      <Row title="Romantic Movies" fetchUrl={requests.fetchRomanticMovies}/>
      <Row title="Documentaries" fetchUrl={requests.fetchDocumantaries}/>
    </div>
  );
}

export default App;
