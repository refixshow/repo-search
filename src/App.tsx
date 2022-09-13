import { Route, Navigate } from "react-router-dom";
import {
  HomeContainer,
  FindUserContainer,
  // CheckNickContainer,
  ListRepoFilesContainer,
  BrowseReposContainer,
} from "./containers/";
import { AppProvider } from "./providers/AppProvider";

const App = () => {
  return (
    <AppProvider>
      <Route path="/" element={<HomeContainer />} />
      <Route path="/users" element={<FindUserContainer />}>
        <Route path=":nick" element={<FindUserContainer />} />
        {/* <Route path=":nick" element={<CheckNickContainer />} /> */}
      </Route>
      <Route path="/repos">
        <Route path=":nick" element={<BrowseReposContainer />} />
        <Route path=":nick/:repo" element={<ListRepoFilesContainer />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </AppProvider>
  );
};

export default App;
