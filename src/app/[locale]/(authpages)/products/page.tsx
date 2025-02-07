import { createClient } from '@/app/utils/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

const ProductsPage = async () => {
  const supabase = createClient();
  const { data: userData, error: userError } = await (await supabase).auth.getUser();

  if (userError || !userData?.user) {
    redirect('/login');
  }

  const { data: products, error: productsError } = await (await supabase)
    .from('products')
    .select('id, title, title_ka, created_at, creator, price, images');

  if (productsError) {
    console.error('Error fetching products:', productsError);
    return <div className="text-center text-red-500">Failed to load products</div>;
  }

  return (
    <div className="container mx-auto p-6 text-black dark:text-white">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-darkPurple dark:text-warmCoral">All Products</h1>
        <Link href="/createproduct">
          <button className="bg-vibrantPink text-white px-6 py-3 rounded-lg shadow-md hover:bg-warmCoral transition">
            + Create Product
          </button>
        </Link>
      </div>

      {products && products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product: any) => (
            <Link key={product.id} href={`/products/${product.id}`} className="block">
              <div className="p-6 bg-white dark:bg-darkPurple rounded-2xl shadow-lg transition hover:scale-[1.02] cursor-pointer">
                <h2 className="text-2xl font-bold text-deepBlue dark:text-warmCoral">{product.title}</h2>
                <h3 className="text-lg text-deepBlue dark:text-warmCoral">{product.title_ka}</h3>
                {product.images && product.images.length > 0 && (
                  <img src={product.images[0]} alt={`${product.title} image`} className="mt-4 rounded-lg shadow-md" />
                )}
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">By {product.creator}</p>
                <p className="text-xs text-gray-400 dark:text-gray-500">{new Date(product.created_at).toLocaleDateString()}</p>
                <p className="mt-2 text-lg font-bold text-deepBlue dark:text-warmCoral">${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-center text-lg text-gray-600 dark:text-mutedGrayBlue">No products available.</p>
      )}
    </div>
  );
};

export default ProductsPage;
