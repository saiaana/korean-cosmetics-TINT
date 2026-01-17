import BlogCard from "../components/ui/cards/BlogCard";
import articlesData from "../data/articles.json";

function BlogList() {
  const articles = articlesData.articles;

  if (!articles || articles.length === 0) {
    return (
      <div className="flex items-center justify-center py-20">
        <p className="text-lg text-gray-500">No articles found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {articles.map((article) => (
          <BlogCard
            key={article.id}
            main_image_src={article.main_image_src}
            blogPostName={article.title}
            slug={article.slug}
          />
        ))}
      </div>
    </div>
  );
}

export default BlogList;
