import React from "react";

export default class Link extends React.Component {


  render() {
    return (
      <>
        <ul>
          <ol>
            <div>
              URL: <a
                href={this.props.href}
                target="_blank"
                rel="noopener noreferrer"
              >
                {this.props.href}
              </a>
              <br />
              <button onClick={this.props.delete}>Delete</button>
            </div>
          </ol>
        </ul>
      </>
    );
  }
}
