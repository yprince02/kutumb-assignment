"use client";
import {
  Button,
  Card,
  CardFooter,
  CardHeader,
  Spinner,
} from "@nextui-org/react";
import axios from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import moment from "moment";

export default function Home() {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(0);
  const [quotes, setQuotes] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  const fetchQuotes = useCallback(
    async (page) => {
      try {
        const { data } = await axios.get(
          `https://assignment.stage.crafto.app/getQuotes?limit=12&offset=${page}`,
          {
            headers: {
              Authorization: localStorage.getItem("session-token"),
            },
          }
        );
        console.log(data);
        setCurrentPage(page);
        if (data?.data?.length) {
          setQuotes((prev) => [...prev, ...data.data]);
        } else {
          setHasMore(false);
        }
      } catch (error) {
        if (error.status === 401) {
          router.push("/login");
        }
      }
    },
    [router]
  );

  useEffect(() => {
    const token = localStorage.getItem("session-token");
    if (!token) {
      router.push("/login");
    } else {
      fetchQuotes(0);
    }
  }, []);

  return (
    <div className="post-container container mx-auto px-4">
      <InfiniteScroll
        dataLength={quotes.length} //This is important field to render the next data
        next={() => {
          fetchQuotes(currentPage + 1);
        }}
        hasMore={hasMore}
        loader={
          <div
            style={{ height: "100dvh" }}
            className="w-full p-4 flex align-items-center justify-center"
          >
            <Spinner />
          </div>
        }
        endMessage={
          <p style={{ textAlign: "center" }}>
            <b>Yay! You have seen it all</b>
          </p>
        }
        pullDownToRefreshContent={
          <h3 style={{ textAlign: "center" }}>&#8595; Pull down to refresh</h3>
        }
        releaseToRefreshContent={
          <h3 style={{ textAlign: "center" }}>&#8593; Release to refresh</h3>
        }
      >
        <div className="quotes-container mt-3">
          {quotes.map((quote) => (
            <Card key={quote.id} isFooterBlurred className="quote-card">
              <CardHeader className="absolute z-10 top-1 flex-col items-start">
                <p title={quote.text} className="quote-text text text-white">
                  {quote?.text}
                </p>
              </CardHeader>
              <div
                className="quote-img"
                style={{
                  backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.4)),url('${quote?.mediaUrl}')`,
                }}
              ></div>

              <CardFooter>
                <div className="flex flex-grow gap-2 items-center">
                  <div className="flex flex-col">
                    <p className="text-bold">By {quote?.username}</p>
                    <p className="text-tiny">
                      {moment(quote?.updatedAt).format("hh:mm A DD MMM")}
                    </p>
                  </div>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </InfiniteScroll>
      <div className="create-quote-button">
        <Button
          onClick={() => router.push("/create-quote")}
          className="shadow-3 bg-black text-white"
        >
          + Create Quote
        </Button>
      </div>
    </div>
  );
}
