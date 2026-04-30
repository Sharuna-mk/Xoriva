import { useEffect, useState } from "react";
import { ActionButtons } from "../component/individual/ActionButtons";
import { DeliveryCheck } from "../component/individual/DeliveryCheck";
import { ProductDetails } from "../component/individual/ProductDetails";
import { ProductImageGallery } from "../component/individual/ProductImageGallery";
import { ProductInfo } from "../component/individual/ProductInfo";
import { SimilarProducts } from "../component/individual/SimiliarProducts";
import { SizeSelector } from "../component/individual/SizeSelector";
import { Link, useParams } from "react-router-dom";
import { productAPI, allProductAPI } from '../../services/allAPI';
import Reviews from "../component/individual/Review";
import { ArrowLeft } from "lucide-react";

interface ProductData {
  _id: string;        
  category: string;   
  gender: string;    
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
  productCare: string[];
}


export default function Product() {
  const { id } = useParams();

  const [productData, setProductData] = useState<ProductData | null>(null);

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [similarProducts, setSimilarProducts] = useState<any[]>([]);

  const getProduct = async () => {
    try {
      const res = await productAPI(id as string);
      console.log(res);
      setProductData(res.product);
    } catch (error) {
      console.log(error);
    }
  };

const getSimilarProducts = async () => {
  try {
    const res = await allProductAPI();
    const all = res.products || res;

    const similar = all
      .filter((p: any) => p._id !== productData?._id)
      .slice(0, 10);

    setSimilarProducts(similar);
  } catch (error) {
    console.log(error);
  }
};
  useEffect(() => {
    if (id) {
      getProduct();
    }
  }, [id]);
  useEffect(() => {
    if (productData) {
      getSimilarProducts();
    }
  }, [productData]);

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
          <SimilarProducts
            products={similarProducts.map((p) => ({
              id: p._id,
              name: p.title,
              brand: p.brand,
              price: p.final_price_inr,
              image: p.thumbnail,
            }))} />
        </div>
      </div>
    </div>
  );
}