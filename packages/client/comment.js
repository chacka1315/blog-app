const API_URL = import.meta.env.VITE_API_URL;
const token = localStorage.getItem('jwt');

export const getComments = async function (postid) {
  const res = await fetch(`${API_URL}/posts/${postid}/comments`, {
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

export const sendComment = async function (postId, formData) {
  const res = await fetch(`${API_URL}/posts/${postId}/comments`, {
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
    throw new Error('An arror occured.');
  }

  if (!res.ok) throw data;

  return data;
};

export const deleteComment = async function (postId, commentId) {
  const res = await fetch(`${API_URL}/posts/${postId}/comments/${commentId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    method: 'DELETE',
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

export const updateComment = async function (postId, commentId, content) {
  const res = await fetch(`${API_URL}/posts/${postId}/comments/${commentId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    method: 'PUT',
    body: JSON.stringify(content),
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
