import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { getTwilioRepos } from "../../helpers/getTwilioTags";
import RepoCard from "./Cards/RepoCard";
import "./Repos.scss";

const Repos = () => {
  const [repos, setRepos] = useState();

  useEffect(() => {
    getTwilioRepos("snowflake").then((res) => {
      console.log(res.data);

      res.data.sort(
        (firstItem, secondItem) => secondItem.forks - firstItem.forks
      );

      let tempRepos = [];

      for (let x = 0; x < res.data.length; x++) {
        tempRepos.push(
          <RepoCard
            key={x}
            name={res.data[x].name}
            forks={res.data[x].forks}
            url={res.data[x].url}
          />
        );
      }

      setRepos(tempRepos);
    });
  }, []);

  return (
    <Container>
      <Row>
        <Col>
          <div className="repo-container">{repos}</div>
        </Col>
      </Row>
    </Container>
  );
};

export default Repos;
