import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

const Tag = (props) => {
  const [tagHref, setTagHref] = useState("");
  const [match, setMatch] = useState("");

  useEffect(() => {
    checkForTagMatch();
  }, []);

  let variant = "";

  let propsTag = props.tag.replace(/[+#]/g, "\\$&");
  let regEx = new RegExp(`(${propsTag});`, "gi");

  console.log(propsTag);

  const checkForTagMatch = () => {
    if (
      window.location.pathname.includes(propsTag) ||
      propsTag.includes("snowflake")
    ) {
      setTagHref(window.location.pathname.replace(regEx, ""));
      // setTagHref(`${window.location.pathname}${props.tag};`);
      setMatch("yes");
    } else {
      setTagHref(`${window.location.pathname}${props.tag};`);
      setMatch("no");
    }
  };

  match === "yes"
    ? (variant = "outline-snowblue")
    : (variant = "outline-secondary");

  return (
    <>
      <Button className="mt-1" variant={variant} size="sm">
        <a href={`${window.location.origin}${tagHref}`}>{props.tag}</a>
      </Button>{" "}
    </>
  );
};

export default Tag;
