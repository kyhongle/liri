require("dotenv").config();

var keys = require("./keys.js");
var axios = require("axios");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var moment = require("moment");
moment().format();

var fs = require("fs");

var userCommand = process.argv[2];
var userSearch = process.argv.slice(3).join(" ");

// console.log(userCommand, "user search: ", userSearch);
// function for entire liri app
function liri() {
  if (userCommand === "concert-this") {
    concertThis();
  } else if (userCommand === "spotify-this-song") {
    spotifyThis();
  } else if (userCommand === "movie-this") {
    movieThis();
  } else if (userCommand === "do-what-it-says") {
    doWhat();
  }
}

function concertThis() {
  var queryUrl =
    "https://rest.bandsintown.com/artists/" +
    userSearch.replace(" ", "%20") +
    "/events?app_id=codingbootcamp";
  console.log(queryUrl);

  axios.get(queryUrl).then(function(response) {
    var concert = response.data[0];
    // console.log(concert);
    console.log("Concert Venue: " + concert.venue.name);
    console.log("Concert Location: " + concert.venue.city);
    console.log("Concert Date: " + concert.datetime);
  });
}

// concertThis();

function spotifyThis() {
  spotify.search({ type: "track", query: userSearch }, function(err, data) {
    if (err) {
      return console.log("Error occurred: " + err);
    }
    var foundTrack = data.tracks.items[0];
    console.log("Name: " + foundTrack.name);
    console.log("Album: " + foundTrack.album.name); //.artists[0]);
    console.log("Artist: " + foundTrack.artists[0].name); //JSON.stringify(foundTrack.albums, null, 2));
    console.log("Link: " + foundTrack.external_urls.spotify);
  });
}
// spotifyThis();

function movieThis() {
  var queryUrl =
    "http://www.omdbapi.com/?t=" + userSearch + "&y=&plot=short&apikey=trilogy";

  // This line is just to help us debug against the actual URL.
  console.log(queryUrl);

  axios.get(queryUrl).then(function(response) {
    // console.log(JSON.stringify(response.data, null, 2));
    var movie = response.data;
    console.log("Title: " + movie.Title);
    console.log("Year: " + movie.Year);
    console.log("IMDB Rating: " + movie.Ratings[0].Value);
    console.log("Rotten Tomatoes Rating: " + movie.Ratings[1].Value);
    console.log("Country: " + movie.Country);
    console.log("Language: " + movie.Language);
    console.log("Actors: " + movie.Actors);
    console.log("Plot: " + movie.Plot);
  });
}
// movieThis();

function doWhat() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      return console.log(error);
    }

    console.log(data);
  });
}

liri();
