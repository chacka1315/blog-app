const API_URL = import.meta.env.VITE_API_URL;

export const login = async (credantials) => {
  const res = await fetch(`${API_URL}/auth/sign-in`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credantials),
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error('Some error occured.');
  }

  if (!res.ok) throw data;
  return data;
};

export const register = async (formData) => {
  const res = await fetch(`${API_URL}/auth/sign-up`, {
    method: 'POST',
    body: formData,
  });
  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error('Some error occured.');
  }

  if (!res.ok) throw data;
  return data;
};

export async function logout() {
  localStorage.removeItem('jwt');
}
