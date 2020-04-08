import React from "react";
import "./App.css";
import logo from "./logo.svg";
import LinksList from "./components/LinksList";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      search: ""
    };
  }

  onSearchInput = event => {
    const searchInput = event.target.value
    this.setState({
      search: searchInput
    })
  }


  render() {
    return (
      <>
        <div className='intro'>
        <img src={logo} className="App-logo" alt="logo" />
        <h1>React Link Sharing</h1>
          <div className='searchBar'>
            Search for links:
        <input
          type="text"
          value={this.state.search}
          onChange={this.onSearchInput} 
          />
          </div>
        </div>
        <hr />
        <LinksList search={this.state.search}/>
      </>
    );
  }
}

export default App;
