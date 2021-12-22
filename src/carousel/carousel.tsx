import React, { useState, useEffect, useMemo, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useSwipeable } from "react-swipeable";

import { usePostStore } from "../providers/RootStoreProvider";
import { useKeypress } from "../hooks/useKeyPress";
import {
  MainWrapper,
  SliderWrapper,
  PostWrapper,
  CommentsWrapper,
  CommentBox,
  Button,
} from "./carousel.styles";
import { useElementWidth } from "../hooks/useElementWidth";
import { useIsMobile } from "../hooks/useIsMobile";

export const Carousel: React.FC = observer(() => {
  const postStore = usePostStore();
  const componentRef = useRef(null);
  const { width } = useElementWidth(componentRef);
  const [commentsChange, setCommentsChange] = useState(false);
  const isMobile = useIsMobile();

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => postStore.handleSlideNext(),
    onSwipedRight: () => postStore.handleSlidePrev(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: isMobile ? true : false,
  });

  useEffect(() => {
    postStore.fetchPosts();
  }, [postStore]);

  useEffect(() => {
    setCommentsChange(true);
  }, [postStore.postComments]);

  useEffect(() => {
    setCommentsChange(true);

    const timer = setTimeout(() => setCommentsChange(false), 300);

    return () => {
      clearTimeout(timer);
    };
  }, [postStore.postComments]);

  const postsList = useMemo(() => {
    if (!postStore.posts) {
      return null;
    }
    return postStore.posts.map((post) => {
      return (
        <PostWrapper key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.body}</p>
        </PostWrapper>
      );
    });
  }, [postStore.posts]);

  const postCommentsList = (
    <div>
      <CommentsWrapper shouldBeAnimated={commentsChange}>
        <h2>Comments</h2>
        {postStore.postComments &&
          postStore.postComments.comments.map((comment) => {
            return (
              <CommentBox key={comment.id}>
                <p>{comment.name}</p>
                <p>{comment.body}</p>
              </CommentBox>
            );
          })}
      </CommentsWrapper>
    </div>
  );

  const sliderTranslation = -(postStore.activePost * width);

  useKeypress("ArrowLeft", () => postStore.handleSlidePrev());
  useKeypress("ArrowRight", () => postStore.handleSlideNext());

  return (
    <MainWrapper {...swipeHandlers}>
      <SliderWrapper ref={componentRef} translation={sliderTranslation}>
        {postsList}
      </SliderWrapper>

      <div>{postCommentsList}</div>
      <div>
        <Button onClick={() => postStore.handleSlidePrev()}>Prev</Button>
        <Button onClick={() => postStore.handleSlideNext()}>Next</Button>
      </div>
    </MainWrapper>
  );
});
