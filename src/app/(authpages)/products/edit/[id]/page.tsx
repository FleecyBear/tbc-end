'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/app/utils/supabase/client';
import { useRouter, useParams } from 'next/navigation';

const EditProductPage = () => {
  const supabase = createClient();
  const router = useRouter();
  const params = useParams();
  const [paramsObj, setParamsObj] = useState<any>(null);
  const [product, setProduct] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const [title, setTitle] = useState('');
  const [titleKa, setTitleKa] = useState('');
  const [description, setDescription] = useState('');
  const [descriptionKa, setDescriptionKa] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  const [images, setImages] = useState<FileList | null>(null);
  const [imagesToRemove, setImagesToRemove] = useState<string[]>([]);

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
        const { data: product, error: productError } = await supabase
          .from('products')
          .select('*')
          .eq('id', paramsObj.id)
          .single();

        if (productError || !product) {
          router.push('/products');
        } else {
          setProduct(product);
          setTitle(product.title);
          setTitleKa(product.title_ka);
          setDescription(product.description);
          setDescriptionKa(product.description_ka);
          setPrice(product.price);
          setCategory(product.category);
          setStockQuantity(product.stock_quantity);
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

  if (!paramsObj || !product || !userData) {
    return <div>Loading...</div>;
  }

  if (product.user_id !== userData.id) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-warmCoral to-mutedGrayBlue dark:from-darkPurple dark:to-deepBlue">
        <div className="max-w-xl w-full p-6 bg-white dark:bg-deepBlue rounded-xl shadow-lg text-black dark:text-white text-center">
          <h1 className="text-3xl font-bold text-darkPurple dark:text-warmCoral">Sorry, you are not allowed to edit this product.</h1>
        </div>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImages(e.target.files);
  };

  const handleRemoveImage = (image: string) => {
    setImagesToRemove(prev => [...prev, image]);
  };

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

  const handleFormSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData(event.target);
      const updateData: any = {
        title: formData.get('title') as string,
        title_ka: formData.get('title_ka') as string,
        description: formData.get('description') as string,
        description_ka: formData.get('description_ka') as string,
        price: parseFloat(formData.get('price') as string),
        category: formData.get('category') as string,
        stock_quantity: parseInt(formData.get('stock_quantity') as string, 10),
      };

      let imageUrls: string[] = product.images.filter((image: string) => !imagesToRemove.includes(image)); // Remove selected images
      if (images) {
        for (let i = 0; i < images.length; i++) {
          const file = images[i];
          const uniqueFileName = await generateUniqueFilename('images', file);
          const signedUrl = await generateSignedUrl('images', `public/${uniqueFileName}`, 31536000); // 1 year in seconds
          imageUrls.push(signedUrl);
        }
      }
      updateData.images = imageUrls;

      const { error: updateError } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', paramsObj.id);

      if (updateError) {
        setErrorMessage(`Error updating product: ${updateError.message}`);
      } else {
        router.push(`/products/${paramsObj.id}`);
      }
    } catch (err: any) {
      setErrorMessage(`An unexpected error occurred: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-warmCoral to-mutedGrayBlue dark:from-darkPurple dark:to-deepBlue">
      <div className="max-w-3xl w-full p-6 bg-white dark:bg-deepBlue rounded-xl shadow-lg text-black dark:text-white">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-darkPurple dark:text-warmCoral text-center mb-4">Edit Product</h1>

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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
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
              value={titleKa}
              onChange={(e) => setTitleKa(e.target.value)}
              className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-vibrantPink"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-lg font-semibold">Description</label>
            <textarea
              id="description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-vibrantPink"
              required
              ></textarea>
              </div>
    
              <div className="mb-4">
                <label htmlFor="price" className="block text-lg font-semibold">Price</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-vibrantPink"
                  required
                />
              </div>
    
              <div className="mb-4">
                <label htmlFor="category" className="block text-lg font-semibold">Category</label>
                <input
                  type="text"
                  id="category"
                  name="category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-vibrantPink"
                  required
                />
              </div>
    
              <div className="mb-4">
                <label htmlFor="stock_quantity" className="block text-lg font-semibold">Stock Quantity</label>
                <input
                  type="number"
                  id="stock_quantity"
                  name="stock_quantity"
                  value={stockQuantity}
                  onChange={(e) => setStockQuantity(e.target.value)}
                  className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-vibrantPink"
                  required
                />
              </div>
    
              <div className="mb-4">
                <label htmlFor="images" className="block text-lg font-semibold">Images</label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  multiple
                  onChange={handleFileChange}
                  className="w-full p-2 mt-2 border rounded focus:outline-none focus:ring-2 focus:ring-vibrantPink"
                />
                {product.images && product.images.length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-lg font-semibold mb-2">Current Images</h3>
                    <div className="flex space-x-2">
                      {product.images.map((image: string, index: number) => (
                        <div key={index} className="w-24 h-24 relative">
                          <img
                            src={image}
                            alt={`Product image ${index + 1}`}
                            className="object-cover rounded-lg shadow-md"
                          />
                          <button
                            type="button"
                            className="absolute top-0 right-0 mt-1 mr-1 bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                            onClick={() => handleRemoveImage(image)}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
    
              <button type="submit" className="w-full bg-vibrantPink hover:bg-darkPurple text-white py-2 rounded" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        </div>
      );
    };
    
    export default EditProductPage;
    