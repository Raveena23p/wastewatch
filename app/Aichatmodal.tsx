"use client";
import { useState, useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { MessageSquare, Send } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Content } from "@google/generative-ai";
import useSWR, { mutate } from "swr";
import { GraphEntry } from "./BinDetails";

export default function Aichatmodal({ binData }: { binData: GraphEntry[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Content[]>([]);
  const [query, setQuery] = useState("");
  const [input, setInput] = useState("");
  const chatRef = useRef<HTMLDivElement>(null);
  const fetcher = (apiData: any) => {
    const [url, data] = apiData;
    console.log("Fetching chat response...", url, data);

    return fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ...data, history: messages }),
    }).then((res) => res.json());
  };

  const { data, error, isLoading } = useSWR(
    isOpen && query ? ["/api/chat", { message: query, data: binData }] : null,
    fetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  useEffect(() => {
    if (data) {
      setMessages((prev) => [
        ...prev,
        { role: "model", parts: [{ text: data?.data?.reply }] },
      ]);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      console.error("Error fetching chat response:", error);
    }
  }, [error]);

  const handleSend = () => {
    if (!input.trim()) return;
    setQuery(input);
    setMessages((prev) => [
      ...prev,
      { role: "user", parts: [{ text: input }] },
    ]);
    setInput("");
  };

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <MessageSquare className="w-6 h-6 shrink-0" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>AI Chat</DialogTitle>
          <DialogDescription>
            Chat with our AI Assistant to get more insights about this
            bin&apos;s data
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div ref={chatRef} className="p-3 h-64 overflow-auto">
            {messages.length === 0 ? (
              <p className="text-gray-500 text-sm text-center">
                Start a conversation...
              </p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`p-2 ${
                      msg.role === "user"
                        ? "bg-blue-500 text-white"
                        : "bg-gray-200 text-black"
                    } rounded-lg mb-2 text-sm`}
                  >
                    {msg.parts.map((part, i) => (
                      <ReactMarkdown key={i}>{part.text}</ReactMarkdown>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
          {isLoading && (
            <div className="flex justify-center items-center space-x-2 mt-2">
              <span className="w-3 h-3 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-3 h-3 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-3 h-3 bg-gray-400 rounded-full animate-bounce"></span>
            </div>
          )}
        </div>
        <DialogFooter>
          <div className="flex border-t bg-gray-100 w-full">
            <Input
              type="text"
              className="flex-grow p-2 border rounded-lg focus:outline-none"
              autoFocus
              placeholder="Type a message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                e.stopPropagation();
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
            <Button
              type="button"
              className="ml-2 bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition"
              onClick={handleSend}
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
