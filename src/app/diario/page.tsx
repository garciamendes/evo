import type { Metadata } from "next";
import { Journal } from "@/components/journal";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Diário" };

export default function DiarioPage() {
  return (
    <>
      <PageHeader
        title="Diário de aprendizado"
        description="Anote o que aprendeu, onde travou e o que quer perguntar na próxima sessão."
      />
      <Journal />
    </>
  );
}
