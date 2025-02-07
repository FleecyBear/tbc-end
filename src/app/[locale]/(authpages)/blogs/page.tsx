import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const BlogsPage = async () => {
  const supabase = createClient();
  const { data: userData, error: userError } = await (await supabase).auth.getUser();

  if (userError || !userData?.user) {
    redirect('/login');
  }

  const res = await fetch(`http://localhost:3000/api/blogs`);
  const blogs = await res.json();

  return (
    <div className="container mx-auto p-6 text-black dark:text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-darkPurple dark:text-warmCoral">All Blogs</h1>
        <Link href="/createblog">
          <button className="bg-vibrantPink text-white px-6 py-3 rounded-lg shadow-md hover:bg-warmCoral transition">
            + Create Blog
          </button>
        </Link>
      </div>

      {blogs && blogs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map((blog: any) => (
            <Link key={blog.id} href={`/blogs/${blog.id}`} className="block">
              <div className="p-6 bg-white dark:bg-darkPurple rounded-2xl shadow-lg transition hover:scale-[1.02] cursor-pointer">
                <h2 className="text-2xl font-bold text-deepBlue dark:text-warmCoral">{blog.title}</h2>
                <h3 className="text-lg text-deepBlue dark:text-warmCoral">{blog.title_ka}</h3>
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">By {blog.creator}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(blog.created_at).toLocaleDateString()}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-gray-600 dark:text-mutedGrayBlue">No blogs available.</p>
      )}
    </div>
  );
};

export default BlogsPage;
