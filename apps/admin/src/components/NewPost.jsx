import styles from '../styles/NewPost.module.css';
import { LabeledInput } from '../../../../packages/ui/Input';
import Button from '../../../../packages/ui/Button';
import Title from '../../../../packages/ui/Title';
import InsertEditor from './InsertEditor';
import api from '../../../../packages/client/index';
import Error from '../../../../packages/ui/Error';
import { useNavigate } from 'react-router';
import { useState, useRef } from 'react';
import { LoaderCircle } from '../../../../packages/ui/Loader';

function NewPost() {
  const [formData, setFormData] = useState({ title: '', snippet: '' });
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({
    msg: '',
    fields: { title: '', content: '', snippet: '' },
  });
  const navigate = useNavigate();
  const editorRef = useRef(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    const content = editorRef.current.getContent();

    try {
      const data = { ...formData, content };
      const article = await api.createPost(data);
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

  const editorInitialValue = '<h2>New article...</h2>';
  return (
    <div className={styles.newpost_page}>
      <Title>New article</Title>
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
        <InsertEditor editorRef={editorRef} initialValue={editorInitialValue}>
          <Error error={errors.fields.content} />
        </InsertEditor>
        <Error error={errors.msg} />
        <Button type="submit">
          {isSaving ? <LoaderCircle /> : 'Save the article'}
        </Button>
      </form>
    </div>
  );
}

export default NewPost;
