import { login, register, logout } from './auth';
import { getMe } from './user';
import { getPost, getPosts, getArchive } from './post';
import {
  getComments,
  sendComment,
  updateComment,
  deleteComment,
} from './comment';

export default {
  login,
  register,
  getMe,
  getPosts,
  logout,
  getPost,
  getArchive,
  getComments,
  sendComment,
  updateComment,
  deleteComment,
};
