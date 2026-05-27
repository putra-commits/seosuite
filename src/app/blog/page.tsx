import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';

export const metadata = {
  title: 'Sovereign Intel Engine | SEOsuite',
  description: 'Artikel dan laporan analitik dari tim arsitek pencarian SEOsuite.',
};

export default function BlogIndex() {
  const blogDir = path.join(process.cwd(), 'src/content/blog');
  let posts: any[] = [];
  
  if (fs.existsSync(blogDir)) {
    const files = fs.readdirSync(blogDir);
    posts = files.filter(f => f.endsWith('.md')).map(filename => {
      const filePath = path.join(blogDir, filename);
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const { data } = matter(fileContent);
      return {
        slug: filename.replace('.md', ''),
        title: data.title,
        date: data.date,
        excerpt: data.excerpt,
      };
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  return (
    <div className="min-h-screen bg-[#040609] text-white pt-32 pb-24">
      <div className="max-w-4xl mx-auto px-8 relative z-10">
        <h1 className="text-4xl md:text-5xl font-black italic tracking-tighter mb-4 text-amber-500">
          Sovereign Intel Engine
        </h1>
        <p className="text-zinc-400 font-bold mb-16">
          Kajian analitik dan arsitektur kedaulatan digital (AEO/GEO).
        </p>

        <div className="space-y-6">
          {posts.map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <div className="p-8 rounded-3xl bg-white/[0.02] backdrop-blur-xl border border-zinc-800 hover:border-amber-500/50 transition-all shadow-[0_0_30px_rgba(245,158,11,0.0)] hover:shadow-[0_0_30px_rgba(245,158,11,0.05)]">
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">{post.date}</span>
                <h2 className="text-2xl font-black mt-2 mb-4 group-hover:text-amber-400 transition-colors">{post.title}</h2>
                <p className="text-sm text-zinc-400 font-medium leading-relaxed">{post.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
