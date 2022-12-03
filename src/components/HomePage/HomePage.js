import React from "react";
import Hero from "../Hero/Hero";

const HomePage = (props) => {
  let filter = "";
  if (props.match.params.filter !== undefined) {
    filter = props.match.params.filter;
  }

  return (
    <div>
      <Hero filter={filter} />
    </div>
  );
};

export default HomePage;
