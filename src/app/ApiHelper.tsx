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
    if (route.startsWith("users/") || route.startsWith("user-addresses")) {
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
