import EditTopicForm from "@/components/EditTopicBtn";

const apiUrl = process.env.API_UR || "http://localhost:3000";

const getTopicById = async (id: string) => {
  try {
    const res = await fetch(`${apiUrl}/api/topics/${id}`, {
      cache: "no-store",
    });
    if (!res.ok) throw new Error("Failed to fetch topic.");
    return res.json();
  } catch (error) {
    console.error(error);
    return null;
  }
};

export default async function EditTopic({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const data = await getTopicById(id);

  if (!data || !data.topic) {
    return (
      <div className="text-center py-10 text-red-600">
        존재하지 않는 글입니다.
      </div>
    );
  }

  const { title, description } = data.topic;

  return <EditTopicForm id={id} title={title} description={description} />;
}
