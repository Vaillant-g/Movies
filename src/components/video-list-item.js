import React from "react";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500/";
const VideoListItem = props => {
  const { movie } = props;
  return (
    <li className="list-group-item" onClick={handleOnClick}>
      <div className="row">
        <div className="media">
          <div className="media-left">
            <img
              className="media-object rounded"
              src={`${IMAGE_BASE_URL}${props.movie.poster_path}`}
              height="100px"
            ></img>
          </div>
        </div>
        <div className="media-body">
          <h5 className="title_list_item">{props.movie.title}</h5>
        </div>
      </div>
    </li>
  );

  function handleOnClick() {
    props.callback(movie);
  }
};

export default VideoListItem;
