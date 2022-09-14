# start command

`npm run dev`

# Url architecture

- `/` - your base
- `/users` - place to search the user
- `/users/:nick` - preloading the user on enter
- `/repos/:nick `- place to browse repos of given user
- `/repos/:nick/:repo` - place to browse files of given user and repo

# Error cases

- When you enter a page with `:nick` required and github isn't able to find that user, you will get redirected to `/users`.

- When you enter a page with `:repo` required and github isn't able to find that user, you will get redirected to `/repos/:nick` - `:nick` check is propagating.

# Todos:

- Poor styles - _sorry, had no time_,
- Add prefetchig on link hover,
- Dealing with pagination is **painfull** becouse of poor numeric inputs implementation **(page of repos and repos per page)**
- saving query parameters when moving between `/repos/:nick` and `/repos/:nick/:repo`
- TESTS
- Now you can enter /repos and see blank page
- Cut components into smaller chunks

# most important used libraries

- `@tanstack/react-query` - easy to use tool for asynchronous state management, enables ways to manipule feching behaviours with easy to setup caching. **Why used?** Rapid and relaible asynchronous state implementation.

- `@chakra-ui/react` - simple, modular and accessible component library based on React, awared with _Most impactful Project to the Community_. **Why used?** Very fast ui creation with multiple solved UI/UX problems.
