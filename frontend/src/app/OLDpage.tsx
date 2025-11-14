// "use client";
// import { useEffect } from "react";
// import Card from "../components/Card/Card";
// import {useAppSelector, useAppDispatch} from "@/Hooks/reduxHooks";
// import { getAllProducts } from "@/data/reducers/ProductReducers";
// import { getGuestFavs, getGuestCart, getUserCart, getUserFavs} from "@/utils/addTo";
// import { usePrevious } from "@/Hooks/usePrevious";
// import { useRouter } from "next/navigation";

// export default function Home() {
//   const router = useRouter();
//   const dispatch = useAppDispatch();
//   const productsData = useAppSelector((state) => state.products.productsState.products);
//   const { isLoggedIn, staticData } = useAppSelector((state) => state.user);
//   const favs = isLoggedIn ? getUserFavs(staticData.Name) : getGuestFavs();
//   const incart = isLoggedIn ? getUserCart(staticData.Name) : getGuestCart();

//   const prevIsLoggedIn = usePrevious(isLoggedIn);

//   useEffect(() => {
//     if (prevIsLoggedIn === true && isLoggedIn === false) {
//       // router.push("/"); // didn't work
//       // router.refresh(); // didn't work
//       window.location.reload();
//     }
//   }, [isLoggedIn, prevIsLoggedIn, staticData.Name, router]);

//   // Initial data fetch
//   useEffect(() => {
//       dispatch(getAllProducts());
//   }, [dispatch]);
//   return (
//     <div className="container mx-auto">
//       {/* <CustomDialog  closedBtitle="Add product"/> */}
//       <div className="p-10 flex flex-row flex-wrap gap-4 justify-center max-w-7xl mx-auto">
//         {productsData.map((product) => (
//           <Card 
//             key={product.id}
//             product = {product}
//             height={380}
//             width={250}
//             isFav={favs? favs.includes(product.id) : false}
//             inCart={incart? incart.includes(product.id) : false}
//           />
//         ))}
//       </div>
//     </div>
//   );
// }
