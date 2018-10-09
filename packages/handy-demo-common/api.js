import "whatwg-fetch";

function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

export default class Fetcher {
  static fecthRepos(search, page) {
    return fetch(`https://api.github.com/search/repositories?q=${search}&page=${page}&per_page=10`)
      .then(checkStatus)
      .then(res => res.json())
      .catch(ex => {
        return {
          message: ex.message
        };
      });
  }
}
