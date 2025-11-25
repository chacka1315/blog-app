const API_URL = import.meta.env.VITE_API_URL;

export const getPosts = async function () {
  const res = await fetch(`${API_URL}/posts`, {
    method: 'GET',
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

export const getPost = async function (slug) {
  const res = await fetch(`${API_URL}/posts/${slug}`);

  let data;

  try {
    data = await res.json();
  } catch {
    throw new Error('A network error accountered.');
  }

  if (!res.ok) throw data;
  return data;
};

export const getArchive = async function () {
  const res = await fetch(`${API_URL}/posts/archive`, {
    method: 'GET',
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
