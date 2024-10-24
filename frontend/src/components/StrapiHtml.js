import React, { useEffect, useState } from "react";
import axios from "axios";

const StrapiHtmlComponent = ({ componentName }) => {
  const [htmlContent, setHtmlContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const strapiApiKey = process.env.REACT_APP_STRAPI_AUTH_API;
  const strapiHost = process.env.REACT_APP_STRAPI_HOST || "localhost";
  const strapiPort = process.env.REACT_APP_STRAPI_PORT || "1337";

  useEffect(() => {
    const fetchHtmlContent = async () => {
      try {
        const response = await axios.get(
          `http://${strapiHost}:${strapiPort}/api/${componentName}`,
          {
            headers: {
              Authorization: `Bearer ${strapiApiKey}`,
            },
          }
        );
        // Assume the HTML content is stored under a field called `htmlContent`
        setHtmlContent(response.data.data[componentName]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching HTML content from Strapi:", err);
        setError("Error fetching content.");
        setLoading(false);
      }
    };

    fetchHtmlContent();
  }, [componentName]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div
      className="strapi-html-content"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
};

export default StrapiHtmlComponent;
