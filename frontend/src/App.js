import { Heading, Page } from "@shopify/polaris";

const App = ({ shop }) => {
  return (
    <>
      {shop && (
        <Page>
          <Heading>Shopify app with Node and React 🎉</Heading>
        </Page>
      )}

      {!shop && (
        <Page>
          <Heading>Please enter your *.myshopify.com URL</Heading>
        </Page>
      )}
    </>
  );
};

export default App;
