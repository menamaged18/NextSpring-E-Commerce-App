import { Product } from "@/interfaces/IProduct";
import EditModal from "./EditModal";

interface AdminViewProps {
  product: Product;
  isEditOpen: boolean;
  setIsEditOpen: (isOpen: boolean) => void;
  handleDelete: (productId: number) => void;
}

function AdminView({ product, isEditOpen, setIsEditOpen, handleDelete }: AdminViewProps) {
  
  return (
    <div className="flex flex-col gap-2 mt-auto">
      {/* Updated badge */}
      {product.updated_at && (
        <div className="flex justify-center">
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Updated</span>
        </div>
      )}
      
      {/* Admin buttons */}
      <div className="flex flex-row justify-between gap-2">
        <button 
          className="flex-1 bg-blue-700 hover:bg-blue-800 py-1 text-white rounded-lg cursor-pointer text-sm"
          onClick={() => setIsEditOpen(true)}
        >
          Edit
        </button>
        <button 
          className="flex-1 bg-red-700 hover:bg-red-800 py-1 text-white rounded-lg cursor-pointer text-sm"
          onClick={() => handleDelete(product.id)}
        >
          Remove
        </button>
      </div>

      <EditModal product={product} isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} />
    </div>
  );
}

export default AdminView;