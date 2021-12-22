import { useCallback, useEffect, useState } from "react";

const apiUrl = "https://jsonplaceholder.typicode.com";

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

const fetchPostData = async (): Promise<Post[]> => {
  const response = await fetch(`${apiUrl}/posts`);
  const data = (await response.json()) as Post[];

  return data;
};

const fetchComments = async (postId: number): Promise<Comment[]> => {
  const response = await fetch(`${apiUrl}/comments/?postId=${postId}`);
  const data = (await response.json()) as Comment[];

  return data;
};

export const useGetPostData = () => {
  const [postData, setPostData] = useState<Post[]>();
  const [commentsData, setCommentsData] = useState<Comment[]>();
  const [visiblePost, setVisiblePost] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const postsDataResponse = await fetchPostData();
      setPostData(postsDataResponse);
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (postData) {
      const fetchData = async () => {
        const commentsResponse = await fetchComments(postData[0].id);
        setCommentsData(commentsResponse);
        setVisiblePost(postData[0].id);
      };
      fetchData();
    }
  }, [postData]);

  useEffect(() => {
    if (visiblePost) {
      const fetchData = async () => {
        const commentsResponse = await fetchComments(visiblePost);
        setCommentsData(commentsResponse);
      };
      fetchData();
    }
  }, [visiblePost]);

  const handleSliderPrev = useCallback((): void => {
    if (visiblePost !== 0 && postData) {
      setVisiblePost(visiblePost - 1);
    }
  }, [visiblePost, postData]);

  const handleSliderNext = useCallback((): void => {
    if (postData && visiblePost !== postData.length) {
      setVisiblePost(visiblePost + 1);
    }
  }, [visiblePost, postData]);

  return {
    postData,
    handleSliderPrev,
    handleSliderNext,
    visiblePost,
    commentsData,
  };
};
