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

  const requestOptions = {
    method,
    headers: myHeaders,
    body: body ? JSON.stringify(body) : null,
  };

  return await fetch(`http://localhost:1337/api/${route}`, requestOptions).then(
    (res) => res.json()
  );
};

export default ApiHelper;
