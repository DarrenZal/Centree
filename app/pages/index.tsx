import { Home } from "components/views/Home";
import { WithIsomorphicRouter } from "components/WithIsomorphicRouter";
import { WithRedux } from "components/WithRedux";
import { NextPage } from "next";
import { PageHead } from "components/PageHead";
import { IS_PRODUCTION } from "lib/constants";

const HomePage: NextPage = () => {
  return (
    <>
      <PageHead
        production={IS_PRODUCTION}
        title="Centree | Official dApp"
        mediaTitle="Centree | Official dApp"
        metaDescription="Use the Centree dApp to bond, stake and earn interest."
        mediaImageSrc="/og-media.jpg"
      />
      <WithRedux>
        <WithIsomorphicRouter location="/#">
          <Home />
        </WithIsomorphicRouter>
      </WithRedux>
    </>
  );
};

export default HomePage;
