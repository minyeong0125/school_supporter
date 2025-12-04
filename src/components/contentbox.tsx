"use client";

import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import React from "react";

export default function ContentBox() {
  const { data: session } = useSession();
  const { id } = useParams(); // 게시물 ID 가져오기

  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold mb-3 text-slate-800">댓글 작성</h2>

      <form
        className="flex flex-col gap-3 bg-white border border-slate-200 rounded-lg p-4 shadow-sm"
        onSubmit={async (e) => {
          e.preventDefault();
          const comment = (
            e.currentTarget.comment as HTMLTextAreaElement
          ).value.trim();

          if (!comment) return alert("댓글을 입력하세요!");
          if (!session) return alert("로그인 후 이용 가능합니다.");

          try {
            const res = await fetch("/comments", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                postId: id, // 🔥 게시물 ID
                comment, // 🔥 댓글 내용
                authorId: session.user?.email, // 로그인 사용자(작성자)
                displayName: session.user?.name,
              }),
            });

            if (!res.ok) throw new Error("댓글 저장 실패");

            (e.currentTarget.comment as HTMLTextAreaElement).value = "";
            alert("댓글 작성 완료!");
            location.reload();
          } catch (err) {
            console.error(err);
            alert("댓글 등록 중 오류 발생");
          }
        }}
      >
        <textarea
          name="comment"
          placeholder="댓글을 입력하세요"
          className="w-full border p-3 rounded-md"
          rows={3}
        />
        <button
          type="submit"
          className="bg-slate-800 text-white px-4 py-2 rounded-md font-medium w-fit"
        >
          댓글 작성
        </button>
      </form>
    </section>
  );
}
