import { createClient } from '@/app/utils/supabase/server';
import Link from 'next/link';
import Image from 'next/image';

interface ProductPageProps {
  params: Promise<{ id: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

const ProductPage = async ({ params, searchParams }: ProductPageProps) => {
  const supabase = createClient();
  
  const paramsResolved = await params;

  const { data: product, error } = await (await supabase)
    .from('products')
    .select('*')
    .eq('id', paramsResolved.id)
    .single();

  if (error || !product) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-warmCoral to-mutedGrayBlue dark:from-darkPurple dark:to-deepBlue">
        <div className="text-center text-white p-8 bg-black bg-opacity-70 rounded-xl shadow-xl">
          <h1 className="text-4xl font-bold text-red-500 dark:text-red-400 mb-4">This product not found</h1>
          <p className="text-lg">The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const { data: userData } = await (await supabase).auth.getUser();
  const isOwner = userData?.user?.id === product.user_id;

  const mainImage = searchParams.image || product.images[0];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-warmCoral to-mutedGrayBlue dark:from-darkPurple dark:to-deepBlue">
      <div className="max-w-3xl w-full p-6 bg-white dark:bg-deepBlue rounded-xl shadow-lg text-black dark:text-white sm:max-w-md md:max-w-lg lg:max-w-3xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-darkPurple dark:text-warmCoral text-center mb-4">{product.title}</h1>
        <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold text-mutedGrayBlue dark:text-vibrantPink text-center mb-6">{product.title_ka}</h2>

        <div className="flex flex-col items-center">
        <div className="flex flex-col items-center">
            <div className="w-52 mb-4 relative" style={{ height: 'auto' }}>
                <Image
                src={mainImage}
                alt={`${product.title} image`}
                layout="responsive"
                width={200}
                height={2200} 
                className="object-contain rounded-lg shadow-md"
                />
            </div>
        </div>
        <div className="flex space-x-2">
            {product.images.map((image: string, index: number) => (
                <Link key={index} href={`/products/${product.id}?image=${encodeURIComponent(image)}`}>
                <div className="relative" style={{ width: '100px', height: 'auto' }}>
                    <Image
                    src={image}
                    alt={`${product.title} image ${index}`}
                    layout="responsive"
                    width={100}
                    height={100} 
                    objectFit="contain"
                    className="rounded-lg shadow-md cursor-pointer"
                    />
                </div>
                </Link>
            ))}
        </div>

        </div>
        
        <p className="text-lg sm:text-base md:text-lg leading-relaxed mt-4 mb-4">{product.description}</p>
        <p className="text-lg sm:text-base md:text-lg leading-relaxed mb-4">{product.description_ka}</p>
        <p className="text-lg font-bold text-deepBlue dark:text-warmCoral">${product.price.toFixed(2)}</p>
        <p className="mt-4 text-sm text-mutedGrayBlue dark:text-vibrantPink">Category: {product.category}</p>
        <p className="mt-4 text-sm text-mutedGrayBlue dark:text-vibrantPink">Creator: {product.creator}</p>
        <p className="text-xs text-mutedGrayBlue dark:text-vibrantPink">{new Date(product.created_at).toLocaleDateString()}</p>

        {isOwner && (
          <div className="mt-6 text-center">
            <Link href={`/products/edit/${product.id}`} className="bg-vibrantPink text-white py-2 px-4 rounded-lg hover:bg-darkPurple dark:bg-warmCoral dark:text-mutedGrayBlue dark:hover:bg-deepBlue">
              Edit Product
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
