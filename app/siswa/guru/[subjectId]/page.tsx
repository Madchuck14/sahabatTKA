export default async function GuruListPage({
  params,
}: {
  params: Promise<{ subjectId: string }>;
}) {
  const { subjectId } = await params;

  return (
    <main className="flex-1 p-6">
      <h1 className="text-xl font-semibold">Daftar Guru — {subjectId}</h1>
    </main>
  );
}
