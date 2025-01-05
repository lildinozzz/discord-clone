import { RefObject, useEffect, useState } from "react";

type TChatScrollProps = {
  chatRef: RefObject<HTMLDivElement | null>;
  bottomRef: RefObject<HTMLDivElement | null>;
  shouldLoadMore: boolean;
  loadMore: () => void;
  count: number;
};

export const useChatScroll = ({
  chatRef,
  bottomRef,
  shouldLoadMore,
  loadMore,
  count,
}: TChatScrollProps) => {
  const [hasInitialized, setHasInitialized] = useState(false);

  useEffect(() => {
    const topDiv = chatRef?.current;

    const handleScroll = () => {
      const scrollTop = topDiv?.scrollTop;

      if (scrollTop === 0 && shouldLoadMore) {
        loadMore();
      }
    };

    topDiv?.addEventListener("scroll", handleScroll);

    return () => topDiv?.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatRef, shouldLoadMore]);

  useEffect(() => {
    const bottomDiv = bottomRef?.current;

    const topDiv = chatRef.current;
    const shouldAutoScroll = () => {
      if (!hasInitialized && bottomDiv) {
        setHasInitialized(true);
        return true;
      }

      if (!topDiv) {
        return false;
      }

      const distanceFromBottom =
        topDiv.scrollHeight - topDiv.scrollTop - topDiv.clientHeight;

      return distanceFromBottom <= 100;
    };

    const shouldScroll = shouldAutoScroll();

    if (shouldScroll) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [bottomRef, chatRef, count, hasInitialized]);
};
