import { Dashboard } from "@/components/dashboard";
import { PageHeader } from "@/components/ui";

export default function Home() {
  return (
    <>
      <PageHeader title="Hoje" description="Uma tarefa por vez. Consistência vale mais que intensidade." />
      <Dashboard />
    </>
  );
}
