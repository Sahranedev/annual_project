import { useState } from "react";
import { UserAddress, AddressFormData } from "@/types/user";
import { useAuthStore } from "@/app/store/authStore";
import ApiHelper from "@/app/ApiHelper";
import AddressCard from "./AddressCard";
import AddressForm from "./AddressForm";
import { FiAlertTriangle, FiMapPin, FiPlus } from "react-icons/fi";

interface AddressManagerProps {
  type: "billing" | "shipping";
}

export default function AddressManager({ type }: AddressManagerProps) {
  const { user, token, addAddress, updateAddress, removeAddress } =
    useAuthStore();
  const [isAddingAddress, setIsAddingAddress] = useState(false);
  const [editingAddress, setEditingAddress] = useState<UserAddress | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addresses = user?.addresses?.filter((addr) => addr.type === type) || [];

  const titleText =
    type === "billing" ? "Adresse de facturation" : "Adresse de livraison";
  const emptyText =
    type === "billing"
      ? "Vous n'avez pas encore défini d'adresse de facturation"
      : "Vous n'avez pas encore défini d'adresse de livraison";

  const handleAddAddress = async (data: AddressFormData) => {
    setLoading(true);
    setError("");

    try {
      const response = await ApiHelper(
        "user-addresse",
        "POST",
        {
          ...data,
          type,
          user_id: user?.id,
        },
        token
      );

      if (response.error) {
        throw new Error(response.error.message || "Une erreur est survenue");
      }

      addAddress({
        id: response.data.id,
        type,
        ...data,
      });
      setIsAddingAddress(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAddress = async (data: AddressFormData) => {
    if (!editingAddress) return;

    setLoading(true);
    setError("");

    try {
      const response = await ApiHelper(
        `user-addresse/${editingAddress.id}`,
        "PUT",
        {
          ...data,
          type,
        },
        token
      );

      if (response.error) {
        throw new Error(response.error.message || "Une erreur est survenue");
      }

      updateAddress(editingAddress.id, data);
      setEditingAddress(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async (id: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cette adresse ?")) return;

    setLoading(true);
    setError("");

    try {
      const response = await ApiHelper(
        `user-addresse/${id}`,
        "DELETE",
        null,
        token
      );

      if (response.error) {
        throw new Error(response.error.message || "Une erreur est survenue");
      }

      removeAddress(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (isAddingAddress) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <AddressForm
          type={type}
          onSubmit={handleAddAddress}
          onCancel={() => setIsAddingAddress(false)}
        />
      </div>
    );
  }

  if (editingAddress) {
    return (
      <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
        <AddressForm
          type={type}
          initialData={editingAddress}
          onSubmit={handleUpdateAddress}
          onCancel={() => setEditingAddress(null)}
        />
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-800">{titleText}</h2>
        <button
          onClick={() => setIsAddingAddress(true)}
          className="inline-flex items-center px-5 py-3 bg-[#F6B99C] rounded-lg shadow-sm text-sm font-medium text-white hover:bg-[#e6a98c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F6B99C] transition duration-150 ease-in-out"
          disabled={loading}
        >
          <FiPlus className="h-4 w-4 mr-2" />
          Ajouter {type === "billing" ? "une facturation" : "une livraison"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-lg mb-6 flex items-center">
          <FiAlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {addresses.length === 0 ? (
        <div className="bg-gray-50 rounded-lg text-center py-12 px-4">
          <FiMapPin className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-4 text-gray-700 font-medium">{emptyText}</p>
          <p className="mt-2 text-gray-500">
            Cliquez sur le bouton ci-dessus pour en ajouter une.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2">
          {addresses.map((address) => (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={(addr) => setEditingAddress(addr)}
              onDelete={(id) => handleDeleteAddress(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
