import React from "react";
import StrapiHtmlComponent from "../components/StrapiHtml";

const App = (props) => {
  return (
    <div>
      <h1>Page A</h1>
      <StrapiHtmlComponent componentName={props.componentName} />
    </div>
  );
};

export default App;
