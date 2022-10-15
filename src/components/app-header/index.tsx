import React from "react";
import "./style.scss";

type Props = {
  title?: string;
};

const AppHeader = (props: Props) => {
  return (
    <header>
      <div className="container">
        <div className="title-wrapper">
          <h1>{props.title ? props.title : "Title Placeholder"}</h1>
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
