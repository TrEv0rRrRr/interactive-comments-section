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
