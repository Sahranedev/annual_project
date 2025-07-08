const ApiHelper = async (
  route: string,
  method: string,
  body: Record<string, unknown> | null = null,
  token: string | null = null
) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  if (token) {
    myHeaders.append("Authorization", `Bearer ${token}`);
  }

  // Adapter le format des données selon l'endpoint
  const prepareBody = () => {
    if (!body) return null;

    // Pour les endpoints d'utilisateurs ou endpoints spécifiques Strapi, la structure est différente
    if (
      route.startsWith("users/") ||
      route.startsWith("user-addresses") ||
      route.startsWith("user-addresse")
    ) {
      return JSON.stringify({ data: body });
    }

    return JSON.stringify(body);
  };

  const requestOptions = {
    method,
    headers: myHeaders,
    body: prepareBody(),
  };

  try {
    const response = await fetch(
      `http://localhost:1337/api/${route}`,
      requestOptions
    );

    // Pour DELETE, ne pas essayer de parser le JSON si pas de contenu
    if (method === "DELETE" && response.status === 204) {
      return { data: true }; // Retourner une valeur par défaut pour indiquer succès
    }

    const responseData = await response.json();

    if (!response.ok) {
      console.error("API Error:", responseData);
      return {
        error: responseData.error || { message: "Une erreur est survenue" },
      };
    }

    return responseData;
  } catch (error) {
    console.error("API Request Error:", error);
    return { error: { message: "Erreur de connexion au serveur" } };
  }
};

export default ApiHelper;
