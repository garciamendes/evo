import type { Metadata } from "next";
import { Suspense } from "react";
import { LoginCard } from "@/components/login-card";
import { PageHeader } from "@/components/ui";

export const metadata: Metadata = { title: "Entrar" };

export default function EntrarPage() {
  return (
    <>
      <PageHeader
        title="Entrar"
        description="Com login, suas respostas e seu progresso ficam salvos e aparecem em qualquer aparelho."
      />
      <Suspense>
        <LoginCard />
      </Suspense>
    </>
  );
}
