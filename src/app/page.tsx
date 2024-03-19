import { FortuneWheel } from "@/components/fortune-wheel/fortune-wheel";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between">
      <FortuneWheel />
    </main>
  );
}
