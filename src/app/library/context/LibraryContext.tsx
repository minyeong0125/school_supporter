'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

export type Book = {
  title: string;
  author: string;
  isbn: string;
  cover: string;
  link: string;
};

type LibraryContextType = {
  borrowList: Book[];
  reserveList: Book[];
  borrowBook: (book: Book) => void;
  returnBook: (isbn: string) => void;
  reserveBook: (book: Book) => void;
  cancelReserve: (isbn: string) => void;
};

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export function LibraryProvider({ children }: { children: ReactNode }) {
  const [borrowList, setBorrowList] = useState<Book[]>([]);
  const [reserveList, setReserveList] = useState<Book[]>([]);

  const borrowBook = (book: Book) => {
    setBorrowList((prev) => [...prev, book]);
  };

  const returnBook = (isbn: string) => {
    setBorrowList((prev) => prev.filter((b) => b.isbn !== isbn));
  };

  const reserveBook = (book: Book) => {
    setReserveList((prev) => [...prev, book]);
  };

  const cancelReserve = (isbn: string) => {
    setReserveList((prev) => prev.filter((b) => b.isbn !== isbn));
  };

  return (
    <LibraryContext.Provider
      value={{
        borrowList,
        reserveList,
        borrowBook,
        returnBook,
        reserveBook,
        cancelReserve,
      }}
    >
      {children}
    </LibraryContext.Provider>
  );
}

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context)
    throw new Error('useLibrary must be used within LibraryProvider');
  return context;
};
