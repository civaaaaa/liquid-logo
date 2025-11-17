import { Suspense } from 'react';
import { Hero } from '@/hero/hero';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function Page({ params }: PageProps) {
  const { id } = await params;

  return (
    <main className="min-h-dvh flex items-center justify-center bg-black">
      <div className="w-[320px] h-[320px]">
        <Suspense>
          <Hero imageId={id} />
        </Suspense>
      </div>
    </main>
  );
}
