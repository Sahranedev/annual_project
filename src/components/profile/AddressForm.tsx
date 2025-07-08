import { useState } from "react";
import { UserAddress, AddressFormData } from "@/types/user";
import { FiLoader } from "react-icons/fi";

interface AddressFormProps {
  type: "billing" | "shipping";
  initialData?: UserAddress;
  onSubmit: (data: AddressFormData) => Promise<void>;
  onCancel: () => void;
}

export default function AddressForm({
  type,
  initialData,
  onSubmit,
  onCancel,
}: AddressFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<AddressFormData>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    address: initialData?.address || "",
    addressComplement: initialData?.addressComplement || "",
    postalCode: initialData?.postalCode || "",
    city: initialData?.city || "",
    country: initialData?.country || "France",
    phone: initialData?.phone || "",
    isDefault: initialData?.isDefault || false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target as HTMLInputElement;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <h2 className="text-2xl font-bold mb-8 text-gray-800">
        {initialData
          ? `Modifier votre adresse de ${type === "billing" ? "facturation" : "livraison"}`
          : `Ajouter une adresse de ${type === "billing" ? "facturation" : "livraison"}`}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700"
            >
              Prénom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              id="firstName"
              required
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F6B99C] focus:border-[#F6B99C] transition duration-150 ease-in-out shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700"
            >
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="lastName"
              id="lastName"
              required
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F6B99C] focus:border-[#F6B99C] transition duration-150 ease-in-out shadow-sm"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="address"
            className="block text-sm font-medium text-gray-700"
          >
            Adresse <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="address"
            id="address"
            required
            value={formData.address}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F6B99C] focus:border-[#F6B99C] transition duration-150 ease-in-out shadow-sm"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="addressComplement"
            className="block text-sm font-medium text-gray-700"
          >
            Complément d&apos;adresse
          </label>
          <input
            type="text"
            name="addressComplement"
            id="addressComplement"
            value={formData.addressComplement}
            onChange={handleChange}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F6B99C] focus:border-[#F6B99C] transition duration-150 ease-in-out shadow-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="postalCode"
              className="block text-sm font-medium text-gray-700"
            >
              Code postal <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="postalCode"
              id="postalCode"
              required
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F6B99C] focus:border-[#F6B99C] transition duration-150 ease-in-out shadow-sm"
            />
          </div>
          <div className="space-y-2">
            <label
              htmlFor="city"
              className="block text-sm font-medium text-gray-700"
            >
              Ville <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="city"
              id="city"
              required
              value={formData.city}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F6B99C] focus:border-[#F6B99C] transition duration-150 ease-in-out shadow-sm"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label
              htmlFor="country"
              className="block text-sm font-medium text-gray-700"
            >
              Pays <span className="text-red-500">*</span>
            </label>
            <select
              name="country"
              id="country"
              required
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F6B99C] focus:border-[#F6B99C] transition duration-150 ease-in-out shadow-sm appearance-none bg-white"
            >
              <option value="France">France</option>
              <option value="Belgique">Belgique</option>
              <option value="Suisse">Suisse</option>
              <option value="Luxembourg">Luxembourg</option>
              <option value="Canada">Canada</option>
            </select>
          </div>
          <div className="space-y-2">
            <label
              htmlFor="phone"
              className="block text-sm font-medium text-gray-700"
            >
              Téléphone
            </label>
            <input
              type="tel"
              name="phone"
              id="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F6B99C] focus:border-[#F6B99C] transition duration-150 ease-in-out shadow-sm"
            />
          </div>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            name="isDefault"
            id="isDefault"
            checked={formData.isDefault}
            onChange={handleChange}
            className="h-4 w-4 text-[#F6B99C] focus:ring-[#F6B99C] border-gray-300 rounded"
          />
          <label
            htmlFor="isDefault"
            className="ml-2 block text-sm text-gray-700"
          >
            Définir comme adresse par défaut
          </label>
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-3 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F6B99C] transition duration-150 ease-in-out"
            disabled={loading}
          >
            Annuler
          </button>
          <button
            type="submit"
            className="px-5 py-3 bg-[#F6B99C] rounded-lg shadow-sm text-sm font-medium text-white hover:bg-[#e6a98c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F6B99C] transition duration-150 ease-in-out flex items-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <FiLoader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                Enregistrement...
              </>
            ) : initialData ? (
              "Mettre à jour l'adresse"
            ) : (
              "Ajouter l'adresse"
            )}
          </button>
        </div>
      </form>
    </>
  );
}
