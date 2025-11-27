import styles from '../styles/NewPost.module.css';
import { LabeledInput } from '../../../../packages/ui/Input';
import Button from '../../../../packages/ui/Button';
import Title from '../../../../packages/ui/Title';
import InsertEditor from './InsertEditor';
import api from '../../../../packages/client/index';
import Error from '../../../../packages/ui/Error';
import { useNavigate } from 'react-router';
import { useState, useRef } from 'react';
import { HashLoader } from '../../../../packages/ui/Loader';
import { LoaderCircle } from '../../../../packages/ui/Loader';
import { useParams } from 'react-router';
import { useEffect } from 'react';

function UpdatePost() {
  const { slug } = useParams();
  const [formData, setFormData] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [errors, setErrors] = useState({
    msg: '',
    fields: { title: '', content: '', snippet: '' },
  });

  const navigate = useNavigate();
  const editorRef = useRef(null);

  useEffect(() => {
    const getPost = async () => {
      try {
        const data = await api.getPost(slug);
        setPost(data);
        setFormData({ title: data.title, snippet: data.snippet });
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

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const content = editorRef.current.getContent();

    try {
      const data = { ...formData, content };
      const article = await api.updatePost(post.id, data);
      navigate(`/articles/${article.slug}`, { replace: true });
    } catch (error) {
      const newErrors = {
        ...errors,
        fields: { ...errors.fields },
      };
      newErrors.msg = error.msg || 'A network error encountered.';

      error.formErrors?.forEach((error) => {
        newErrors.fields[error.path] = error.msg;
      });

      setErrors(newErrors);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.newpost_page}>
      <Title>New article</Title>
      {isLoading && <HashLoader color="#000" />}
      {error && <p>{error}</p>}
      {post && (
        <form onSubmit={handleSave} className={styles.article_form} id="title">
          <LabeledInput
            onChange={handleChange}
            value={formData.title}
            label="Article's Title"
            id="title"
          >
            <Error error={errors.fields.title} />
          </LabeledInput>

          <section className={styles.snippet_area}>
            <label htmlFor="snippet">Snippet</label>
            <textarea
              id="snippet"
              value={formData.snippet}
              onChange={handleChange}
              spellCheck="false"
            ></textarea>
            <Error error={errors.fields.snippet} />
          </section>
          <InsertEditor editorRef={editorRef} initialValue={post.content}>
            <Error error={errors.fields.content} />
          </InsertEditor>
          <Error error={errors.msg} />
          <Button type="submit">
            {isSaving ? <LoaderCircle /> : 'Save the article'}
          </Button>
        </form>
      )}
    </div>
  );
}

export default UpdatePost;
