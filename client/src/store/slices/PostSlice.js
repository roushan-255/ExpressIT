import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

import axiosInstance from "../../helpers/AxiosInstance";

// function to create promise toast
const promiseToast = async (promise, options) => {
  return toast.promise(
    promise,
    {
      loading: options.loading,
      success: options.success,
      error: options.error,
    },
    {
      duration: 1000,
      style: {
        borderRadius: "4px",
        background: "#000",
        color: "#fff",
        fontSize: "16px",
        padding: "10px 30px",
      },
    }
  );
};

// Thunk function to delete comment
export const deleteComment = createAsyncThunk(
  "/post/comment-delete",
  async (data) => {
    try {
      const res = axiosInstance.delete(
        `/posts/comment/${data.postId}/${data.commentId}`
      );

      promiseToast(res, {
        loading: "Deleting comment...",
        success: "Comment deleted",
        error: "Failed to delete comment",
      });

      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);

// Thunk function to drop reply or comment on Post
export const dropComment = createAsyncThunk(
  "/post/drop-comment",
  async (data) => {
    try {
      const res = axiosInstance.post(`/posts/reply/${data.postId}`, {
        comment: data.comment,
      });

      promiseToast(res, {
        loading: "Adding...",
        success: "Replied successfully",
        error: "Failed to reply",
      });

      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  }
);
// Thunk function to drop like on thread
export const likeUnlikePost = createAsyncThunk(
  "/post/like-unlike",
  async (postId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/posts/like-unlike/${postId}`);

      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

// Thunk function to repost the thread
export const Savepost = createAsyncThunk(
  "/post/repost",
  async (postId) => {
    try {
      const res = await axiosInstance.get(`/posts/repost/${postId}`);
      return res.data;
    } catch (error) {
      toast.error(error?.resposne?.data?.message);
    }
  }
);

// Thunk function to get user feed
export const getFeed = createAsyncThunk(
  "/post/feed",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/posts/feed");
      return res.data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

// Thunk function delete thread
export const deletePost = createAsyncThunk(
  "/post/delete",
  async (threadId, { rejectWithValue }) => {
    try {
      const res = axiosInstance.delete(`/posts/${threadId}`);

      promiseToast(res, {
        loading: "deleting...",
        success: "Post deleted successfully",
        error: "Post deletion failed",
      });

      return (await res).data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

// Thunk function to edit thread
export const editPost = createAsyncThunk(
  "/post/edit",
  async ({ data, threadId }, { rejectWithValue }) => {
    try {
      const res = axiosInstance.put(`/posts/${threadId}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      promiseToast(res, {
        loading: "Posting...",
        success: "Posted",
        error: "Posting failed",
      });

      return (await res).data;
    } catch (error) {
      toast.error(error?.response?.data?.message);
       return rejectWithValue(error?.response?.data?.message);
    }
  }
);

// Thunk function to create new thread
export const createPost = createAsyncThunk(
  "/post/create",
  async (data, { rejectWithValue }) => {
    try {
      const res = axiosInstance.post("/posts", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      promiseToast(res, {
        loading: "Posting...",
        success: "Posted",
        error: "Posting failed",
      });

      return (await res).data;
    } catch (error) {
      return rejectWithValue(error?.response?.data?.message);
    }
  }
);

const initialState = {
  feed: localStorage.getItem("feed")
    ? JSON.parse(localStorage.getItem("feed"))
    : [],
  loading: false,
  error: null,
};

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    setFeed: (state, action) => {
      state.feed = action.payload;
    },

    clearpostSlice: (state) => {
      state.feed = [];
      state.followingFeed = [];
      state.loading = false;
      state.error = null;
    },

    clearErrors: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.loading = true;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        localStorage.setItem("feed", JSON.stringify(action.payload.feed));
        state.loading = false;
        state.feed = action.payload.feed;
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearErrors, clearpostSlice, setFeed } = postSlice.actions;
export default postSlice.reducer;
