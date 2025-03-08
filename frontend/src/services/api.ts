import axios from "axios";
import { Comment } from "../types/Comments";
import { User } from "../types/Users";

const API_COMMENTS_URL = "http://localhost:3000/comments";
const API_USERS_URL = "http://localhost:3000/users";

/**
 * Fetches comments data from the API.
 *
 * @returns {Promise<Comment>} A promise that resolves to the comments data.
 */
export const getComments = async (): Promise<Comment[]> => {
  const response = await axios(API_COMMENTS_URL);
  return response.data;
};

/**
 * Fetches the list of users from the API.
 *
 * @returns {Promise<User[]>} A promise that resolves to an array of User objects.
 */
export const getUsers = async (): Promise<User[]> => {
  const response = await axios(API_USERS_URL);
  return response.data;
};

/**
 * Fetches a user by their ID.
 *
 * @param id - The ID of the user to fetch.
 * @returns A promise that resolves to an array of User objects.
 */
export const getUserById = async (id: number): Promise<User> => {
  const response = await axios(`${API_USERS_URL}/${id}`);
  return response.data;
};

/**
 * Creates a new comment with the specified content.
 *
 * @param {string} content - The content of the comment to be created.
 * @returns {Promise<Comment>} A promise that resolves to the created comment.
 *
 * @throws {Error} If the request fails.
 */
export const createComment = async (content: string): Promise<Comment> => {
  const response = await axios.post(API_COMMENTS_URL, {
    content,
    score: 0,
    userId: 25,
  });
  return response.data;
};

/**
 * Deletes a comment by its ID.
 *
 * @param {number} id - The ID of the comment to delete.
 * @returns {Promise<any>} A promise that resolves to the response data from the delete request.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const deleteComment = async (id: number): Promise<any> => {
  const response = await axios.delete(`${API_COMMENTS_URL}/${id}`);
  return response.data;
};

/**
 * Edits a comment with the specified updates.
 *
 * @param id - The ID of the comment to edit.
 * @param updates - An object containing the updates to apply to the comment.
 * @param updates.content - The new content of the comment (optional).
 * @param updates.score - The new score of the comment (optional).
 * @returns A promise that resolves to the updated comment.
 * @throws Will throw an error if the request fails.
 */
export const editComment = async (
  id: number,
  updates: { content?: string; score?: number }
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
