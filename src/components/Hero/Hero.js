import Post from "../Post/Post";
import React, { useState, useEffect } from "react";
import Cookies from "universal-cookie";
import { Container, Row, Col, Badge } from "react-bootstrap";

const axios = require("axios");

const Hero = (props) => {
  const cookies = new Cookies();

  const [titleList, setTitleList] = useState([]);
  const [nextPage, setNextPage] = useState(1);
  const [titleLimit, setTitleLimit] = useState(100);
  const [filters, setFilters] = useState("snowflake;" + props?.filter ?? "");
  const [searchFor, setSearchFor] = useState(cookies.get("search"));
  const [queryList, setQueryList] = useState(cookies.get("queryList"));
  const [answerState, setAnswerState] = useState(cookies.get("answered"));
  const [drillTags, setDrillTags] = useState([]);

  useEffect(() => {
    getTitles(nextPage, titleLimit, filters);
    getDrillTags();
  }, []);

  useEffect(() => {
    function onScroll() {
      let currentPosition = window.scrollY;

      if (
        document.body.clientHeight ===
        currentPosition + window.innerHeight - 10
      ) {
        getTitles(nextPage, titleLimit, filters);
        getDrillTags();
      }
    }

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [nextPage]);

  const getDrillTags = () => {
    let tempDrillTags = [];
    if (window.location.pathname.length > 1) {
      tempDrillTags.push(
        <span key="drills" style={{ fontWeight: "bold", fontSize: "10pt" }}>
          Drill Bits:{" "}
        </span>
      );

      window.location.pathname
        .substring(1, window.location.pathname.length - 1)
        .split(";")
        .forEach((tag) => {
          console.log(tag);
          tempDrillTags.push(
            <Badge key={tag} className="me-1 my-1 bg-secondary">
              {tag}
            </Badge>
          );
        });
    }

    setDrillTags([...tempDrillTags]);
  };

  const unEscape = (htmlStr) => {
    htmlStr = htmlStr.replace(/&lt;/g, "<");
    htmlStr = htmlStr.replace(/&gt;/g, ">");
    htmlStr = htmlStr.replace(/&quot;/g, '"');
    htmlStr = htmlStr.replace(/&#39;/g, "'");
    htmlStr = htmlStr.replace(/&amp;/g, "&");
    return htmlStr;
  };

  // console.log(drillTags);

  const switchCase = () => {
    switch (answerState) {
      case "true":
        return "&accepted=True";
      case "false":
        return "&accepted=False";
      default:
        return "";
    }
  };

  const clearSearch = (event) => {
    cookies.remove("search", { path: "/" });
    cookies.remove("answered", { path: "/" });
    cookies.remove("queryList", { path: "/" });

    window.location.href = "/";
  };

  let clearSearchLink = "";
  if (
    cookies.get("search") ||
    cookies.get("queryList") ||
    drillTags.length > 0
  ) {
    clearSearchLink = (
      <Col xs={4} className="text-end">
        <h6>
          <span
            key="drills"
            style={{ fontWeight: "bold", fontSize: "10pt", cursor: "pointer" }}
            onClick={clearSearch}
          >
            {" "}
            Clear Search
          </span>
        </h6>
      </Col>
    );
  }

  const getTitles = (pageNum, pageSize, nextPage) => {
    let queryUrl = "";
    let queryTack = "";

    if (searchFor) {
      queryTack = switchCase(answerState);
      console.log(queryTack);

      searchFor.replace(/[+#]/gi, "\\$&");
      queryUrl = `https://api.stackexchange.com/2.3/search/advanced?tagged=[${filters}]&page=${pageNum}&pagesize=${pageSize}&title=${searchFor}&site=stackoverflow&key=DkLwlYTWw9AoNuzTYgmnUg((${queryTack}`;
      console.log(queryUrl);
    } else if (queryList) {
      console.log(queryList);
      queryUrl = `https://api.stackexchange.com/2.3/questions?tagged=[${queryList}]&page=${pageNum}&pagesize=${pageSize}&site=stackoverflow&key=DkLwlYTWw9AoNuzTYgmnUg((`;
    } else {
      queryUrl = `https://api.stackexchange.com/2.3/questions?tagged=[${filters}]&page=${pageNum}&pagesize=${pageSize}&site=stackoverflow&key=DkLwlYTWw9AoNuzTYgmnUg((`;
    }

    axios
      .get(queryUrl)
      .then((res) => {
        const titles = [];
        const { items } = res.data;

        items.forEach((item) => {
          titles.push(
            <Post
              key={item.question_id}
              title={unEscape(item.title)}
              tags={item.tags}
              date={item.creation_date}
              link={item.link}
              answered={item.is_answered}
              acceptedAnswer={item.accepted_answer_id}
              filters={filters}
            />
          );
        });

        setTitleList([...titleList, ...titles]);
        setNextPage(pageNum + 1);
      })
      .catch((e) => {
        console.log("error: ", e.message);
      });
  };

  return (
    <>
      <br />
      <Container>
        <Row>
          <Col xs={8}>{drillTags}</Col>
          {clearSearchLink}
        </Row>
        {titleList}
      </Container>
    </>
  );
};

export default Hero;
