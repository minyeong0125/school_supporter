import { auth } from "@/auth";
export default async function DashboardPage() {
  const session = await auth();
  if (!session) return <div className="text-2xl">Not authenticated...</div>;
  return (
    <div>
      <h1 className="text-3xl font-bold">Dashboard 대시보드</h1>
      <pre className="mt-4">{JSON.stringify(session, null, 2)}</pre>
    </div>
  );
}
