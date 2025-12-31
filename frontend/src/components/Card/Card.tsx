'use client'
import { Product, ProductSimpleResponse } from "@/interfaces/IProduct";
import ActionButtons from "@/components/ActionButtons/ActionButtons";
import Image from "next/image";
import Link from "next/link";
import { useState } from 'react';
import {useAppDispatch, useAppSelector} from "@/Hooks/reduxHooks";
// import { deleteProduct } from '@/data/reducers/ProductReducers';
import AdminView from "./AdminView";
import { deleteProduct } from "@/data/reducers/product/ProductReducer";

interface Iprops {
  product: Product | ProductSimpleResponse
  height: number
  width: number
  isFav: boolean
  inCart: boolean
  onFavToggled?: () => void;
}

// this variable used to check if the product has full information 
// if it has the full information send it to admin view component
const isFullProduct = (product: Product | ProductSimpleResponse): product is Product => {
  return (product as Product).cost_price !== undefined;
};

const colors = [
    { name: 'Blue', value: 'bg-blue-500' },
    { name: 'Red', value: 'bg-red-500' },
    { name: 'Orange', value: 'bg-orange-500' },
];

function Card({product, height, width, isFav, inCart, onFavToggled}: Iprops) {
  const dispatch = useAppDispatch();
  const userType = useAppSelector( (state) => state.user.selectedUser?.userType || "Guest" );
  const [selectedColor, setSelectedColor] = useState<string>(colors[0].name);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const handleDelete = (productId: number) => {
    dispatch(deleteProduct(productId));
  };

  const handleColorClick = (event: React.MouseEvent, colorName: string) => {
    event.stopPropagation();
    setSelectedColor(colorName);
  };

  // Calculate dynamic values based on card height
  const imageAspectRatio = height > 300 ? 0.6 : 0.5; 
  const descriptionLines = height > 300 ? 5 : 1;
  
  // console.log(product.imageUrl)

  return (
  <div 
    className="container p-3 shadow-lg rounded-xl flex flex-col transition duration-300 hover:shadow-2xl hover:scale-110 relative"
    style={{
      height: `${height}px`,
      width: `${width}px` 
    }}
  >
    {/* MAIN CONTENT: flexible, will expand when admin buttons are absent */}
    <div className="flex flex-col mb-4 flex-1 min-h-0">
      {/* Make the clickable area take the remaining space and allow children to scroll/shrink */}
      <Link href={`/ProductDetails/${product.id}`} className="flex flex-col flex-1 min-h-0">
        {/* Image — dynamic aspect ratio based on card height */}
        <div
          className="w-full overflow-hidden rounded-lg relative group mb-2 flex-shrink-0"
          style={{ paddingBottom: `${imageAspectRatio * 100}%` }}
        >
          <Image
            src={product.imageUrl ?? "/stockImage.jpg"}
            alt="card image"
            fill
            style={{ objectFit: 'cover' }}
            className="transform transition duration-500 group-hover:scale-110"
            sizes="(max-width: 768px) 100vw, 210px"
          />
          {(userType === "Normal" || userType === "Guest" ) && 
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <ActionButtons 
                productid={product.id} 
                isFav={isFav} 
                inCart={inCart}
                onFavToggled={onFavToggled} 
              />
            </div>  
          }
        </div>

        {/* Title */}
        <div className="mb-1 flex-shrink-0">
          <h1 className="font-bold text-lg transition duration-300 hover:text-blue-500 line-clamp-1">{product.name}</h1>
        </div>

        {/* Description - dynamic line clamp based on card height */}
        <div className="text-sm overflow-hidden flex-1 min-h-0 mb-3">
          <p className={`line-clamp-${descriptionLines}`}>{product.description}</p>
        </div>
        {/* Weight */}
        <p className="text-xs flex-1 flex-shrink-0">Weight: {product.weight}g</p>
      </Link>

      {/* Color options — fixed-size row */}
      <div className="flex flex-row gap-1 mb-2 flex-shrink-0">
        {colors.map((color, index) => (
          <div
            key={index}
            className={`w-4 h-4 ${color.value} rounded-full cursor-pointer border-2 transform transition duration-200 hover:scale-125 ${
              selectedColor === color.name ? 'border-black' : 'border-transparent'
            }`}
            onClick={(event) => handleColorClick(event, color.name)}
          />
        ))}
      </div>

      {/* Price & category — fixed area at bottom of main content */}
      <div className="flex flex-row justify-between items-center flex-shrink-0">
        <h2 className="text-blue-500 font-bold transition duration-300 hover:text-blue-700 text-sm">{product.price} $</h2>
        <div className="flex flex-row gap-1 items-center">
          {/* icon image */}
          <Image 
            src="/imageplaceholder.jpg"
            alt="Category image"
            height={100}
            width={100}
            className="rounded-full h-5 w-5 transition duration-300 hover:opacity-75"
          />
          <p className="transition duration-300 hover:text-gray-500 text-xs">{product.category}</p>
        </div>
      </div>
    </div>

    <p className="text-xs text-gray-500 mb-2">Brand: {product.brand}</p>

    {/* Admin buttons */}
    {userType === 'Admin' && isFullProduct(product) &&
      <AdminView 
        product={product}
        isEditOpen={isEditOpen}
        setIsEditOpen={setIsEditOpen}
        handleDelete={handleDelete}
      />
    }

  </div>
  );
}

export default Card;