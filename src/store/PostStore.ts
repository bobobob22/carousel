import {
  action,
  computed,
  makeObservable,
  observable,
  runInAction,
} from "mobx";
import { RootStore } from "./RootStore";

import { postApi } from "../utils/postVariables";

type Post = {
  body: string;
  title: string;
  id: number;
};

type Comment = {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
};

export type Comments = {
  postId: number;
  comments: Comment[];
};

export class PostStore {
  root: RootStore;
  posts: Post[] = [];
  comments: Comments[] = [];
  activePostId: number = 0;
  activePost: number = 0;

  constructor(root: RootStore) {
    this.root = root;
    makeObservable(this, {
      posts: observable,
      comments: observable,
      activePost: observable,
      activePostId: observable,
      fetchPosts: action,
      postComments: computed,
      handleSlidePrev: action,
      handleSlideNext: action,
    });
  }

  async fetchPosts() {
    const response = await fetch(`${postApi}/posts`);
    const data = (await response.json()) as Post[];

    runInAction(() => {
      this.posts = data;
      const firstPostId = data[0].id;
      this.activePost = 0;
      this.activePostId = firstPostId;

      this.fetchFirstPostComments(firstPostId);
    });
  }

  async fetchFirstPostComments(postId: number) {
    for (const comment of this.comments) {
      if (comment.postId === postId) {
        continue;
      }
    }
    const response = await fetch(`${postApi}/comments/?postId=${postId}`);
    const data = (await response.json()) as Comment[];

    runInAction(() => {
      this.comments = [
        ...this.comments,
        {
          postId: postId,
          comments: data,
        },
      ];

      this.fetchNextPostComments();
    });
  }

  async fetchNextPostComments() {
    const currentPostIndex = this.posts.findIndex(
      (post) => post.id === this.activePostId
    );
    const nextPostId = this.posts[currentPostIndex + 1].id;

    for (const comment of this.comments) {
      if (comment.postId === nextPostId) {
        return;
      }
    }

    const response = await fetch(`${postApi}/comments/?postId=${nextPostId}`);
    const data = (await response.json()) as Comment[];
    runInAction(() => {
      this.comments = [
        ...this.comments,
        {
          postId: nextPostId,
          comments: data,
        },
      ];
    });
  }

  get postComments() {
    return this.comments.find(
      (comment) => comment.postId === this.activePostId
    );
  }

  handleSlidePrev() {
    if (this.activePost !== 0) {
      const currentPostIndex = this.posts.findIndex(
        (post) => post.id === this.activePostId
      );
      const prevPost = this.activePost - 1;
      const prevPostId = this.posts[currentPostIndex - 1].id;

      this.activePost = prevPost;
      this.activePostId = prevPostId;
    }
  }

  handleSlideNext() {
    if (this.activePost !== this.posts.length) {
      const currentPostIndex = this.posts.findIndex(
        (post) => post.id === this.activePostId
      );
      const nextPost = this.activePost + 1;
      const nextPostId = this.posts[currentPostIndex + 1].id;

      this.activePost = nextPost;
      this.activePostId = nextPostId;

      this.fetchNextPostComments();
    }
  }
}
