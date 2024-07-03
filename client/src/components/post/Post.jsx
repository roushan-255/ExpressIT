import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import ReactTimeAgo from "react-time-ago";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en.json";

import verifiedTick from "../../assets/verified.png";
import { useAuth } from "../../hooks/useAuth";
import { deletePost, setFeed } from "../../store/slices/PostSlice";
import Dropdown from "../Dropdown";
import PostActions from "./PostActions";

// setup javascript-time-ago library
TimeAgo.addLocale(en);

function Post({ isVerified, post, className = "", isActiveTab }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const imageRef = useRef(null);
  const [lineHeight, setLineHeight] = useState(0);
  const { data } = useAuth();
  const feedPosts = useSelector((state) => state.post.feed); // Corrected state access

  useEffect(() => {
    const calculateLineHeight = () => {
      if (imageRef.current) {
        const imageHeight = imageRef.current.getBoundingClientRect().height;
        setLineHeight(imageHeight);
      } else {
        setLineHeight(34);
      }
    };

    calculateLineHeight();
    const handleResize = () => calculateLineHeight();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [imageRef, isActiveTab]);

  if (!post || !post.postedBy) {
    return <h1 className="dark:text-white text-lg">Sorry, post not available</h1>;
  }

  const username = post.postedBy.username;

  const handleDeletePost = () => {
    const isDelete = window.confirm("Are you sure you want to delete this post?");
    if (isDelete) {
      const updatedPosts = feedPosts.filter((p) => p._id !== post._id);
      dispatch(deletePost(post._id));
      dispatch(setFeed(updatedPosts));
    }
  };

  const handleEditPost = () => {
    navigate("/edit-Post", { state: post });
  };

  return (
    <div className={`grid grid-cols-[1fr_6fr] gap-2 mx-1 p-3 py-4 sm:p-6 bg-transparent border-b border-dark-text sm:mx-auto ${className}`}>
      {post && (
        <div className="Post_line_container">
          <div className="flex flex-col items-center gap-4">
            <div className="flex-shrink-0">
              {post.postedBy && post.postedBy.avatar && (
                <img
                  src={post.postedBy.avatar.secure_url}
                  alt="Avatar"
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full"
                />
              )}
            </div>
            <div style={{ height: lineHeight + "px", width: "1.9px", background: "gray" }}></div>
            <div className="relative bg-transparent w-full">
              {post.replies.length === 0 && (
                <span className="w-6 h-6 rounded-full absolute top-0 left-1/2 transform -translate-x-1/2">🥱</span>
              )}
              {post.replies.slice(0, 3).map((reply, index) => (
                <img
                  key={index}
                  className={`w-5 h-5 rounded-full absolute top-${index === 0 ? "0" : "full"} left-${index === 0 ? "1/2" : index === 1 ? "1/4" : "3/4"} transform -translate-x-1/2 -translate-y-1/2`}
                  src={reply.userAvatar}
                  alt="Avatar"
                />
              ))}
            </div>
          </div>
        </div>
      )}

      <div>
        <div className="flex items-center justify-between">
          <div className="flex gap-1 items-center mb-2">
            <Link to={`/${username}/user/${post.postedBy._id}`} className="font-medium tracking-normal dark:text-white cursor-pointer hover:underline">
              {post.postedBy.username}
            </Link>
            {isVerified && <img className="w-4" src={verifiedTick} alt="verified-tick" />}
          </div>
          <div className="text-dark-text text-sm font-medium flex items-center justify-center gap-3">
            <ReactTimeAgo date={new Date(post.createdAt).getTime()} locale="en-US" timeStyle="twitter" />
            {data.username === username && <Dropdown onDelete={handleDeletePost} onEdit={handleEditPost} />}
          </div>
        </div>

        {post.content && <p className="dark:text-white mb-2">{post.content}</p>}

        {post.thumbnail && (
          <Link to={`/${username}/Post/${post._id}`}>
            <img ref={imageRef} className="rounded-lg border border-dark-text max-h-[400px] mb-2 cursor-pointer" src={post.thumbnail.secure_url} alt="thumbnail" />
          </Link>
        )}

        <PostActions post={post} />

        <div className="h-6 text-gray-500 flex items-center justify-start gap-2">
          {post.replies.length > 0 && (
            <Link to={`/${username}/Post/${post._id}`} className="cursor-pointer hover:underline">
              {post.replies.length} {post.replies.length === 1 ? "reply" : "replies"}
            </Link>
          )}

          {post.replies.length > 0 && post.likes.length > 0 && <span>.</span>}

          {post.likes.length > 0 && (
            <Link to={`/${username}/Post/${post._id}`} className="cursor-pointer hover:underline">
              {post.likes.length} like{post.likes.length > 1 ? "s" : ""}
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default Post;
