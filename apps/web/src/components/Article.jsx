import styles from '../styles/Article.module.css';
import { Link, useOutletContext, useParams } from 'react-router';
import Title from '../../../../packages/ui/Title';
import { HashLoader } from '../../../../packages/ui/Loader';
import utils from '../../../../packages/utils/index';
import api from '../../../../packages/client/index';
import { useState } from 'react';
import { useEffect } from 'react';
import Button from '../../../../packages/ui/Button';
import { SendHorizontal as SendIcon } from 'lucide-react';
import { CircleUser, SquarePen as EditIcon, Trash, Undo2 } from 'lucide-react';
import { LoaderCircle } from '../../../../packages/ui/Loader';

const Article = function () {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useOutletContext();

  useEffect(() => {
    const getPost = async () => {
      try {
        const data = await api.getPost(slug);
        setPost(data);
        setError(null);
      } catch (error) {
        setPost(null);
        setError(error.msg || 'A network error accountered.');
      } finally {
        setIsLoading(false);
      }
    };

    getPost();
  }, [slug]);

  return (
    <div className={styles.article_page}>
      <Title>{slug}</Title>
      {isLoading && (
        <div className={styles.loading}>
          <HashLoader color="#bf225a" />
        </div>
      )}
      {error && <p>{error}</p>}
      {post && (
        <>
          <section className={styles.article}>
            <p className={styles.date}>
              {utils.formatPostDate(post.publishedAt)}
            </p>
            <h1>{post.title}</h1>
            <div
              dangerouslySetInnerHTML={{ __html: post.content }}
              className={styles.article_content}
            ></div>
          </section>
          <Comments postid={post.id} user={user} />
        </>
      )}
    </div>
  );
};

function Comments({ postid, user }) {
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleCommentChange = (e) => {
    setNewComment(e.target.value);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (newComment.trim().length < 1 || !user) return;

    setIsSending(true);
    try {
      const formData = { content: newComment, authorId: user.id };
      const data = await api.sendComment(postid, formData);
      setNewComment('');
      setComments([data, ...comments]);
    } catch (error) {
      setError(error.msg || 'A network error accountered.');
    } finally {
      setIsSending(false);
    }

    setIsSending(false);
  };

  useEffect(() => {
    const getComments = async () => {
      try {
        const data = await api.getComments(postid);
        setComments(data);
        setError(null);
      } catch (error) {
        setComments([]);
        setError(error.msg || 'A network error accountered.');
      } finally {
        setIsLoading(false);
      }
    };

    getComments();
  }, [postid]);

  const commentsList = comments.map((comment) => {
    return (
      <CommentItem
        comment={comment}
        key={comment.id}
        user={user}
        updateErr={setError}
        updateComments={setComments}
      />
    );
  });

  return (
    <section className={styles.comments}>
      {isLoading && (
        <div className={styles.loading}>
          <HashLoader color="#bf225a" />
        </div>
      )}
      {error && <p>{error}</p>}
      {!user ? (
        <div className={styles.login_to_cmt}>
          <Link to="/login">Sign in</Link> to comment the article.
        </div>
      ) : (
        <form onSubmit={handleCommentSubmit}>
          <textarea
            name="new_comment"
            id="new_comment"
            onChange={handleCommentChange}
            value={newComment}
            spellCheck="false"
            placeholder="Comment the article..."
            className={styles.comment_area}
          ></textarea>
          <Button type="submit">
            {isSending ? <LoaderCircle /> : <SendIcon />}
          </Button>
        </form>
      )}
      <p className={styles.replies}>{comments.length} Comments</p>
      {commentsList?.length ? (
        <div className={styles.comment_list}>
          <div className={styles.comment_hr}></div>
          <div>{commentsList}</div>
        </div>
      ) : (
        <p>No comments yet.</p>
      )}
    </section>
  );
}

const CommentItem = function ({ updateComments, comment, user, updateErr }) {
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState(comment.content);
  const [isSending, setIsSending] = useState(false);

  const handleContentChange = (e) => {
    setContent(e.target.value);
  };

  const handleUdateSubmit = async (e) => {
    e.preventDefault();
    if (content.trim().length < 1 || !user) return;
    setIsSending(true);
    try {
      await api.updateComment(comment.postId, comment.id, { content });
      updateComments((prev) =>
        prev.map((item) => {
          return item.id === comment.id ? { ...comment, content } : item;
        }),
      );
      updateErr(null);
    } catch (error) {
      updateErr(error.msg || 'A network error accountered.');
    } finally {
      setIsEditing(false);
      setIsSending(false);
    }
  };

  const handleEditBtnClick = () => {
    setIsEditing((prev) => !prev);
  };

  const handleDelete = async () => {
    try {
      const deleted = await api.deleteComment(comment.postId, comment.id);
      updateComments((prev) => prev.filter((item) => item.id !== deleted.id));
    } catch (error) {
      updateErr(error.msg || 'An network error encountered.');
    }
  };

  return (
    <CommentCard>
      <div className={styles.infos}>
        <div>
          {comment.user.avatar ? (
            <img src={comment.user.avatar} alt="avatar" />
          ) : (
            <CircleUser />
          )}
          <p className={styles.author}>{comment.user.username}</p>
        </div>
        <p className={styles.date}>
          {utils.formatCommentDate(comment.publishedAt)}
        </p>

        {comment.authorId === user?.id && (
          <div className={styles.crud_btns}>
            <Button onClick={handleEditBtnClick}>
              {isEditing ? <Undo2 /> : <EditIcon />}
            </Button>
            <Button onClick={handleDelete}>
              <Trash />
            </Button>
          </div>
        )}
      </div>
      {isEditing ? (
        <form onSubmit={handleUdateSubmit}>
          <textarea
            name="new_comment"
            id="new_comment"
            onChange={handleContentChange}
            value={content}
            spellCheck="false"
            className={styles.update_comment_area}
          ></textarea>
          <Button type="submit">{isSending ? <LoaderCircle /> : 'OK'}</Button>
        </form>
      ) : (
        <p className={styles.content}>{comment.content}</p>
      )}
    </CommentCard>
  );
};

const CommentCard = function ({ children }) {
  return <div className={styles.comment_card}>{children}</div>;
};

export default Article;
