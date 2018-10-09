import { observable, autorun, computed } from "mobx";

import { Fetcher } from "handy-demo-common";

export default class SearchGit {
  @observable
  keyword = "";

  @observable
  list = [];

  @observable
  fetchFinish = false;

  @observable
  fetchStart = false;

  @observable
  loadNext = false;

  @observable
  page = 1;

  @computed
  get count() {
    return this.list.length;
  }

  constructor() {
    autorun(() => {
      //change  keyword , reset page
      if (this.keyword) {
        this.page = 1;
        this.list = [];
      }
    });

    autorun(() => {
      //这里监听了两个变量，keyword、page
      //keyword变化的话搜索了新的值，page应该置为1,见上面的authrun
      if (!this.keyword) return;
      this.fetchStart = true;
      Fetcher.fecthRepos(this.keyword, this.page).then(data => {
        if (!data.items) {
          alert(data.message);
        } else {
          if (this.page !== 1) {
            this.list = this.list.concat(data.items);
          } else {
            this.list = data.items;
          }
        }
        this.fetchFinish = true;
        //reset
        this.fetchStart = false;
      });
    });
  }

  loadNextPage = () => {
    this.page++;
  };

  getUserInput(value) {
    this.keyword = value;
  }
}
