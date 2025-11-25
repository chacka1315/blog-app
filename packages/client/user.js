const API_URL = import.meta.env.VITE_API_URL;

const token = localStorage.getItem('jwt');
export const getMe = async function () {
  const res = await fetch(`${API_URL}/users/me`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

  let data;
  try {
    data = await res.json();
  } catch {
    throw new Error('Some error occured');
  }

  if (!res.ok) throw data;
  return data;
};
