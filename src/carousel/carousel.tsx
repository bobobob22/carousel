import React, { useState, useEffect, useMemo, useRef } from "react";
import { observer } from "mobx-react-lite";
import { useSwipeable } from "react-swipeable";
import { CSSTransition } from "react-transition-group";

import { usePostStore } from "../providers/RootStoreProvider";
import { useKeypress } from "../hooks/useKeyPress";
import {
  MainWrapper,
  SliderWrapper,
  PostWrapper,
  CommentsWrapper,
  CommentBox,
  Button,
  StyledCommentsList,
  CommentsListItem,
  CommentTitle,
  TransitionBox,
  StyledTitle,
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
          <StyledTitle>{post.title}</StyledTitle>
          <p>{post.body}</p>
        </PostWrapper>
      );
    });
  }, [postStore.posts]);

  const postCommentsList = (
    <div>
      <CommentsWrapper>
        <StyledTitle>Comments</StyledTitle>
        <StyledCommentsList>
          {postStore.postComments &&
            postStore.postComments.comments.map((comment) => {
              return (
                <CommentsListItem key={comment.id}>
                  <CSSTransition
                    in={!commentsChange}
                    classNames="fade"
                    timeout={600}
                    unmountOnExit
                  >
                    <TransitionBox>
                      <CommentBox>
                        <CommentTitle>{comment.name}</CommentTitle>
                        <p>{comment.body}</p>
                      </CommentBox>
                    </TransitionBox>
                  </CSSTransition>
                </CommentsListItem>
              );
            })}
        </StyledCommentsList>
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
        <Button
          onClick={() => postStore.handleSlidePrev()}
          disabled={postStore.activePost === 0}
        >
          Prev
        </Button>
        <Button
          onClick={() => postStore.handleSlideNext()}
          disabled={postStore.activePost === postStore.posts.length - 1}
        >
          Next
        </Button>
      </div>
    </MainWrapper>
  );
});
