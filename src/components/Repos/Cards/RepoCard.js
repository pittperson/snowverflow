import React from "react";
import { Link } from "react-router-dom";
import { getTwilioRepoCommits } from "../../../helpers/getTwilioTags";
import "./RepoCard.scss";

const RepoCard = (props) => {
  // console.log(props);

  // getTwilioRepoCommits("snowflake", props.name).then((res) => {
  //   console.log(res.data);
  // });

  return (
    <div className="repo-card">
      <div className="repo-name">
        <a href={props.html_url}>{props.name}</a>
      </div>
    </div>
  );
};

export default RepoCard;
