import { BottomNav } from "@/components/BottomNav";

export default function GuruLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <div className="flex-1">{children}</div>
      <BottomNav role="guru" />
    </div>
  );
}
