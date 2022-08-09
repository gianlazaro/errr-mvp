import { useAuth } from '../contexts/AuthContext.jsx';

export default function login() {
  const {user, signIn} = useAuth();
  function handleSubmit(e) {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    signIn(email, password);
  }
  return (
    <form onSubmit={handleSubmit}>
      <input type="email" id="email" placeholder="email"/>
      <input type="password" id="password" placeholder="password"/>
      <button type="submit">Login</button>
    </form>
  )
}