const ApiHelper = async (route, method, body = null, token = null) => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");
  if (token) {
    myHeaders.append("Authorization", `Bearer ${token}`);
  }

  const requestOptions = {
    method,
    headers: myHeaders,
    body,
  };

  return await fetch(`http://localhost:1337/api/${route}`, requestOptions).then(res => res.json());
};

export default ApiHelper;
