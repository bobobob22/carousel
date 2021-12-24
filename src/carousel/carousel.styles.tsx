import styled from "styled-components";

export const MainWrapper = styled.div`
  margin: 0 auto;
  overflow: hidden;
  text-align: center;
  font-size: 1rem;

  @media all and (min-width: 1200px) {
    width: 1000px;
  }
`;

export const StyledTitle = styled.h2`
  font-size: 1.5rem;
`;

export const SliderWrapper = styled.div<{ translation: number }>`
  display: inline-flex;
  transition: all 0.5s ease-in-out;
  transform: translateX(${(props) => props.translation}px);
  margin: 10px 0;
  width: 100%;
`;

export const PostWrapper = styled.div`
  background: #c2c2c2;
  padding: 2rem;
  width: 100%;
  flex: 0 0 100%;
`;

export const CommentsWrapper = styled.div`
  background: #000;
  color: #fff;
  padding: 1rem;
  margin-bottom: 1rem;
`;

export const CommentBox = styled.div``;

export const Button = styled.button`
  border: 1px solid #000;
  color: #000;
  background: transparent;
  transition: all 0.5s ease;
  padding: 1rem 2rem;
  cursor: pointer;
  margin: 0 5px;
  font-weight: bold;
  font-size: 1.2rem;

  &:hover {
    background: #000;
    color: #fff;
  }

  &:disabled {
    pointer-events: none;
    opacity: 0.5;
  }
`;

export const StyledCommentsList = styled.ul`
  list-style-type: none;
  padding: 0;
  text-align: left;
`;

export const CommentsListItem = styled.li`
  border-bottom: 1px solid #fff;
`;

export const CommentTitle = styled.h3`
  text-align: center;
  font-size: 1.2rem;
`;

export const TransitionBox = styled.div`
  transition: opacity 0.3s;

  // enter from
  &.fade-enter {
    opacity: 0;
  }

  // enter to
  &.fade-enter-active {
    opacity: 1;
  }

  // exit from
  &.fade-exit {
    opacity: 1;
  }

  // exit to 
  &.fade-exit-active {
    opacity: 0;
  }
}`;
