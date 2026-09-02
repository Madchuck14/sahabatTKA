export default async function SiswaChatRoomPage({
  params,
}: {
  params: Promise<{ roomId: string }>;
}) {
  const { roomId } = await params;

  return (
    <main className="flex-1 p-6">
      <h1 className="text-xl font-semibold">Room Chat — {roomId}</h1>
    </main>
  );
}
