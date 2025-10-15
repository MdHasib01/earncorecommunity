import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Post, UserLikedPost } from "./types";

interface LikesState {
  likedPostIds: Record<string, boolean>;
  likedPosts: UserLikedPost[];
  isInitialized: boolean;
}

const initialState: LikesState = {
  likedPostIds: {},
  likedPosts: [],
  isInitialized: false,
};

const likesSlice = createSlice({
  name: "likes",
  initialState,
  reducers: {
    setLikedPosts(state, action: PayloadAction<UserLikedPost[]>) {
      const items = action.payload ?? [];
      state.likedPosts = items;
      state.likedPostIds = {};

      for (const entry of items) {
        const postId = entry?.post?._id;
        if (postId) {
          state.likedPostIds[postId] = true;
        }
      }

      state.isInitialized = true;
    },
    upsertLikedPost(
      state,
      action: PayloadAction<{ postId: string; liked: boolean; post?: Post }>
    ) {
      const { postId, liked, post } = action.payload;

      if (liked) {
        state.likedPostIds[postId] = true;

        if (post) {
          const existingIndex = state.likedPosts.findIndex(
            (item) => item?.post?._id === postId
          );

          if (existingIndex === -1) {
            state.likedPosts.unshift({
              _id: `local-${postId}`,
              likedBy: "",
              post,
            });
          } else {
            state.likedPosts[existingIndex] = {
              ...state.likedPosts[existingIndex],
              post,
            };
          }
        }
      } else {
        delete state.likedPostIds[postId];
        state.likedPosts = state.likedPosts.filter(
          (item) => item?.post?._id !== postId
        );
      }
    },
    resetLikesState(state) {
      state.likedPostIds = {};
      state.likedPosts = [];
      state.isInitialized = false;
    },
  },
});

export const { setLikedPosts, upsertLikedPost, resetLikesState } =
  likesSlice.actions;

export default likesSlice.reducer;
