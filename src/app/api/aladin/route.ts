import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');
    const page = searchParams.get('page') || '1';

    const API_KEY = process.env.ALADIN_TTB_KEY;

    if (!query) {
      return NextResponse.json([]);
    }

    const url = `https://www.aladin.co.kr/ttb/api/ItemSearch.aspx?ttbkey=${API_KEY}&Query=${encodeURIComponent(
      query
    )}&QueryType=Title&MaxResults=9&start=${page}&SearchTarget=Book&output=js&Version=20131101`;

    const res = await fetch(url);

    if (!res.ok) {
      throw new Error('알라딘 API 응답 실패');
    }

    const data = await res.json();

    return NextResponse.json(
      data?.item?.map((book: any) => ({
        title: book.title,
        author: book.author,
        cover: book.cover,
        isbn: book.isbn,
        link: book.link, // ✅ 알라딘 상세 링크 추가
      })) || []
    );
  } catch (error) {
    console.error('알라딘 API 에러:', error);
    return NextResponse.json({ error: 'API 오류' }, { status: 500 });
  }
}
