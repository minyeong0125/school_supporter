"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

interface Topic {
  index: number;
  _id: string;
  title: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  views: number;
}

export default function Topiclist() {
  const [topics, setTopics] = useState<Topic[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTopics() {
      try {
        const res = await fetch("/api/topics");
        if (!res.ok) throw new Error("Failed to fetch topics");

        const data = await res.json();
        setTopics(data.topics);
      } catch (error) {
        console.error("Error loading topics:", error);
        setError("Failed to load topics");
      } finally {
        setLoading(false);
      }
    }
    fetchTopics();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      {topics.map((topic) => (
        <div
          key={topic._id}
          className="max-w-3xl mx-auto px-2 py-4 border-b hover:bg-gray-50 transition cursor-pointer"
        >
          <div className="grid grid-cols-4 items-center text-sm">
            <p className="text-left text-gray-500 ">{topic.index}</p>

            <Link href={`/read/${topic._id}`}>
              <p className="font-semibold text-gray-900 truncate hover:underline">
                {topic.title}
              </p>
            </Link>

            <p className="text-center text-gray-600">
              {new Date(topic.createdAt).toLocaleString()}
            </p>

            <p className="text-center text-gray-600">{topic.views}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
