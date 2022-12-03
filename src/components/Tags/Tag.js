import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";

const Tag = (props) => {
  const [tagHref, setTagHref] = useState("");
  const [match, setMatch] = useState("");

  useEffect(() => {
    checkForTagMatch();
  }, [match]);

  // console.log(props.tag);

  let variant = "";

  let propsTag = props.tag.replace(/[+#]/g, "\\$&");
  let regEx = new RegExp(`(${propsTag});`, "gi");

  const checkForTagMatch = () => {
    // console.log(window.location.pathname);
    if (window.location.pathname.match(regEx)) {
      setTagHref(window.location.pathname.replace(regEx, ""));
      setMatch("yes");
    } else {
      setTagHref(`${window.location.pathname}${props.tag};`);
      setMatch("no");
    }
  };

  props.filters.match(regEx)
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
