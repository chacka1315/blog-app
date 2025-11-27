const API_URL = import.meta.env.VITE_API_URL;

const token = localStorage.getItem('jwt');

export const getPosts = async function () {
  const res = await fetch(`${API_URL}/posts`, {
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

export const getPost = async function (slug) {
  const res = await fetch(`${API_URL}/posts/${slug}`, {
    method: 'GET',
    headers: { Authorization: `Bearer ${token}` },
  });

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

export const changePostPublishStatus = async function (newstatus, postid) {
  const res = await fetch(`${API_URL}/posts/${newstatus}/${postid}`, {
    method: 'PUT',
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

export const createPost = async function (formData) {
  const res = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
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

export const updatePost = async function (postid, formData) {
  const res = await fetch(`${API_URL}/posts/${postid}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(formData),
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

export const deletePost = async function (postid) {
  const res = await fetch(`${API_URL}/posts/${postid}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
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
