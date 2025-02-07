import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';

const BlogsPage = async () => {
  const supabase = createClient();
  
  const { data: userData, error: userError } = await (await supabase).auth.getUser();

  if (userError || !userData?.user) {
    redirect('/login');
  }

  const res = await fetch(`http://localhost:3000//api/blogs`);
  const blogs = await res.json();

  return (
    <div className="container mx-auto p-6 text-black dark:text-white">
      <h1 className="text-4xl font-bold mb-6 text-center text-black dark:text-white">All Blogs</h1>

      {blogs && blogs.length > 0 ? (
        <div className="space-y-6">
          {blogs.map((blog: any) => (
            <div key={blog.created_at} className="p-4 bg-warmCoral dark:bg-deepBlue rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-darkPurple dark:text-mutedGrayBlue">{blog.title}</h2>
              <h3 className="text-xl text-mutedGrayBlue dark:text-vibrantPink">{blog.title_ka}</h3>
              <p className="mt-4 text-darkPurple dark:text-mutedGrayBlue">{blog.description}</p>
              <p className="mt-2 text-darkPurple dark:text-mutedGrayBlue">{blog.description_ka}</p>
              <p className="mt-2 text-mutedGrayBlue dark:text-vibrantPink">Creator: {blog.creator}</p>
              <p className="mt-2 text-sm text-mutedGrayBlue dark:text-vibrantPink">{new Date(blog.created_at).toLocaleDateString()}</p>

              {userData.user.id === blog.user_id && (
                <button
                  className="mt-4 bg-vibrantPink text-white p-2 rounded-lg hover:bg-darkPurple dark:bg-warmCoral dark:text-mutedGrayBlue dark:hover:bg-deepBlue"
                  
                >
                  Edit
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-vibrantPink dark:text-mutedGrayBlue">No blogs available</p>
      )}
    </div>
  );
};

export default BlogsPage;
