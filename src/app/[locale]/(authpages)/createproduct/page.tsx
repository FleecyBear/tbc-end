'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchUser } from '@/app/utils/fetchuser';
import { createClient } from '@/app/utils/supabase/client';

const CreateProduct: React.FC = () => {
  const [title, setTitle] = useState('');
  const [titleKa, setTitleKa] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionKa, setDescriptionKa] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.files);
  };

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

      const generateUniqueFilename = async (bucket: string, file: File, attempt = 0): Promise<string> => {
        let fileName = file.name;
        if (attempt > 0) {
          const ext = file.name.substring(file.name.lastIndexOf('.'));
          const nameWithoutExt = file.name.substring(0, file.name.lastIndexOf('.'));
          fileName = `${nameWithoutExt} (${attempt})${ext}`;
        }

        const { error } = await supabase.storage.from(bucket).upload(`public/${fileName}`, file, {
          cacheControl: '3600',
          upsert: false,
        });

        if (error && error.message === 'Duplicate file') {
          return await generateUniqueFilename(bucket, file, attempt + 1);
        } else if (error) {
          throw error;
        }

        return fileName;
      };

      const generateSignedUrl = async (bucket: string, path: string, expiresIn: number) => {
        const { data, error } = await supabase.storage.from(bucket).createSignedUrl(path, expiresIn);
        if (error) {
          throw error;
        }
        return data.signedUrl;
      };

      let imageUrls: string[] = [];
      if (images) {
        for (let i = 0; i < images.length; i++) {
          const file = images[i];
          const uniqueFileName = await generateUniqueFilename('images', file);
          const signedUrl = await generateSignedUrl('images', `public/${uniqueFileName}`, 31536000); // 1 year in seconds
          imageUrls.push(signedUrl);
        }
      }

      const newProduct = {
        title,
        title_ka: titleKa,
        description,
        description_ka: descriptionKa,
        price: parseFloat(price),
        category,
        stock_quantity: parseInt(stockQuantity, 10),
        images: imageUrls,
        creator: profileData.nickname,
        user_id: user.id
      };

      console.log('New product:', newProduct); 

      const { error: productError } = await supabase
        .from('products')
        .insert([newProduct]);

      if (productError) {
        setError(`Error creating product: ${productError.message}`);
      } else {
        router.push('/products'); 
      }
    } catch (err: any) {
      setError(`An unexpected error occurred: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 text-black dark:text-white">
      <h1 className="text-3xl font-bold mb-6 text-center">Create Product</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block mb-2">Title (EN)</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border border-mutedGrayBlue rounded text-black dark:border-deepBlue"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Title (KA)</label>
          <input
            type="text"
            value={titleKa}
            onChange={(e) => setTitleKa(e.target.value)}
            className="w-full p-2 border border-mutedGrayBlue rounded text-black dark:border-deepBlue"
          />
        </div>
        <div>
          <label className="block mb-2">Description (EN)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border border-mutedGrayBlue rounded text-black dark:border-deepBlue" 
            required
          />
        </div>
        <div>
          <label className="block mb-2">Description (KA)</label>
          <textarea
            value={descriptionKa}
            onChange={(e) => setDescriptionKa(e.target.value)}
            className="w-full p-2 border border-mutedGrayBlue rounded text-black dark:border-deepBlue"
          />
        </div>
        <div>
          <label className="block mb-2">Price</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border border-mutedGrayBlue rounded text-black dark:border-deepBlue"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full p-2 border border-mutedGrayBlue rounded text-black dark:border-deepBlue"
          />
        </div>
        <div>
          <label className="block mb-2">Stock Quantity</label>
          <input
            type="number"
            value={stockQuantity}
            onChange={(e) => setStockQuantity(e.target.value)}
            className="w-full p-2 border border-mutedGrayBlue rounded text-black dark:border-deepBlue"
            required
          />
        </div>
        <div>
          <label className="block mb-2">Images</label>
          <input
            type="file"
            multiple
            onChange={handleFileChange}
            className="w-full p-2 border border-mutedGrayBlue rounded text-black dark:border-deepBlue"
          />
        </div>
        <div>
          <button
            type="submit"
            className="w-full bg-warmCoral p-2 rounded hover:bg-vibrantPink dark:bg-deepBlue dark:hover:bg-darkPurple"
            disabled={loading}
          >
            {loading ? 'Creating...' : 'Create Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateProduct;
