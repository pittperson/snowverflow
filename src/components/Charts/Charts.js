import React, { useEffect, useState } from "react";
import { Container, Col, Row, Dropdown, Badge } from "react-bootstrap";
import axios from "axios";
import { Bar } from "react-chartjs-2";

const getLastItem = (thePath) =>
  thePath.substring(thePath.lastIndexOf("/") + 1);

const Charts = () => {
  const [categories, setCategories] = useState([]);
  const [links, setLinks] = useState([]);
  const [dataArray, setDataArray] = useState({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    getTwilioTags("snowflake").then((res1) => {
      let tempKeys = [];

      for (let i = 0; i < res1.data.items.length; i++) {
        let category = res1.data.items[i];

        if (tempKeys.indexOf(category.name) < 0) {
          tempKeys.push(category.name);

          categories.push(
            <Dropdown.Item
              href={window.location.origin + "/charts/" + category.name}
              key={i}
            >
              {category.name}
            </Dropdown.Item>
          );
        }
      }
    });

    let lastPathItem = getLastItem(window.location.pathname);
    let categoryName = lastPathItem;

    if (lastPathItem !== "charts") {
      let tempRelatedTags = [];
      let tempData = [];
      let tempDatasets = [];

      getRelatedTags(categoryName).then((relatedTags) => {
        for (
          let RtIndex = 0;
          RtIndex < relatedTags.data.items.length;
          RtIndex++
        ) {
          if (
            !tempRelatedTags.includes(relatedTags.data.items[RtIndex].name) &&
            categoryName !== relatedTags.data.items[RtIndex].name
          ) {
            tempRelatedTags.push(relatedTags.data.items[RtIndex].name);
            tempData.push(relatedTags.data.items[RtIndex].count);
          }
        }

        tempDatasets.push({
          data: tempData,
          backgroundColor: [
            "rgba(254,171,5, 1.0)",
            "rgba(254,171,5, 0.9)",
            "rgba(254,171,5, 0.8)",
            "rgba(254,171,5, 0.7)",
            "rgba(254,171,5, 0.6)",
            "rgba(254,171,5, 0.5)",
            "rgba(254,171,5, 0.4)",
            "rgba(254,171,5, 0.3)",
            "rgba(254,171,5, 0.2)",
            "rgba(254,171,5, 0.1)",
          ],
          borderColor: [
            "rgba(254,171,5)",
            "rgba(254,171,5)",
            "rgba(254,171,5)",
            "rgba(254,171,5)",
            "rgba(254,171,5)",
            "rgba(254,171,5)",
            "rgba(254,171,5)",
            "rgba(254,171,5)",
            "rgba(254,171,5)",
            "rgba(254,171,5)",
          ],
          borderWidth: 1,
        });

        setDataArray({
          labels: tempRelatedTags,
          datasets: tempDatasets,
        });

        let tempLinks = [];
        tempRelatedTags.forEach((tag) => {
          tempLinks.push(
            <Badge
              className="rm-3 bg-darkcyan"
              key={tag}
              style={{
                fontWeight: "bold",
                fontSize: "9pt",
                cursor: "pointer",
                borderRadius: "4px",
                padding: "4px",
                marginRight: "2px",
                marginBottom: "1rem",
              }}
            >
              <a href={"/" + tag + ";"} style={{ color: "#fff" }}>
                {tag}
              </a>
            </Badge>
          );
        });
        setLinks(tempLinks);
      });
    } else {
      console.log("choose a dropdown");
    }
  }, []);

  console.log(dataArray);

  const options = {
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        font: { size: "20pt" },
        text: `Top 10 Related Tags for ${getLastItem(
          window.location.pathname
        )}`,
      },
      legend: {
        display: false,
      },
    },
    scales: {
      y: {},
      x: {},
    },
  };

  async function getTwilioTags(tagName) {
    let queryUrl = "";
    queryUrl = `https://api.stackexchange.com/2.3/tags?order=desc&sort=popular&inname=${tagName}&pagesize=100&site=stackoverflow&key=DkLwlYTWw9AoNuzTYgmnUg((`;

    return axios
      .get(queryUrl)
      .then((res) => {
        return res;
      })
      .catch((e) => {
        console.log("error: ", e.message);
      });
  }

  async function getRelatedTags(tagName) {
    let queryUrl = "";
    queryUrl = `https://api.stackexchange.com/2.3/tags/${tagName}/related?pagesize=10&site=stackoverflow&key=DkLwlYTWw9AoNuzTYgmnUg((`;

    return axios
      .get(queryUrl)
      .then((res) => {
        return res;
      })
      .catch((e) => {
        console.log("error: ", e.message);
      });
  }

  const homeWithSearch = (tag) => {
    window.location.href = `/${tag}`;
  };

  return (
    <>
      <Container>
        <Row>
          <Col>
            <br />
            <Dropdown className="mb-4">
              <Dropdown.Toggle variant="darkcyan" size="sm" id="dropdown-basic">
                Snowflake Categories
              </Dropdown.Toggle>

              <Dropdown.Menu>{categories}</Dropdown.Menu>
            </Dropdown>
          </Col>
        </Row>
        <Row>
          <Col>
            <Bar data={dataArray} options={options} redraw />
          </Col>
        </Row>
        <Row>
          <Col>
            <div style={{ marginLeft: "3rem", marginBottom: "2rem" }}>
              {links}
            </div>
          </Col>
        </Row>
      </Container>
    </>
  );
};
export default Charts;
