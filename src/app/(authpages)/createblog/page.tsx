'use client'
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUser } from '@/app/utils/fetchuser';
import { createClient } from '@/app/utils/supabase/client';

const CreateBlog: React.FC = () => {
  const [title, setTitle] = useState('');
  const [titleKa, setTitleKa] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionKa, setDescriptionKa] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const user = await fetchUser();
      if (!user) {
        setError('User is not authenticated');
        setLoading(false);
        return;
      }

      const supabase = createClient();
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('nickname')
        .eq('user_id', user.id)
        .single();
      
      if (profileError || !profileData) {
        setError('Failed to fetch user profile');
        setLoading(false);
        return;
      }

      const { error: blogError } = await supabase
        .from('blogs')
        .insert([{
          title,
          title_ka: titleKa,
          description,
          description_ka: descriptionKa,
          creator: profileData.nickname, 
          user_id: user.id,  
        }]);

      if (blogError) {
        setError('Error creating blog');
      } else {
        router.push('/blogs'); 
      }
    } catch (err) {
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center ">Create Blog</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2 ">Title (EN)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-mutedGrayBlue rounded text-black dark:border-deepBlue"
            required
          />
        </div>
        <div>
          <label className="block mb-2 ">Title (KA)</label>
          <input
            type="text"
            value={titleKa}
            onChange={(e) => setTitleKa(e.target.value)}
            className="w-full p-2 border border-mutedGrayBlue rounded text-black dark:border-deepBlue"
          />
        </div>
        <div>
          <label className="block mb-2 ">Description (EN)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-mutedGrayBlue rounded text-black dark:border-deepBlue" 
            required
          />
        </div>
        <div>
          <label className="block mb-2 ">Description (KA)</label>
          <textarea
            value={descriptionKa}
            onChange={(e) => setDescriptionKa(e.target.value)}
            className="w-full p-2 border border-mutedGrayBlue rounded text-black dark:border-deepBlue"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-warmCoral p-2 rounded hover:bg-vibrantPink dark:bg-deepBlue  dark:hover:bg-darkPurple "
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Blog'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateBlog;
