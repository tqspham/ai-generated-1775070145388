"use client";

import React, { useState, useEffect } from "react";

type Post = {
  id: number;
  title: string;
  body: string;
  likes: number;
  comments: string[];
};

type User = {
  name: string;
  email: string;
  profilePicture: string;
};

const App = () => {
  const [view, setView] = useState<"login" | "timeline" | "profile">("login");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [credentials, setCredentials] = useState<{ email: string; password: string }>({ email: "", password: "" });

  useEffect(() => {
    if (view === "timeline") {
      fetchPosts();
    }
  }, [view]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/posts");
      if (!response.ok) throw new Error("Network response was not ok");
      const data: Post[] = await response.json();
      setPosts(data.reverse());
      setError(null);
    } catch (err) {
      setError("Failed to load posts. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      setUser({ name: "John Doe", email: credentials.email, profilePicture: "https://loremflickr.com/320/240" });
      setCredentials({ email: "", password: "" });
      setView("timeline");
      setLoading(false);
    }, 1000);
  };

  const handleLike = (postId: number) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === postId ? { ...post, likes: post.likes + 1 } : post))
    );
  };

  const handleComment = (postId: number, comment: string) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) => (post.id === postId ? { ...post, comments: [...post.comments, comment] } : post))
    );
  };

  const handleProfileUpdate = (updatedUser: User) => {
    setUser(updatedUser);
  };

  const renderLogin = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Login</h1>
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
        className="mb-2 p-2 border border-gray-300 rounded"
      />
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        className="mb-4 p-2 border border-gray-300 rounded"
      />
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded">
        {loading ? "Loading..." : "Login"}
      </button>
      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );

  const renderTimeline = () => (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Timeline</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : posts.length === 0 ? (
        <div>No posts available.</div>
      ) : (
        <ul>
          {posts.map((post) => (
            <li key={post.id} className="mb-4 p-4 border border-gray-300 rounded">
              <h2 className="font-bold">{post.title}</h2>
              <p>{post.body}</p>
              <button onClick={() => handleLike(post.id)} className="text-blue-500">
                Like ({post.likes})
              </button>
              <button onClick={() => handleComment(post.id, "Nice post!")} className="ml-2 text-green-500">
                Comment
              </button>
              <ul>
                {post.comments.map((comment, index) => (
                  <li key={index} className="text-gray-600">
                    {comment}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  const renderProfile = () => (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Profile</h1>
      {loading ? (
        <div className="flex justify-center items-center h-64">Loading...</div>
      ) : error ? (
        <div className="text-red-500">{error}</div>
      ) : user ? (
        <div>
          <img src={user.profilePicture} alt="Profile" className="w-32 h-32 rounded-full mb-4" />
          <h2 className="font-bold">{user.name}</h2>
          <p>{user.email}</p>
          <button
            onClick={() => handleProfileUpdate({ ...user, name: "Jane Doe" })}
            className="mt-4 bg-green-500 text-white p-2 rounded"
          >
            Update Profile
          </button>
        </div>
      ) : (
        <div>No user information available.</div>
      )}
    </div>
  );

  return (
    <div>
      {view === "login" && renderLogin()}
      {view === "timeline" && renderTimeline()}
      {view === "profile" && renderProfile()}
    </div>
  );
};

export default App;