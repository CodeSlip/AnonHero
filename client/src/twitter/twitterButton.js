import React from "react";
import { Button } from "reactstrap";

const twitterButton = props => {
  let fileURL = props.videoLink;
  return (
    <Button>
      <a
        style={{ color: "#fff" }}
        className="twitter-share-button"
        href="https://twitter.com/intent/tweet?text=Verified%20Image%20from%20AnonHer0  "
        data-size="large"
      >
        Tweet
      </a>
    </Button>
  );
};

export default twitterButton;
