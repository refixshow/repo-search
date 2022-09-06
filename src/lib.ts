// https://api.github.com/users/{nick} => { repos_url, avatar_url, login, html_url, public_repos }

// https://api.github.com/users/{nick}/repos ?per_page={items}&page={currentPage} => []{ html_url, name, ssh_url, clone_url, homepage, description, language }

// https://api.github.com/repos/{nick}/{repo}/git/trees/main?recursive=1 => { tree: []{ url, path } }
export {};
