import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

import Comment from "../components/post/Comment.jsx"
import Post from "../components/post/Post.jsx";
import MainLayout from "../layouts/MainLayout.jsx";

function PostDetail() {
  const { id } = useParams();
  const feed = useSelector((state) => state?.post?.feed);

  const thread =
    feed &&
    feed.find((f) => {
      return f._id == id;
    });

  if (!thread) {
    // Handle the case where thread is not found
    return <p>Post not found</p>;
  }

  return (
    <MainLayout>
      <div>
        <Post key={thread._id} post={thread} />
        {
            thread.replies && thread.replies.length > 0 ? thread.replies.map((reply, idx) => (
                <Comment key={reply._id} reply={reply} index={idx} totalLength={thread.replies.length} postId={id} />
            )) : null
        }
      </div>
    </MainLayout>
  );
}

export default PostDetail;
