import { UserAddress } from "@/types/user";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

interface AddressCardProps {
  address: UserAddress;
  onEdit: (address: UserAddress) => void;
  onDelete: (id: number) => void;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
}: AddressCardProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-md p-6 relative">
      {address.isDefault && (
        <span className="absolute top-4 right-4 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          Par défaut
        </span>
      )}

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-800">
            {address.firstName} {address.lastName}
          </h3>
        </div>

        <div className="text-gray-600 space-y-1">
          <p>{address.address}</p>
          {address.addressComplement && <p>{address.addressComplement}</p>}
          <p>
            {address.postalCode} {address.city}
          </p>
          <p>{address.country}</p>
          {address.phone && (
            <p className="text-gray-500">Tél: {address.phone}</p>
          )}
        </div>

        <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-100">
          <button
            onClick={() => onEdit(address)}
            className="inline-flex items-center px-3 py-2 border border-[#F6B99C] rounded-lg text-sm font-medium text-[#F6B99C] bg-white hover:bg-[#FDF5F1] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F6B99C] transition-colors"
          >
            <FiEdit2 className="h-4 w-4 mr-1" />
            Modifier
          </button>

          <button
            onClick={() => onDelete(address.id)}
            className="inline-flex items-center px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-500 bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400 transition-colors"
          >
            <FiTrash2 className="h-4 w-4 mr-1" />
            Supprimer
          </button>
        </div>
      </div>
    </div>
  );
}
