// src/app/article/[title]/page.tsx
import ArticleViewer from '@/components/ArticleViewer';
import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase';


async function getArticleByTitle(title: string) {
  const decodedTitle = decodeURIComponent(title); // Decode the title
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('title', decodedTitle) // Use decoded title
    .single();

  if (error || !data) {
    notFound();
  }

  return data;
}

export default async function ArticlePage({
  params,
}: {
  params: { title: string };
}) {
  const article = await getArticleByTitle(params.title);

  return (
    <div className="dark:bg-slate-900 dark:text-slate-400 py-6">
      <ArticleViewer title={article.title} />
    </div>
  );
}