import { useEffect, useState } from "react";
import { ActionButtons } from "../component/individual/ActionButtons";
import { DeliveryCheck } from "../component/individual/DeliveryCheck";
import { ProductDetails } from "../component/individual/ProductDetails";
import { ProductImageGallery } from "../component/individual/ProductImageGallery";
import { ProductInfo } from "../component/individual/ProductInfo";
import { SimilarProducts } from "../component/individual/SimiliarProducts";
import { SizeSelector } from "../component/individual/SizeSelector";
import { Link, useParams } from "react-router-dom";
import { productAPI } from '../../services/allAPI';
import Reviews from "../component/individual/Review";
import { ArrowLeft } from "lucide-react";

interface ProductData {
  images: string[];
  title: string;
  brand: string;
  final_price_inr: number;
  original_price_inr: number;
  rating: number;
  reviews: any[];
  sizes: string[];
  sizeStock: Record<string, number>;
  description: string;
  material: string;
 productCare: string[]
}

const SIMILAR_PRODUCTS = [
  {
    id: 1,
    name: 'Floral Print Midi Dress',
    brand: 'BLOOM & CO',
    price: 2999,
    image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=600&h=800&fit=crop',
  },
  {
    id: 2,
    name: 'Classic Black Cocktail Dress',
    brand: 'NOIR',
    price: 4499,
    image: 'https://images.unsplash.com/photo-1566174053779-31528523f8ae?w=600&h=800&fit=crop',
  },
  {
    id: 3,
    name: 'Silk Wrap Evening Gown',
    brand: 'LUXE COUTURE',
    price: 5999,
    image: 'https://images.unsplash.com/photo-1596783074918-c84cb06531ca?w=600&h=800&fit=crop',
  },
  {
    id: 4,
    name: 'Velvet A-Line Dress',
    brand: 'VELOUR',
    price: 3499,
    image: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600&h=800&fit=crop',
  },
  {
    id: 5,
    name: 'Bohemian Maxi Dress',
    brand: 'BOHO CHIC',
    price: 2799,
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=600&h=800&fit=crop',
  },
];

export default function Product() {
  const { id } = useParams();

  const [productData, setProductData] = useState<ProductData | null>(null);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);

  const getProduct = async () => {
    try {
      const res = await productAPI(id as string);
      console.log(res);
      setProductData(res.product);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (id) {
      getProduct();
    }
  }, [id]);

  if (!productData) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="border-b border-neutral-200" />
      <div className="mt-5 ms-5">
        <Link to='/'>
          <ArrowLeft className="border border-black rounded-sm" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">

       
          <div className="lg:sticky lg:top-8 lg:self-start">
            <ProductImageGallery images={productData.images} />
          </div>

       
          <div className="space-y-8">
            <ProductDetails
              name={productData.title}
              brand={productData.brand}
              price={productData.final_price_inr}
              originalPrice={productData.original_price_inr}
              rating={productData.rating}
              reviewCount={productData.reviews.length}
            />

            <div className="border-t border-neutral-200 pt-8">
          
              <SizeSelector
                selectedSize={selectedSize}
                sizes={productData.sizes.map((size) => ({
                  label: size,
                  available: productData.sizeStock[size] > 0,
                }))}
                onSizeSelect={(size) => setSelectedSize(size)}
              />
            </div>

            <ActionButtons selectedSize={selectedSize} productId={id} />

            <DeliveryCheck />
          </div>
        </div>

      
        <div className="mt-12 max-w-4xl">
          <ProductInfo
            description={productData.description}
            material={productData.material}
            care={productData.productCare}
          />
        </div>

        <Reviews reviews={productData.reviews} />

        <div className="mt-16 border-t border-neutral-200">
          <SimilarProducts products={SIMILAR_PRODUCTS} />
        </div>
      </div>
    </div>
  );
}