import { Route } from "react-router-dom";
import {
  HomeContainer,
  FindUserContainer,
  CheckNickContainer,
  ListRepoFilesContainer,
  BrowseReposContainer,
} from "./containers/";
import { AppProvider } from "./providers/AppProvider";

const App = () => {
  return (
    <AppProvider>
      <Route path="/" element={<HomeContainer />} />
      <Route path="/users" element={<FindUserContainer />}>
        <Route path=":nick" element={<CheckNickContainer />} />
      </Route>
      <Route path="/repos">
        <Route path=":nick" element={<BrowseReposContainer />}>
          <Route path=":repo" element={<ListRepoFilesContainer />} />
        </Route>
      </Route>
    </AppProvider>
  );
};

export default App;
