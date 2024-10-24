import React, { useEffect, useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Typography, Box } from "@mui/material";

const StrapiMkdnComponent = ({ componentName }) => {
  const [mkdnContent, setMkdnContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const strapiApiKey = process.env.REACT_APP_STRAPI_AUTH_API;
  const strapiHost = process.env.REACT_APP_STRAPI_HOST || "localhost";
  const strapiPort = process.env.REACT_APP_STRAPI_PORT || "1337";

  useEffect(() => {
    const fetchMkdnContent = async () => {
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
        setMkdnContent(response.data.data[componentName]);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching HTML content from Strapi:", err);
        setError("Error fetching content.");
        setLoading(false);
      }
    };

    fetchMkdnContent();
  }, [componentName]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <Box sx={{  margin: "0 auto", fontSize: "16px" }}>
    <ReactMarkdown
      children={mkdnContent}
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ node, ...props }) => <Typography variant="h4" {...props} />,
        h2: ({ node, ...props }) => <Typography variant="h5" {...props} />,
        p: ({ node, ...props }) => <Typography variant="body1" {...props} />,
        a: ({ node, ...props }) => (<a style={{ color: "#1976d2" }} {...props} />),
        // Add more custom components as needed
      }}
    />
  </Box>
  );
};

export default StrapiMkdnComponent;
