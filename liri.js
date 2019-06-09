require("dotenv").config();

var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var request = require("request");
let liriFunction = process.argv[2];
var userQuery = process.argv.slice(3).join(" ");

switch (liriFunction) {
  case "concert-this":
    bandsInTown();
    break;
  case "spotify-this-song":
    spotifyThisSong();
    break;
  case "movie-this":
    movieThis();
    break;
  case "do-what-it-says":
    doWhatItSays();
    break;

  default:
    console.log(
      "\n" +
        "type one of the following commands AFTER node liri.js" +
        "\n" +
        "concert this" +
        "\n" +
        "spotify-this-song 'insert song title'" +
        "\n" +
        "movie-this 'anymovie title'" +
        "\n" +
        "do-what-it-says" +
        "\n"
    );
}

// OMDB funtionality WORKING
function movieThis() {
  var queryUrl =
    "http://www.omdbapi.com/?t=" + userQuery + "&y=&plot=short&apikey=babcdc33";
  request(queryUrl, function(error, response, body) {
    if (!userQuery) {
      userQuery = "Mr Nobody";
    } //Not sure if it pulls if error on userQuery or if it can't find userQuery
    else if (!error && response.statusCode === 200) {
      var myMovieData = JSON.parse(body);
      var queryUrlResults =
        "Title: " +
        myMovieData.Title +
        "\n" +
        "Year Released: " +
        myMovieData.Year +
        "\n" +
        "IMDB Rating: " +
        myMovieData.Ratings[0].Value +
        "\n" +
        "Rotten Tomatoes: " +
        myMovieData.Ratings[0].Value +
        "\n" +
        "Origin Country: " +
        myMovieData.Country +
        "\n" +
        "Language: " +
        myMovieData.Language +
        "\n" +
        "Plot: " +
        myMovieData.Plot +
        "\n" +
        "Actors / Actresses: " +
        myMovieData.Actors;
      console.log(" ");
      console.log("------------START-------------- ");
      console.log(queryUrlResults);
      console.log("------------END-------------- ");
      console.log(" ");
    } else {
      console.log("error: " + err);
      return;
    }
  });
}

//Spotify Functionality WORKING
function spotifyThisSong() {
  if (!userQuery) {
    userQuery = "The Sign";
  }
  spotify.search({ type: "track", query: userQuery, limit: 1 }, function(
    err,
    data
  ) {
    if (err) {
      return console.log("Error occurred: " + err);
    } else {
      let spotifyArr = data.tracks.items;
      for (i = 0; i < spotifyArr.length; i++) {
        console.log(" ");
        console.log("-----------START-------------");
        console.log(`Song: ${spotifyArr[i].name}
                Artist(s): ${spotifyArr[i].artists[0].name}
                Album: ${spotifyArr[i].album.name}
                Preview Link: ${spotifyArr[i].external_urls.spotify}`);
        console.log("------------END-------------- ");
        console.log(" ");
      }
    }
  });
}

//Bands In Town Functionality WORKING
function bandsInTown() {
  let queryUrl =
    "https://rest.bandsintown.com/artists/" +
    userQuery +
    "/events?app_id=codingbootcamp";
  request(queryUrl, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var myBandData = JSON.parse(body);
      var queryUrlResults =
        "Venue: " +
        myBandData[0].venue.name +
        "\n" +
        "City: " +
        myBandData[0].venue.city +
        "\n" +
        "Date / Time: " +
        myBandData[0].datetime;
      console.log(" ");
      console.log("-----------START-------------");
      console.log(queryUrlResults);
      console.log("------------END-------------- ");
      console.log(" ");
    } else {
      console.log("error: " + error);
      return;
    }
  });
}

//Do What It Says Functionality
function doWhatItSays() {
  fs.readFile("random.txt", "utf8", function(error, data) {
    if (error) {
      console.log(error);
    } else {
      var dataArray = data.split(",");
      var dataCommand = dataArray[0];
      var dataInput = dataArray[1];
      console.log(dataCommand);
      console.log(dataInput);
      switch (dataCommand) {
        case "spotify-this-song":
          userQuery = dataInput;
          spotifyThisSong();
          break;
        default:
          console.log(`Something went wrong!`);
      }
    }
  });
}
