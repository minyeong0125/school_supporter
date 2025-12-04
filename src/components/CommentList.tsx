"use client";

import React from "react";

interface Comment {
  _id: string;
  comment: string;
  displayName: string;
  createdAt: string;
}

interface CommentListProps {
  comments?: Comment[]; // optional 처리
}

export default function CommentList({ comments = [] }: CommentListProps) {
  return (
    <section className="mt-10">
      <h2 className="text-lg font-semibold mb-3 text-slate-800">댓글</h2>

      <div className="flex flex-col gap-4">
        {comments.length > 0 ? (
          comments.map((c) => (
            <div
              key={c._id}
              className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm"
            >
              <div className="flex items-center gap-2 text-sm text-slate-500 mb-2">
                <span className="font-medium text-slate-700">
                  {c.displayName}
                </span>
                <span>·</span>
                <time>{new Date(c.createdAt).toLocaleString()}</time>
              </div>
              <p className="text-slate-800 whitespace-pre-wrap">{c.comment}</p>
            </div>
          ))
        ) : (
          <p className="text-slate-500 text-sm">등록된 댓글이 없습니다.</p>
        )}
      </div>
    </section>
  );
}
