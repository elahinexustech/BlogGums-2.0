import React, { useEffect, useState } from 'react';
import NavigationMenu from '../../components/NavigationMenu/NavigationMenu';
import { USER_DATA, SERVER, PORT, ACCESS_TOKEN } from '../../_CONSTS_';
import UILoader from '../../components/UILoader/UILoader';
import MarkdownViewer from '../PostView/MDDisplayer';

import './style.css';
import PIC from './pic.png';

const ProfileView = () => {
  const { user } = JSON.parse(localStorage.getItem(USER_DATA));
  const [post, setPost] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserPost = async () => {
    try {
      const response = await fetch(`${SERVER}:${PORT}/blogs/getuserposts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user posts');
      }

      const resp = await response.json();
      setPost(resp.post);
    }
    catch (error) {
      console.error("Error fetching posts:", error);
    }
    finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getUserPost();
    console.log(post);
  }, []);

  return (
    <>
      <NavigationMenu />

      <div className="container flex direction-col">
        <div className="profile-header obj flex direction-col">
          <img src={PIC} className='profile-img' alt={`${user.username}'s image`} />
          <br /><br /><br />
          <p className="subtitle">{user.first_name} {user.last_name}</p>
          <p className="heading grey">@{user.username}</p>
          <br /><br />
          <table>
            <thead>
              <tr>
                <th className='grey'>DOB</th>
                <th className='grey'>POSTS</th>
                <th className='grey'>CONTACT</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>None</td>
                <td>{post.length}</td>
                <td>{user.email}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <br />
        <div className="profile-body grid cols-3 gap-2">
          {
            (post.length > 0) ? (
              post.map((item) => (
                <div className="obj post flex" key={item.id}>
                  <p className="heading">{item.title}</p>
                </div>
              ))
            ) : <UILoader />
          }
        </div>
      </div>
    </>
  );
};

export default ProfileView;
