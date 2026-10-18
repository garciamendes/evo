import type { Metadata } from "next";
import { ProgressView } from "@/components/progress-view";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Progresso" };

export default function ProgressoPage() {
  return (
    <>
      <PageHeader title="Progresso" description="O que você já concluiu e os próximos marcos." />
      <ProgressView />
    </>
  );
}
