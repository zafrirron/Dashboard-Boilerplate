import React from "react";
import StrapiHtmlComponent from "../components/StrapiMkdn";

const App = (props) => {
  return (
    <div>
      <h1>About</h1>
      <StrapiHtmlComponent componentName={props.componentName} />
    </div>
  );
};

export default App;
