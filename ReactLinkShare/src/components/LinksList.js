import React from "react";
import "../App.css";
import Link from "./Link";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { Container } from 'reactstrap';


class LinksList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      link: [],
      modal: false,
      input: ""
    };
  }

  addLink = () => {
    const links = this.state.link;
    const urlInput = this.state.input;
    links.push(urlInput);
    localStorage.setItem("links", JSON.stringify(links));
    this.setState({
      link: links,
      input: "",
      modal: !this.state.modal
    });
  };

  updateInput = event => {
    this.setState({
      input: event.target.value
    });
  };

  deleteLink = link => {
    const links = this.state.link;
    links.splice(links.indexOf(link), 1);
    localStorage.setItem("links", JSON.stringify(links));
    this.setState({
      link: links
    });
  };

  toggleModal = () => {
    this.setState({
      modal: !this.state.modal
    });
  };

  render() {
    const search = this.props.search.toLowerCase()
    const filteredList = this.state.link.filter(link => {
      return (
        link.indexOf(search) !== -1
      )
    })

    return (
      <>
        <Container>
        <Button className="addButton" color="danger" onClick={this.toggleModal}>
          Add Link
        </Button>
        <Modal isOpen={this.state.modal} toggle={this.toggleModal}>
          <ModalHeader toggle={this.toggleModal}>Type links now!</ModalHeader>
          <ModalBody>
            <h5>URL:</h5>
            <input
              type="text"
              placeholder="url"
              value={this.state.input}
              onChange={this.updateInput}
            ></input>
          </ModalBody>
          <ModalFooter>
            <Button onClick={this.addLink}>Add</Button>
          </ModalFooter>
          </Modal>
          <div className='linkList'>
        {filteredList.map((link, index) => (
            <Link href={link} key={index} delete={this.deleteLink} />
        ))}
            </div>
          </Container>
      </>
    );
  }
}

export default LinksList;
