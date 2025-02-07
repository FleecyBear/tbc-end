import { createClient } from '@/app/utils/supabase/server';

interface BlogPageProps {
  params: Promise<{ id: string }>;
}

const BlogPage = async ({ params }: BlogPageProps) => {
  const supabase = createClient();
  
  const paramsResolved = await params;

  const { data: blog, error } = await (await supabase)
    .from('blogs')
    .select('*')
    .eq('id', paramsResolved.id)
    .single();

  if (error || !blog) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-warmCoral to-mutedGrayBlue dark:from-darkPurple dark:to-deepBlue">
        <div className="text-center text-white p-8 bg-black bg-opacity-70 rounded-xl shadow-xl">
          <h1 className="text-4xl font-bold text-red-500 dark:text-red-400 mb-4">This blog not found</h1>
          <p className="text-lg">The blog you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const { data: userData } = await (await supabase).auth.getUser();

  const isOwner = userData?.user?.id === blog.user_id;

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-warmCoral to-mutedGrayBlue dark:from-darkPurple dark:to-deepBlue">
      <div className="max-w-3xl w-full p-6 bg-white dark:bg-deepBlue rounded-xl shadow-lg text-black dark:text-white sm:max-w-md md:max-w-lg lg:max-w-3xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-darkPurple dark:text-warmCoral text-center mb-4">{blog.title}</h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-mutedGrayBlue dark:text-vibrantPink text-center mb-6">{blog.title_ka}</h2>
        <p className="text-lg sm:text-base md:text-lg leading-relaxed mb-4">{blog.description}</p>
        <p className="text-lg sm:text-base md:text-lg leading-relaxed mb-4">{blog.description_ka}</p>
        <p className="mt-4 text-center text-sm text-mutedGrayBlue dark:text-vibrantPink">Creator: {blog.creator}</p>
        <p className="text-center text-xs text-mutedGrayBlue dark:text-vibrantPink">{new Date(blog.created_at).toLocaleDateString()}</p>

        {isOwner && (
          <div className="mt-6 text-center">
            <a href={`/blogs/edit/${blog.id}`} className="bg-vibrantPink text-white py-2 px-4 rounded-lg hover:bg-darkPurple dark:bg-warmCoral dark:text-mutedGrayBlue dark:hover:bg-deepBlue">
              Edit Blog
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogPage;
