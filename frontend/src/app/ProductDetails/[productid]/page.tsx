// app/ProductDetails/[productid]/page.tsx
import { Metadata } from "next";
import PageData from "./PageData"; 

type Props = {
  params: Promise<{ productid: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { productid } = await params;
  const productId = Number(productid);
  
  try {
    // Fetch product data directly on the server for metadata
    const response = await fetch(`http://localhost:8080/product/${productId}`, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });
    
    if (!response.ok) {
      throw new Error('Product not found');
    }
    
    const product = await response.json();

    return {
      title: `${product.name} - E-Commerce Store`,
      description: product.description,
      openGraph: {
        title: product.name,
        description: product.description,
      },
    };
  } catch (error) {
    return {
      title: 'Product Not Found - E-Commerce Store',
      description: 'The product you are looking for does not exist.',
    };
  }
}

export default async function ProductPage({ params }: Props) {
  const { productid } = await params;
  const productId = Number(productid);
  
  return <PageData productid={productId} />;
}