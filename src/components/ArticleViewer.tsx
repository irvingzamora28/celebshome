"use client";

import Markdown from "markdown-to-jsx";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface Article {
  id: number;
  title: string;
  content: string;
  created_at: string;
}

export default function ArticleViewer({ title }: { title: string }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const decodedTitle = decodeURIComponent(title);
        const { data, error } = await supabase
          .from("articles")
          .select("id, title, content, created_at")
          .eq("title", decodedTitle)
          .single();

        if (error) throw error;
        setArticle(data);
      } catch (error) {
        console.error("Error fetching article:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [title]);

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto my-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md animate-pulse font-serif">
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"/>
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-8"/>
        <div className="space-y-4">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"/>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"/>
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-4/6"/>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="w-full max-w-4xl mx-auto my-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md font-serif">
        <div className="text-center text-gray-500 dark:text-gray-400">Article not found</div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-lg shadow-md">
      <article className="prose prose-lg max-w-none dark:prose-invert font-serif">
        <h1 className="text-4xl font-bold tracking-tight mb-2 md:mb-10 text-gray-900 dark:text-white font-serif">{article.title}</h1>
        <time className="text-sm text-gray-500 dark:text-gray-400 mb-8 block font-sans">
          {new Date(article.created_at).toLocaleDateString(undefined, {
            year: "numeric",
            month: "long",
            day: "numeric"
          })}
        </time>
        <Markdown
          options={{
            overrides: {
              table: {
                props: {
                  className: "min-w-full border-collapse border border-gray-200 dark:border-gray-700 font-sans",
                },
              },
              thead: {
                props: {
                  className: "bg-gray-50 dark:bg-gray-700",
                },
              },
              th: {
                props: {
                  className: "px-4 py-3 text-left text-xs font-semibold text-gray-600 dark:text-gray-200 uppercase tracking-wider border border-gray-200 dark:border-gray-700 font-sans",
                },
              },
              td: {
                props: {
                  className: "px-4 py-3 text-sm border border-gray-200 dark:border-gray-700 dark:text-gray-300 font-sans",
                },
              },
              h1: {
                props: {
                  className: "hidden text-3xl font-bold mt-8 mb-4 text-gray-900 dark:text-white font-serif",
                },
              },
              h2: {
                props: {
                  className: "text-2xl font-semibold mt-6 mb-3 text-gray-900 dark:text-white font-serif",
                },
              },
              p: {
                props: {
                  className: "mb-4 leading-relaxed text-gray-800 dark:text-gray-200 font-serif text-lg",
                },
              },
              ul: {
                props: {
                  className: "list-disc pl-6 mb-4 text-gray-800 dark:text-gray-200 font-serif",
                },
              },
              ol: {
                props: {
                  className: "list-decimal pl-6 mb-4 text-gray-800 dark:text-gray-200 font-serif",
                },
              },
              blockquote: {
                props: {
                  className: "border-l-4 border-gray-200 dark:border-gray-700 pl-4 italic my-4 text-gray-800 dark:text-gray-200 font-serif",
                },
              },
            },
          }}
        >
          {article.content}
        </Markdown>
      </article>
    </div>
  );
}