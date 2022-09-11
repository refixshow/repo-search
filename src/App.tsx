import { BrowserRouter, Route, Routes } from "react-router-dom";

import { QueryClientProvider } from "./lib/index";

import { HomeContainer } from "./containers/Home";
import { FindUserContainer } from "./containers/FindUser";
import { CheckNickContainer } from "./containers/CheckNick";
import { ListRepoFilesContainer } from "./containers/RepoFiles";
import { BrowseReposContainer } from "./containers/BrowseRepos";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* <QueryClientProvider> */}
        <Route path="/" element={<HomeContainer />} />
        <Route path="/users" element={<FindUserContainer />}>
          <Route path=":nick" element={<CheckNickContainer />} />
        </Route>
        <Route path="/repos">
          <Route path=":nick" element={<BrowseReposContainer />}>
            <Route path=":repo" element={<ListRepoFilesContainer />} />
          </Route>
        </Route>
        {/* </QueryClientProvider> */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
