"use client";
import { Button, Card, Input, Textarea } from "@nextui-org/react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

export default function CreateQuote() {
  const [text, setText] = useState("");
  const [image, setImage] = useState("");
  const fileInputRef = useRef();
  const router = useRouter();

  const handleUploadImage = useCallback(async () => {
    try {
      const form = new FormData();
      form.append("file", image);

      const { data } = await axios.post(
        "https://crafto.app/crafto/v1.0/media/assignment/upload",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: localStorage.getItem("session-token"),
          },
        }
      );
      if (data?.[0]?.url) {
        handleSubmit(data?.[0]?.url);
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
  }, [image]);

  const handleSubmit = useCallback(
    async (mediaUrl) => {
      try {
        const { data } = await axios.post(
          "https://assignment.stage.crafto.app/postQuote",
          {
            text: text?.trim(),
            mediaUrl: mediaUrl,
          },
          {
            headers: {
              Authorization: localStorage.getItem("session-token"),
            },
          }
        );
        if (data?.data?.createdAt) {
          toast.success("Added quote successfully!");
          fileInputRef.current.value = "";
          fileInputRef.current.type = "text";
          fileInputRef.current.type = "file";
          setImage("");
          setText("");
        } else {
          toast.error("Something went wrong!");
        }
      } catch (error) {
        toast.error("Something went wrong!");
      }
    },
    [text]
  );

  useEffect(() => {
    const token = localStorage.getItem("session-token");
    if (!token) {
      router.push("/login");
    }
  }, []);

  return (
    <section className="add-quote-container px-2">
      <Card className="py-6 px-4 flex flex-col gap-6 w-full">
        <h1 className="text-center font-bold">Add a new quote</h1>
        <Input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          multiple={false}
          onChange={(e) => setImage(e?.target?.files?.[0])}
          label="Choose Image"
          variant="bordered"
          className="rounded-lg"
        />
        <div>
          <p className="mb-0 text-sm">Quote</p>
          <Textarea
            value={text}
            defaultValue={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type here..."
            variant="bordered"
            className="rounded-lg"
          />
        </div>
        <Button
          onClick={() => {
            if (text?.trim()?.length) {
              handleUploadImage();
            } else {
              toast.error("Enter a valid quote.");
            }
          }}
          color="primary"
        >
          Add Quote
        </Button>
      </Card>
    </section>
  );
}
