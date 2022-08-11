import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react'
import DOMPurify from 'dompurify';

export default function CreateCommunity() {
  const {register} = useAuth();
  const [communityId, setCommunityId] = useState(null);

  function handleCreateCommunity(e) {
    e.preventDefault();
    let communityName = DOMPurify.sanitize(e.target.communityName.value);
    const communityLogo = DOMPurify.sanitize(e.target.communityLogo.value);
    const communitySidebar = DOMPurify.sanitize(e.target.communitySidebar.value);

    communityName = communityName.split(' ').join('');
    axios.post('../api/community', {
      communityName,
      communityLogo,
      communitySidebar
    }).then(({data})=>{
      console.log(data);
      setCommunityId(data);
    })
  }

  function handleCreateAdmin(e) {
    e.preventDefault();
    const isAdmin = true;
    const firstName = e.target.firstName.value;
    const lastName = e.target.lastName.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    const displayName = `${firstName} ${lastName}`;
    register(email, password, displayName, communityId, isAdmin);
  }
  return (
    <div>
      <form onSubmit={handleCreateCommunity}>
        <label htmlFor="communityName">Community Name</label>
        <input type="textbox" id="communityName" />
        <label htmlFor="communityLogo">Community Logo URL</label>
        <input type="textbox" id="communityLogo" />
        <label htmlFor="communitySidebar">Community Sidebar Info</label>
        <textarea id="communitySidebar" />
        <input type="submit" value="Submit" />
      </form>
      <form onSubmit={handleCreateAdmin}>
        <label htmlFor="firstName">First Name</label>
        <input type="textbox" id="firstName" />
        <label htmlFor="lastName">Last Name</label>
        <input type="textbox" id="lastName" />
        <label htmlFor="email">Email</label>
        <input type="email" id="email" />
        <label htmlFor="password">Password</label>
        <input type="password" id="password" />
        <input type="submit" value="Register" />
      </form>
    </div>
  )
}