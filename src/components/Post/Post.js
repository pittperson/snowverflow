import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import Tag from "../Tags/Tag";
import "./Post.scss";

const Post = (props) => {
  let x = 1;
  const tagList = [];

  // console.log(props.tags);

  props.tags.forEach((tag) => {
    tagList.push(<Tag key={x} tag={tag} filters={props.filters} />);
    x++;
  });

  let bgColor = "";
  if (props.answered.toString() === "true") {
    if (props.acceptedAnswer) {
      bgColor = "#198754";
    } else {
      bgColor = "#ffc106";
    }
  } else {
    bgColor = "#dc3645";
  }

  return (
    <>
      <Container className="titleBox">
        <Row>
          <Col xs={10}>
            <Row className="p-0">
              <Col>
                <a href={props.link} target="_blank" rel="noreferrer">
                  {props.title}
                </a>
              </Col>
            </Row>
            <Row>
              <Col>
                <div className="pt-1 pb-1">{tagList}</div>
              </Col>
            </Row>
          </Col>
          <Col xs={2} className="p-0 text-end">
            <div
              style={{
                backgroundColor: bgColor,
                width: "20px",
                height: "100%",
                float: "right",
                textAlign: "center",
                color: "#fff",
              }}
            >
              {" "}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default Post;
