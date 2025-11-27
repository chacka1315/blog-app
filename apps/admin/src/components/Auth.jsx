import styles from '../styles/Auth.module.css';
import Title from '../../../../packages/ui/Title';
import { LabeledInput } from '../../../../packages/ui/Input';
import Button from '../../../../packages/ui/Button';
import { useState } from 'react';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';
import utils from '../../../../packages/utils/index';
import Error from '../../../../packages/ui/Error';
import api from '../../../../packages/client/index';
import { LoaderCircle } from '../../../../packages/ui/Loader';

const Auth = function () {
  const initialForm = { email: '', password: '' };

  const [formData, setFormData] = useState(initialForm);
  const [formErr, setFormErr] = useState({});
  const [pwdIsHide, setPwdIsHide] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const togglePwdView = () => {
    setPwdIsHide((prev) => !prev);
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    const res = utils.validateField(name, value);

    if (!res.isValid) {
      setFormErr({ ...formErr, [name]: res.err });
    } else {
      setFormErr({ ...formErr, [name]: '' });
    }
    setError('');
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await api.login(formData);
      localStorage.setItem('jwt', data.token);
      window.location.replace('/');
    } catch (error) {
      setError(error.msg);
    }
    setIsLoading(false);
  };

  return (
    <main className={styles['main']}>
      <Title>Sign in</Title>
      <div className={styles.login_form}>
        <div className={styles.formHead}>
          <h1>Sign in</h1>
          <div>
            <h2>Admin authentication.</h2>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <LabeledInput
            value={formData.email}
            name="email"
            id="email"
            type="email"
            label="Email"
            onChange={handleChange}
            required
            autoFocus
          >
            {formErr.email && <Error error={formErr.email} />}
          </LabeledInput>
          <LabeledInput
            value={formData.password}
            name="password"
            id="password"
            type={pwdIsHide ? 'password' : 'text'}
            label="Password"
            className={styles.password}
            onChange={handleChange}
            autoComplete="off"
            required
          >
            {formErr.password && <Error error={formErr.password} />}
            <Button
              className={styles.toggle_pwd_view}
              type="button"
              onClick={togglePwdView}
            >
              {pwdIsHide ? <Eye /> : <EyeOff />}
            </Button>
          </LabeledInput>
          {error && <Error error={error} />}
          <Button className={styles.submit_btn} type="submit">
            {isLoading ? <LoaderCircle /> : 'Sign in'}
          </Button>
        </form>
      </div>
    </main>
  );
};

export default Auth;
