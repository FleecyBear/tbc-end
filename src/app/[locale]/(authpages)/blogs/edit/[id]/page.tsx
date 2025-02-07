'use client'

import { useEffect, useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { useRouter, useParams } from 'next/navigation';

const EditBlogPage = () => {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const [paramsObj, setParamsObj] = useState<any>(null);
  const [blog, setBlog] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchParams = async () => {
      const paramsResolved = await params;
      setParamsObj(paramsResolved);
    };

    fetchParams();
  }, [params]);

  useEffect(() => {
    if (paramsObj) {
      const fetchData = async () => {
        const { data: blog, error: blogError } = await supabase
          .from('blogs')
          .select('*')
          .eq('id', paramsObj.id)
          .single();

        if (blogError || !blog) {
          router.push('/blogs');
        } else {
          setBlog(blog);
        }

        const { data: userData, error: userError } = await supabase.auth.getUser();

        if (userError || !userData?.user) {
          router.push('/login');
        } else {
          setUserData(userData.user);
        }
      };

      fetchData();
    }
  }, [paramsObj, router, supabase]);

  if (!paramsObj || !blog || !userData) {
    return <div>Loading...</div>;
  }

  if (blog.user_id !== userData.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-warmCoral to-mutedGrayBlue dark:from-darkPurple dark:to-deepBlue">
        <div className="max-w-xl w-full p-6 bg-white dark:bg-deepBlue rounded-xl shadow-lg text-black dark:text-white text-center">
          <h1 className="text-3xl font-bold text-darkPurple dark:text-warmCoral">Sorry, you are not allowed to edit this blog.</h1>
        </div>
      </div>
    );
  }

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const updateData = {
      title: formData.get('title'),
      title_ka: formData.get('title_ka'),
      description: formData.get('description'),
      description_ka: formData.get('description_ka'),
    };

    const response = await fetch(`/api/blogs/edit/${paramsObj.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });

    if (response.ok) {
      router.push(`/blogs/${paramsObj.id}`);
    } else {
      const result = await response.json();
      setErrorMessage(result.error || 'An unexpected error occurred');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-warmCoral to-mutedGrayBlue dark:from-darkPurple dark:to-deepBlue">
      <div className="max-w-3xl w-full p-6 bg-white dark:bg-deepBlue rounded-xl shadow-lg text-black ">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-darkPurple dark:text-warmCoral text-center mb-4">Edit Blog</h1>

        {errorMessage && (
          <div className="mb-4 p-2 bg-red-200 text-red-800 rounded">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleFormSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-lg font-semibold">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              defaultValue={blog.title} 
              className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-vibrantPink"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="title_ka" className="block text-lg font-semibold">Title (KA)</label>
            <input
              type="text"
              id="title_ka"
              name="title_ka"
              defaultValue={blog.title_ka} 
              className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-vibrantPink"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-lg font-semibold">Description</label>
            <textarea
              id="description"
              name="description"
              defaultValue={blog.description} 
              className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-vibrantPink"
              required
            ></textarea>
          </div>

          <div className="mb-4">
            <label htmlFor="description_ka" className="block text-lg font-semibold">Description (KA)</label>
            <textarea
              id="description_ka"
              name="description_ka"
              defaultValue={blog.description_ka} 
              className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-vibrantPink"
              required
            ></textarea>
          </div>

          <button type="submit" className="w-full bg-vibrantPink hover:bg-darkPurple text-white py-2 rounded">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBlogPage;
