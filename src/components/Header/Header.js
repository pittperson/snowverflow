import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import {
  Container,
  Nav,
  Modal,
  InputGroup,
  FormControl,
  Dropdown,
  DropdownButton,
  Button,
  Badge,
  Row,
  Col,
} from "react-bootstrap";
import { getTwilioRepos, getTwilioTags } from "../../helpers/getTwilioTags";

import Navbar from "react-bootstrap/Navbar";
import "./Header.scss";

const Header = (props) => {
  const cookies = new Cookies();
  const [twilioTags, setTwilioTags] = useState([]);

  useEffect(() => {
    // grab all tags with "twilio" in the name
    let tempTwilioTags = [];
    getTwilioTags("snowflake").then((res) => {
      const { items } = res.data;
      items.forEach((item) => {
        tempTwilioTags.push(item.name);
      });

      setTwilioTags(tempTwilioTags);
    });
  }, []);

  // modal constants
  const [about, setAbout] = useState(false);
  const [search, setSearch] = useState(false);

  // search constants
  const [searchString, setSearchString] = useState("");
  const [searchTags, setSearchTags] = useState([]);

  const handleOnChange = (tag, position) => {
    const indexOfTag = searchTags.indexOf(tag);

    if (indexOfTag > -1) {
      let tempTags = searchTags.filter((t) => t !== tag);

      setSearchTags([...tempTags]);
    } else {
      setSearchTags([...searchTags, tag]);
    }
  };

  // handle modals
  const closeAbout = () => setAbout(false);
  const openAbout = () => setAbout(true);
  const closeSearch = () => setSearch(false);
  const openSearch = () => setSearch(true);

  // handle text search submit
  const handleSearch = (event) => {
    cookies.set("search", searchString, { path: "/" });
    cookies.set("answered", event, { path: "/" });
    closeSearch();
    window.location.replace("/");
  };

  const handleSearchByTags = async (searchTags) => {
    let queryList = "";
    searchTags.forEach((tag) => {
      queryList += `${tag};`;
    });

    cookies.set("queryList", queryList, { path: "/" });
    closeSearch();
    window.location.assign(`/${queryList}`);
  };

  return (
    <>
      <Navbar
        collapseOnSelect
        expand="sm"
        variant="dark"
        bg="snowblue"
        sticky="top"
        className="py-3"
      >
        <Container>
          <Navbar.Brand href="/">
            <img
              src="/logo512.png"
              width="30"
              height="30"
              className="d-inline-block align-top"
              alt="React Bootstrap logo"
            />{" "}
            Snowverflow
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="responsive-navbar-nav" />
          <Navbar.Collapse id="responsove-navbar-nav">
            <Nav className="text-end me-auto">
              <Nav.Link onClick={openAbout}>About</Nav.Link>

              <Nav.Link href="mailto:snowverflow@snowverflow.com">
                Contact
              </Nav.Link>

              <Nav.Link href="/charts/snowflake">Visualize</Nav.Link>

              {/* <Nav.Link href="/repos">GitHub Repo List</Nav.Link> */}

              <Nav.Link onClick={openSearch}>Search</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <Navbar className="border-bottom bg-light py-2">
        <Container>
          <Row>
            <Col>
              <Badge className="bg-success">Accepted Answer</Badge>{" "}
              <Badge className="bg-warning">Unaccepted Answer</Badge>{" "}
              <Badge className="bg-danger">No Answer</Badge>{" "}
            </Col>
          </Row>
        </Container>
      </Navbar>

      <Modal show={about} onHide={closeAbout}>
        <Modal.Header closeButton>
          <Modal.Title>About snowverflow</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* <div>
            New to Twilio, I was browsing stack
            <span style={{ fontWeight: "bold" }}>overflow</span> and me, being
            me, thought, "there has to be a quicker way to consume everything
            Twilio..." Enter snowverflow!
          </div>
          <br />
          <div>
            An aggregation of everything Twilio via stack
            <span style={{ fontWeight: "bold" }}>overflow</span>. Want to narrow
            things down? Just click on a tag below the title.
          </div>
          <br /> */}
          <div>
            This site is always changing. If it's broken, I'm making it better!
          </div>
        </Modal.Body>
      </Modal>

      <Modal show={search} onHide={closeSearch}>
        <Modal.Header closeButton>
          <Modal.Title>Search Snowverflow</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <FormControl
              aria-label="Search Titles For"
              placeholder="Search Titles For..."
              onChange={(e) => setSearchString(e.target.value)}
            />

            <DropdownButton
              variant="snowblue"
              title="Search"
              id="input-group-dropdown-2"
              align="end"
              onSelect={handleSearch}
            >
              <Dropdown.Item eventKey="">All</Dropdown.Item>
              <Dropdown.Item eventKey="true">Answered</Dropdown.Item>
              <Dropdown.Item eventKey="false">Unanswered</Dropdown.Item>
            </DropdownButton>
          </InputGroup>
        </Modal.Body>
        <Modal.Body>
          {twilioTags.map((tag, index) => {
            return (
              <Button
                className="mx-1 my-1"
                key={`${tag}`}
                variant={
                  searchTags.includes(tag)
                    ? "outline-snowblue"
                    : "outline-secondary"
                }
                value={`${tag} - ${index}`}
                onClick={() => handleOnChange(tag, index)}
                size="sm"
              >
                {tag}
              </Button>
            );
          })}

          <div className="d-grid gap-2">
            <Button
              className="mx-1 my-1 bg-snowblue"
              size="sm"
              onClick={() => handleSearchByTags(searchTags)}
            >
              Search By Tags
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Header;
