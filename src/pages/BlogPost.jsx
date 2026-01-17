import ImagesViewer from "../components/pages/product/ImagesViewer";
import { useParams } from "react-router-dom";
import articlesData from "../data/articles.json";
import NotFound from "./NotFound";

function BlogPost() {
  const { blogPostName } = useParams();
  const article = articlesData.articles.find(
    (article) => article.slug === blogPostName,
  );

  if (!article) {
    return <NotFound />;
  }

  const images = article.images;
  const title = article.title;
  const subtitle = article.subtitle;
  const content = article.content;

  return (
    <article className="mx-auto max-w-6xl px-4 py-2">
      <header className="mb-14 text-center">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-pink-600">
          {title}
        </p>
        <h1 className="mx-auto max-w-3xl text-4xl font-extrabold leading-tight text-stone-900 sm:text-5xl">
          {subtitle}
        </h1>
      </header>

      <div className="grid gap-12 md:grid-cols-[420px_1fr]">
        <div className="self-start">
          <ImagesViewer images={images} />
        </div>
        <div className="prose prose-lg prose-stone flex max-w-none flex-col gap-5">
          {content.split("\n\n").map((paragraph, index) => (
            <p key={index} className="text-stone-700">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </article>
  );
}

export default BlogPost;
