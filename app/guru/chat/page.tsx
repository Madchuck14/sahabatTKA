import { BottomNav } from "@/components/BottomNav";

export default function GuruChatListPage() {
  return (
    <div className="flex min-h-dvh flex-col">
      <main className="flex-1 p-6">
        <h1 className="text-xl font-semibold">Chat Masuk</h1>
      </main>
      <BottomNav role="guru" />
    </div>
  );
}
