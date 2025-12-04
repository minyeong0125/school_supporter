"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EditTopicFormProps {
  id: string;
  title: string;
  description: string;
}
export default function EditTopicForm({
  id,
  title,
  description,
}: EditTopicFormProps) {
  const [newTitle, setNewTitle] = useState(title);
  const [newDescription, setNewDescription] = useState(description);
  const router = useRouter();
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/topics/${id}`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ newTitle, newDescription }),
      });
      if (!res.ok) {
        throw new Error("Failed to update topic");
      }
      alert("수정이 완료되었습니다");
      router.push(`/read/${id}`);
      router.refresh();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <form
      className="flex flex-col gap-6 p-6 border border-gray-300 rounded-xl bg-white shadow-md max-w-2xl mx-auto"
      onSubmit={handleSubmit}
    >
      {/* 제목 입력 */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-gray-700">제목</label>
        <input
          name="title"
          type="text"
          placeholder="제목을 입력하세요"
          className="border border-gray-400 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-red-800 w-full"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            setNewTitle(e.target.value)
          }
          value={newTitle}
        />
      </div>

      {/* 내용 입력 */}
      <div className="flex flex-col gap-2">
        <label className="font-semibold text-gray-700">내용</label>
        <textarea
          name="description"
          placeholder="내용을 입력하세요"
          className="border border-gray-400 px-4 py-3 rounded-md min-h-40 resize-none focus:outline-none focus:ring-2 focus:ring-red-800 w-full"
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
            setNewDescription(e.target.value)
          }
          value={newDescription}
        />
      </div>

      {/* 버튼 */}
      <button
        type="submit"
        className="bg-red-900 text-white font-semibold px-6 py-3 rounded-lg shadow hover:bg-red-800 transition w-fit"
      >
        수정하기
      </button>
    </form>
  );
}
