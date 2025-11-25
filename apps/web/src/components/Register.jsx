import styles from '../styles/Register.module.css';
import Title from '../../../../packages/ui/Title';
import { Link } from 'react-router';
import { LabeledInput } from '../../../../packages/ui/Input';
import Button from '../../../../packages/ui/Button';
import { useState } from 'react';
import { Eye, EyeOff, ChevronLeft } from 'lucide-react';
import utils from '../../../../packages/utils/index';
import Error from '../../../../packages/ui/Error';
import api from '../../../../packages/client/index';
import { LoaderCircle } from '../../../../packages/ui/Loader';
import { useNavigate } from 'react-router';

const Register = function () {
  const initialForm = {
    email: '',
    password: '',
    password_confirmation: '',
    username: '',
  };

  const [formData, setFormData] = useState(initialForm);
  const [formErr, setFormErr] = useState({});
  const [pwdIsHide, setPwdIsHide] = useState(true);
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const togglePwdView = () => {
    setPwdIsHide((prev) => !prev);
  };

  const handleChange = (e) => {
    const { value, name } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name !== 'password_confirmation' && name !== 'avatar') {
      const res = utils.validateField(name, value);

      if (!res.isValid) {
        setFormErr({ ...formErr, [name]: res.err });
      } else {
        setFormErr({ ...formErr, [name]: '' });
      }
    }

    if (name === 'password_confirmation') {
      const pwdMatch = utils.checkConfirmationPwd(formData.password, value);

      if (!pwdMatch.isValid) {
        setFormErr({ ...formErr, [name]: pwdMatch.err });
      } else {
        setFormErr({ ...formErr, [name]: '' });
      }
    }
  };

  const handleAvatarChange = (e) => {
    const selected = e.target.files[0];
    if (selected) {
      const res = utils.validateField('avatar', selected);
      setFormErr({ ...formErr, avatar: res.err });
      setAvatar(selected);

      if (res.isValid) {
        const reader = new FileReader();
        reader.onloadend = () => setAvatarPreview(reader.result);
        reader.readAsDataURL(selected);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const registerData = new FormData();

    Object.keys(formData).forEach((key) => {
      registerData.append(key, formData[key]);
    });

    registerData.append('avatar', avatar);

    try {
      await api.register(registerData);
      navigate('/login', { replace: true });
    } catch (error) {
      const serverErrs = {};
      error.formErrors.forEach((field) => (serverErrs[field.path] = field.msg));
      setFormErr(serverErrs);
    }
    setIsLoading(false);
  };

  return (
    <main className={styles['main']}>
      <Title>Sign up</Title>
      <Link to="/" className={styles.home_link}>
        <ChevronLeft />
        Siaka
      </Link>
      <div className={styles.register_form}>
        <div className={styles.formHead}>
          <h1>Sign in</h1>
          <div>
            <p>Sign in for more...</p>
            <p>
              Already have account? <Link to="/login">Sign in</Link>
            </p>
          </div>
        </div>
        <form encType="multipart/form-data" onSubmit={handleSubmit}>
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
            value={formData.username}
            name="username"
            id="username"
            label="Username"
            onChange={handleChange}
            required
          >
            {formErr.username && <Error error={formErr.username} />}
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
          <LabeledInput
            value={formData.password_confirmation}
            name="password_confirmation"
            id="password_confirmation"
            type={pwdIsHide ? 'password' : 'text'}
            label="Confirm your passsword"
            className={styles.password}
            onChange={handleChange}
            autoComplete="off"
            required
          >
            {formErr.password_confirmation && (
              <Error error={formErr.password_confirmation} />
            )}
          </LabeledInput>
          <LabeledInput
            type="file"
            name="avatar"
            id="avatar"
            accept="image/*"
            onChange={handleAvatarChange}
            label="Profile picture(optional)"
            className={styles.file_select}
          >
            {formErr.avatar && <Error error={formErr.avatar} />}
            {avatar && (
              <p>
                Size : {Math.round((avatar.size / 1024 / 1024) * 100) / 100} Mb
              </p>
            )}
            {avatarPreview && (
              <div className={styles.avatar}>
                <img src={avatarPreview} alt="avatar preview" />
              </div>
            )}
          </LabeledInput>

          <Button
            className={styles.submit_btn}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <LoaderCircle /> : 'Create account'}
          </Button>
        </form>
      </div>
    </main>
  );
};

export default Register;
