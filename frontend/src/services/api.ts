import axios from "axios";
import { Comment } from "../types/Comments";
import { User } from "../types/Users";

const API_COMMENTS_URL = "http://localhost:3000/comments";
const API_USERS_URL = "http://localhost:3000/users";

/**
 * Fetches comments from the API.
 *
 * @returns {Promise<Comment[]>} A promise that resolves to an array of comments.
 * @throws Will throw an error if the request fails.
 */
export const getComments = async (): Promise<Comment[]> => {
  try {
    const response = await axios(API_COMMENTS_URL);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Fetches the list of users from the API.
 *
 * @returns {Promise<User[]>} A promise that resolves to an array of User objects.
 * @throws Will throw an error if the request fails.
 */
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await axios(API_USERS_URL);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Fetches a user by their ID.
 *
 * @param {number} id - The ID of the user to fetch.
 * @returns {Promise<User>} A promise that resolves to the user data.
 * @throws Will throw an error if the request fails.
 */
export const getUserById = async (id: number): Promise<User> => {
  try {
    const response = await axios(`${API_USERS_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Creates a new comment with the given content.
 *
 * @param {string} content - The content of the comment.
 * @param {Object} options - Additional options for the comment.
 * @param {number} options.userId - ID of the user creating the comment.
 * @param {number} [options.parentId] - ID of the parent comment (for replies).
 * @param {string} [options.replyingTo] - Username of the user being replied to.
 * @returns {Promise<Comment>} A promise that resolves to the created comment.
 * @throws Will throw an error if the request fails.
 */
export const createComment = async (
  content: string,
  options: {
    userId?: number;
    parentId?: number;
    replyingTo?: string;
  } = { userId: 25 }
): Promise<Comment> => {
  try {
    const response = await axios.post(API_COMMENTS_URL, {
      content,
      score: 0,
      userId: options.userId || 25,
      parentId: options.parentId,
      replyingTo: options.replyingTo,
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Deletes a comment by its ID.
 *
 * @param {number} id - The ID of the comment to delete.
 * @returns {Promise<any>} A promise that resolves with the response data.
 * @throws Will throw an error if the request fails.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteComment = async (id: number): Promise<any> => {
  try {
    const response = await axios.delete(`${API_COMMENTS_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

/**
 * Edits an existing comment with the specified updates.
 *
 * @param id - The unique identifier of the comment to be edited.
 * @param updates - An object containing the fields to be updated.
 *                  Fields that can be updated include:
 *                  - `content` (optional): The new content of the comment.
 *                  - `score` (optional): The new score of the comment.
 *                  - `replyingTo` (optional): The username of the user being replied to, or null if not replying to anyone.
 * @returns A promise that resolves to the updated comment.
 * @throws Will throw an error if the request fails.
 */
export const editComment = async (
  id: number,
  updates: { content?: string; score?: number; replyingTo?: string | null }
): Promise<Comment> => {
  try {
    const validUpdates = Object.fromEntries(
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    );
    const response = await axios.patch(
      `${API_COMMENTS_URL}/${id}`,
      validUpdates
    );
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};
