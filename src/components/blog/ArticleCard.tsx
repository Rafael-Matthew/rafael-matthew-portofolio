import { motion } from 'motion/react';
import { Calendar, ChevronRight } from 'lucide-react';

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  cover_image_url: string | null;
  created_at: string;
};

interface ArticleCardProps {
  article: Article;
  index: number;
}

export default function ArticleCard({ article, index }: ArticleCardProps) {
  const date = new Date(article.created_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <motion.article 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all overflow-hidden flex flex-col group h-full"
      >
        <div className="relative h-48 w-full overflow-hidden bg-slate-50">
          {article.cover_image_url ? (
            <img 
              src={article.cover_image_url} 
              alt={article.title} 
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-slate-100">
              <span className="text-slate-400">No Image</span>
            </div>
          )}
        </div>

        <div className="p-6 flex flex-col flex-grow">
          <div className="flex items-center space-x-2 text-primary mb-3">
            <Calendar size={14} />
            <span className="text-xs font-medium">{date}</span>
          </div>

          <h3 className="text-xl font-bold mb-3 group-hover:text-primary transition-colors text-text-main line-clamp-2">
            {article.title}
          </h3>

          <p className="text-text-muted text-sm line-clamp-3 mb-6 flex-grow">
            {article.excerpt || "Click to read more about this topic..."}
          </p>

          <a 
            href={`/blog/${article.slug}`} 
            className="mt-auto flex items-center text-sm font-semibold text-primary group-hover:text-primary-dark transition-colors pt-4 border-t border-slate-100"
          >
            Read Article
            <ChevronRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </motion.article>
  );
}
