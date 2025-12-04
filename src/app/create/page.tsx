"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Createpage() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title || !description)
      return alert("Title and description are required.");

    const res = await fetch("/api/topics", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description }), // 🔥 name 제거
    });

    if (res.ok) {
      router.push("/board");
      router.refresh();
    } else {
      console.log("fail");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-6 p-6 border rounded-xl bg-white shadow-md max-w-2xl mx-auto"
    >
      <label className="font-semibold text-gray-700">제목</label>
      <input
        type="text"
        className="border px-4 py-3 rounded-md"
        onChange={(e) => setTitle(e.target.value)}
        value={title}
      />

      <label className="font-semibold text-gray-700">내용</label>
      <textarea
        className="border px-4 py-3 rounded-md min-h-40 resize-none"
        onChange={(e) => setDescription(e.target.value)}
        value={description}
      />

      <button className="bg-red-900 text-white px-6 py-3 rounded-lg shadow w-fit">
        업로드하기
      </button>
    </form>
  );
}
