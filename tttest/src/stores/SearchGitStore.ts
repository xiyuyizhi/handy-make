import { autorun, computed, observable } from "mobx";

import { Fetcher } from "handy-demo-common";

export default class SearchGit {
  @observable
  public keyword: string = "";

  @observable
  public list: any[] = [];

  @observable
  public fetchFinish: boolean = false;

  @observable
  public fetchStart: boolean = false;

  @observable
  public loadNext: boolean = false;

  @observable
  public page: number = 1;

  @computed
  get count(): number {
    return this.list.length;
  }

  constructor() {
    autorun(() => {
      // change  keyword , reset page
      if (this.keyword) {
        this.page = 1;
        this.list = [];
      }
    });

    autorun(() => {
      // 这里监听了两个变量，keyword、page
      // keyword变化的话搜索了新的值，page应该置为1,见上面的authrun
      if (!this.keyword) {
        return;
      }
      this.fetchStart = true;
      Fetcher.fecthRepos(this.keyword, this.page).then((data: any) => {
        if (!data.items) {
          alert(data.message);
        } else if (this.page !== 1) {
          this.list = this.list.concat(data.items);
        } else {
          this.list = data.items;
        }
        this.fetchFinish = true;
        // reset
        this.fetchStart = false;
      });
    });
  }

  public loadNextPage = () => {
    this.page += 1;
  }

  public getUserInput(value: string) {
    this.keyword = value;
  }
}
