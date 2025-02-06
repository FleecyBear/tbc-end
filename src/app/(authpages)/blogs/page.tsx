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
            <div key={blog.created_at} className="p-4 bg-[#E98074] dark:bg-[#44318D] rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold text-[#2A1B3C] dark:text-[#A4B3B6]">{blog.title}</h2>
              <h3 className="text-xl text-[#A4B3B6] dark:text-[#D83F87]">{blog.title_ka}</h3>
              <p className="mt-4 text-[#2A1B3C] dark:text-[#A4B3B6]">{blog.description}</p>
              <p className="mt-2 text-[#2A1B3C] dark:text-[#A4B3B6]">{blog.description_ka}</p>
              <p className="mt-2 text-[#A4B3B6] dark:text-[#D83F87]">Creator: {blog.creator}</p>
              <p className="mt-2 text-sm text-[#A4B3B6] dark:text-[#D83F87]">{new Date(blog.created_at).toLocaleDateString()}</p>

              {userData.user.id === blog.user_id && (
                <button
                  className="mt-4 bg-[#D83F87] text-white p-2 rounded-lg hover:bg-[#2A1B3C] dark:bg-[#E98074] dark:text-[#A4B3B6] dark:hover:bg-[#44318D]"
                  
                >
                  Edit
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-[#D83F87] dark:text-[#A4B3B6]">No blogs available</p>
      )}
    </div>
  );
};

export default BlogsPage;
