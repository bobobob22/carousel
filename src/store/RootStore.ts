import { PostStore } from "./PostStore";

export class RootStore {
  postStore: PostStore;

  constructor() {
    this.postStore = new PostStore(this);
  }
}
