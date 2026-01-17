import { Link } from "react-router-dom";
import ROUTES from "../../../constants/routes";
import ImageWithLoader from "../ImageWithLoader";

function BlogCard({ main_image_src, blogPostName, slug }) {
  if (!slug) return null;

  return (
    <Link to={ROUTES.blogPost(slug)} className="group cursor-pointer">
      <div className="relative aspect-square overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
        <div className="h-full w-full overflow-hidden">
          <ImageWithLoader
            src={main_image_src}
            alt={blogPostName}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        </div>
        <div className="absolute bottom-0 w-full bg-white/80 px-4 py-4 backdrop-blur-md">
          <p className="line-clamp-2 text-center text-sm font-medium text-gray-800">
            {blogPostName}
          </p>
        </div>
      </div>
    </Link>
  );
}

export default BlogCard;
