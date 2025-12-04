import Topiclist from "@/components/Topiclist";
import React from "react";

export default function Boardpage() {
  return (
    <div>
      <div className="max-w-3xl mx-auto px-2 py-4 border-b bg-transparent">
        <div className="grid grid-cols-4 items-center text-sm">
          <p className="flex justify-center items-center text-gray-500 w-8">
            번호
          </p>
          <p className="font-semibold text-gray-900 truncate">제목</p>
          <p className="flex justify-center items-center text-gray-600">날짜</p>
          <p className="flex justify-center items-center text-gray-600">
            조회수
          </p>
        </div>
      </div>

      <Topiclist />

      {/* 글 쓰기 버튼 가운데 정렬 */}
      <div className="flex justify-center mt-6">
        <a
          href="/create"
          className="px-5 py-3 rounded-md border border-black text-sm"
        >
          글 쓰기
        </a>
      </div>
    </div>
  );
}
