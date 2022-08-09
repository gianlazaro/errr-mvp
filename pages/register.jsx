import { useAuth } from '../contexts/AuthContext';
import { db } from '../config/firebase'

export default function Register() {
  const { register } = useAuth();
  function handleSubmit(e) {
    e.preventDefault();
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const displayName = `${firstName} ${lastName}`
    const communityId = e.target.communityId.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    // if community code doesn't exist, don't register
    register(email, password, displayName, communityId);
    e.target.reset();
  }

  return (
    <>
    <h1>register</h1>
    <form onSubmit={handleSubmit}>
      <label htmlFor="firstName">First Name</label>
      <input type="textbox" id="firstName"/>
      <label htmlFor="lastName">Last Name</label>
      <input type="textbox" id="lastName"/>
      <label htmlFor="communityId">Community Code</label>
      <input type="textbox" id="communityId"/>
      <label htmlFor="email">Email</label>
      <input type="email" id="email"/>
      <label htmlFor="password">Password</label>
      <input type="password" id="password"/>
      <input type="submit" value="Register"/>
    </form>
    </>
  )
}