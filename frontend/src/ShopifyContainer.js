import fetch from "node-fetch";
import ApolloClient from "apollo-boost";
import { ApolloProvider } from "react-apollo";
//import App from "next/app";
import { AppProvider } from "@shopify/polaris";
import { Provider } from "@shopify/app-bridge-react";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import { useEffect, useState } from "react";
import queryString from "query-string";

const client = new ApolloClient({
  fetch: fetch,
  fetchOptions: {
    credentials: "include",
  },
});
const ShopifyContainer = ({ children }) => {
  const [shop, setShop] = useState(null);

  useEffect(() => {
    const params = queryString.parse(window.location.search);
    setShop(params.shop);
  }, []);

  const API_KEY = process.env.REACT_APP_SHOPIFY_API_KEY;

  return (
    <>
      {shop && (
        <AppProvider i18n={translations}>
          <Provider
            config={{
              apiKey: API_KEY,
              shopOrigin: shop,
              forceRedirect: true,
            }}
          >
            <ApolloProvider client={client}>
              {children({ shop })}
            </ApolloProvider>
          </Provider>
        </AppProvider>
      )}
      {!shop && (
        <AppProvider i18n={translations}>{children({ shop })}</AppProvider>
      )}
    </>
  );
};

/*
MyApp.getInitialProps = async ({ ctx }) => {
  return {
    shopOrigin: ctx.query.shop,
  };
};
*/

export default ShopifyContainer;
