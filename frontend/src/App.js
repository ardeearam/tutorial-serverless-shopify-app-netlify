import {
  Heading,
  Page,
  TextField,
  Button,
  FormLayout,
  Card,
  DisplayText,
  Layout,
} from "@shopify/polaris";
import { useEffect, useState, useCallback } from "react";

const App = ({ shop }) => {
  let backendPath;
  if (process.env.REACT_APP_SERVERLESS) {
    backendPath = "/.netlify/functions/index";
  } else {
    backendPath = "/api";
  }
  const [url, setUrl] = useState("*.myshopify.com");
  const handleUrlChange = useCallback((_url) => setUrl(_url), []);
  const redirect = () => {
    window.location = `${backendPath}/auth?shop=${url}`;
  };

  return (
    <>
      {shop && (
        <Page>
          <Layout>
            <Layout.Section>
              <DisplayText size="medium">{shop}</DisplayText>
              <Heading>Shopify app with Node and React 🎉</Heading>
            </Layout.Section>
          </Layout>
        </Page>
      )}

      {!shop && (
        <Page>
          <Layout>
            <Layout.Section>
              <DisplayText size="medium">
                Please enter your *.myshopify.com URL. This only works for
                development stores.
              </DisplayText>
              <FormLayout>
                <TextField
                  label="Store name"
                  value={url}
                  onChange={handleUrlChange}
                />
                <Button primary onClick={redirect}>
                  Install Live Demo on your store!
                </Button>
              </FormLayout>
            </Layout.Section>
          </Layout>
        </Page>
      )}
    </>
  );
};

export default App;
