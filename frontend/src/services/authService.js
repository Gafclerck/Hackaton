import api from "./api";

export async function login(email, password) {
  const body = new URLSearchParams();
  body.append("username", email);
  body.append("password", password);

  const { data } = await api.post("/auth/login", body, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });

  localStorage.setItem("access_token", data.access_token);
  localStorage.setItem("refresh_token", data.refresh_token);
  return data;
}

export async function getProfile() {
  const { data } = await api.get("/auth/me");
  return data;
}

export function logout() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
}

export async function register(userData, role = "avocat") {
  const endpoint =
    {
      chef_central: "/auth/chef_central/register",
      chef_agence: "/auth/chef_agence/register",
    }[role] || "/auth/register";

  const { data } = await api.post(endpoint, userData);
  return data;
}
