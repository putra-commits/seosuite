import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, Tag } from 'lucide-react';
import Footer from '../components/footer';

async function getPosts() {
  const files = fs.readdirSync(path.join(process.cwd(), 'src/content/blog'));
  
  const posts = files.map((filename) => {
    const slug = filename.replace('.md', '');
    const markdownWithMeta = fs.readFileSync(path.join(process.cwd(), 'src/content/blog', filename), 'utf-8');
    const { data: frontmatter } = matter(markdownWithMeta);
    
    return {
      slug,
      ...frontmatter,
    };
  });
  
  // Sort by date descending
  return posts.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export default async function BlogIndex() {
  const posts = await getPosts();

  return (
    <div className="min-h-screen bg-[#090b10] text-white">
      {/* Navigation (Simplified for Blog) */}
      <nav className="border-b border-white/5 bg-[#090b10]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center shadow-lg shadow-yellow-500/20 group-hover:scale-105 transition-transform">
              <BookOpen size={16} className="text-black fill-black" />
            </div>
            <p className="text-xl font-bold text-white tracking-tight">
              Sovereign<span className="text-zinc-500 font-medium">Intel</span>
            </p>
          </Link>
          <Link href="/" className="text-xs font-semibold text-zinc-400 hover:text-white transition-colors">
            Kembali ke SEOsuite
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="py-24 text-center border-b border-white/5 bg-[#050505] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-30">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-yellow-600/10 rounded-full blur-[120px]" />
        </div>
        <div className="max-w-3xl mx-auto px-8 relative z-10">
          <h1 className="text-5xl font-black tracking-tight mb-6">Membongkar Rahasia <span className="text-yellow-500">Dominasi Pasar.</span></h1>
          <p className="text-zinc-400 text-lg leading-relaxed font-medium">
            Wawasan eksklusif, strategi Enterprise SEO, dan rahasia arsitektur konversi yang digunakan oleh dominator industri untuk meraup miliaran rupiah.
          </p>
        </div>
      </header>

      {/* Blog Grid */}
      <main className="max-w-7xl mx-auto px-8 py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post: any) => (
            <Link href={\`/blog/\${post.slug}\`} key={post.slug} className="group flex flex-col h-full bg-[#131316] rounded-3xl border border-zinc-800 hover:border-yellow-500/50 transition-all duration-300 overflow-hidden shadow-xl">
              <div className="p-8 flex flex-col flex-1">
                <div className="flex items-center gap-3 mb-6">
                  <span className="px-3 py-1 bg-zinc-900 border border-zinc-800 text-[10px] font-black text-yellow-500 uppercase tracking-widest rounded-full">
                    {post.category || 'Intelijen'}
                  </span>
                  <span className="flex items-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                    <Clock className="w-3 h-3" /> {new Date(post.date).toLocaleDateString('id-ID')}
                  </span>
                </div>
                
                <h2 className="text-xl font-bold text-white mb-4 leading-snug group-hover:text-yellow-500 transition-colors">
                  {post.title}
                </h2>
                
                <p className="text-sm text-zinc-400 leading-relaxed font-medium mb-8 flex-1">
                  {post.description}
                </p>
                
                <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 group-hover:text-white transition-colors mt-auto pt-6 border-t border-zinc-800/50">
                  Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
