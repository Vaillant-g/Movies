import React, { Component } from "react";
import SearchBar from "../components/search-bar";
import VideoDetail from "../components/video-detail";
import VideoList from "./video-list";
import Video from "../components/video";
import axios from "axios";

const API_END_POINT = "https://api.themoviedb.org/3/";
const POPULAR_MOVIES_URL =
  "discover/movie?sort_by=popularity.desc&include_adult=false&append_to_response=images";
const API_KEY = "api_key=8b4ca75628dc2e2c6f49b5d010df12fc";
const SEARCH_URL = "search/movie?language=fr&include_adult=false";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = { movieList: {}, currentMovie: {}, recommendationList: {}, backgroundColor: "#BFBFBF"};
  }
  UNSAFE_componentWillMount() {
    this.initMovies();
  }

  initMovies() {
    axios.get(`${API_END_POINT}${POPULAR_MOVIES_URL}&${API_KEY}`).then(
      function(response) {
        this.setState(
          {
            movieList: response.data.results.slice(1, 6),
            currentMovie: response.data.results[0]
          },
          function() {
            this.applyVideoToCurrentMovie();
            this.setRecommendations();
          }
        );
      }.bind(this)
    );
  }

  applyVideoToCurrentMovie() {
    axios
      .get(
        `${API_END_POINT}movie/${this.state.currentMovie.id}?${API_KEY}&append_to_response=videos`
      )
      .then(
        function(response) {
          const youtubeKey = response.data.videos.results[0].key;
          let newCurrentMovieState = this.state.currentMovie;
          newCurrentMovieState.videoId = youtubeKey;
          this.setState({ currentMovie: newCurrentMovieState });
        }.bind(this)
      );
  }

  onClickListItem(movie) {
    this.setState({ currentMovie: movie }, function() {
      this.applyVideoToCurrentMovie();
      this.setRecommendations();
    });
  }

  setRecommendations() {
    axios
      .get(
        `${API_END_POINT}movie/${this.state.currentMovie.id}/recommendations?&${API_KEY}&language=fr`
      )
      .then(
        function(response) {
          this.setState({
            recommendationList: response.data.results.slice(0, 5)
          });
        }.bind(this)
      );
  }

  onClickSearch(searchText) {
    if (searchText) {
      axios
        .get(`${API_END_POINT}${SEARCH_URL}&${API_KEY}&query=${searchText}`)
        .then(
          function(response) {
            if (response.data && response.data.results[0]) {
              if (response.data.results[0].id != this.state.currentMovie.id) {
                this.setState(
                  { currentMovie: response.data.results[0] },
                  () => {
                    this.applyVideoToCurrentMovie();
                    this.setRecommendations();
                  }
                );
              }
            }
          }.bind(this)
        );
    }
  }

  onClickMoon() {
    console.log("moon");
    let changeColor = (this.state.backgroundColor == "#262626" ? "#BFBFBF" : "#2626260");
    this.setState({backgroundColor: changeColor});
  }

  render() {
    const renderVideoList = (type) => {
      if (type === "recommandations") {
        if (this.state.recommendationList.length >= 5)
        return (
          <VideoList
          titre={"Films recommandés"}
            movieList={this.state.recommendationList}
            callback={this.onClickListItem.bind(this)}
          />
        );
      }
      else { // Films populaires
      if (this.state.movieList.length >= 5)
        return (
          <VideoList
          titre={"Films populaires"}
            movieList={this.state.movieList}
            callback={this.onClickListItem.bind(this)}
          />
        );
      }
    };

    return (
      <div>NPM 
        <div className="search_bar">
          <SearchBar callback={this.onClickSearch.bind(this)} />
        </div>
        <div className="row">
          <div className="col-md-3">{renderVideoList("populaires")}</div>
          <div className="col-md-6">
            <Video videoId={this.state.currentMovie.videoId}></Video>
            <VideoDetail
              title={this.state.currentMovie.title}
              description={this.state.currentMovie.overview}
            ></VideoDetail>
          </div>
          <div className="col-md-3">{renderVideoList("recommandations")}</div>
        </div>
      </div>
    );
  }
}

export default App;
