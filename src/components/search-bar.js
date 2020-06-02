import React, { Component } from "react";

class SearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = { searchText: "", placeHolder: "Search" };
  }
  handleChange(event) {
    this.setState({ searchText: event.target.value });
  }

  render() {
    return (
      <div className="row">
        <div className="col-lg-9 input-group">
          <input
            type="text"
//            className="form-control input-lg"
className="form-control my-0 py-1 amber-border"
            onChange={e => this.handleChange(e)}
            placeholder={this.state.placeHolder}
          />
          <span className="input-group-append">
            <button className="input-group-text amber lighten-3" onClick={this.handleOnClick.bind(this)}> Go </button>
          </span>
        </div>
        <button className="btn btn-dark" onClick={this.onClickMoon}><i class="fas fa-moon"></i></button>

      </div>



    );
  }
  handleOnClick(event) {
    this.props.callback(this.state.searchText);
  }
}


export default SearchBar;
