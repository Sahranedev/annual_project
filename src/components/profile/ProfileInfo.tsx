import { useState } from "react";
import { UserProfile } from "@/types/user";
import { useAuthStore } from "@/app/store/authStore";
import { FiAlertTriangle, FiEdit2, FiLoader } from "react-icons/fi";

interface ProfileInfoProps {
  user: UserProfile;
}

export default function ProfileInfo({ user }: ProfileInfoProps) {
  const { token, updateUserProfile } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || "",
    lastName: user.lastName || "",
    displayName: user.displayName || user.username,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:1337/api/users/${user.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            displayName: formData.displayName,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || "Une erreur est survenue");
      }

      updateUserProfile(formData);
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-8 border border-gray-100">
      <h2 className="text-2xl font-bold mb-8 text-gray-800">
        Informations personnelles
      </h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-5 py-4 rounded-lg mb-6 flex items-center">
          <FiAlertTriangle className="h-5 w-5 mr-2" />
          {error}
        </div>
      )}

      {isEditing ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                Prénom
              </label>
              <input
                type="text"
                name="firstName"
                id="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F6B99C] focus:border-[#F6B99C] transition duration-150 ease-in-out shadow-sm"
                placeholder="Votre prénom"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Nom
              </label>
              <input
                type="text"
                name="lastName"
                id="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F6B99C] focus:border-[#F6B99C] transition duration-150 ease-in-out shadow-sm"
                placeholder="Votre nom"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="displayName"
              className="block text-sm font-medium text-gray-700"
            >
              Nom affiché
            </label>
            <input
              type="text"
              name="displayName"
              id="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#F6B99C] focus:border-[#F6B99C] transition duration-150 ease-in-out shadow-sm"
              placeholder="Comment souhaitez-vous être affiché"
            />
            <p className="mt-2 text-sm text-gray-500">
              Indique comment votre nom apparaîtra dans la section relative au
              compte et dans les avis
            </p>
          </div>

          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
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
              ) : (
                "Enregistrer les modifications"
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gray-50 p-5 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Prénom</h3>
              <p className="text-lg font-medium text-gray-900">
                {user.firstName || "-"}
              </p>
            </div>

            <div className="bg-gray-50 p-5 rounded-lg">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Nom</h3>
              <p className="text-lg font-medium text-gray-900">
                {user.lastName || "-"}
              </p>
            </div>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Adresse e-mail
            </h3>
            <p className="text-lg font-medium text-gray-900">{user.email}</p>
          </div>

          <div className="bg-gray-50 p-5 rounded-lg">
            <h3 className="text-sm font-medium text-gray-500 mb-2">
              Nom affiché
            </h3>
            <p className="text-lg font-medium text-gray-900">
              {user.displayName || user.username}
            </p>
            <p className="mt-2 text-sm text-gray-500">
              Indique comment votre nom apparaîtra dans la section relative au
              compte et dans les avis
            </p>
          </div>

          <div className="pt-4">
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-5 py-3 bg-[#F6B99C] rounded-lg shadow-sm text-sm font-medium text-white hover:bg-[#e6a98c] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#F6B99C] transition duration-150 ease-in-out"
            >
              <FiEdit2 className="h-4 w-4 mr-2" />
              Modifier
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
