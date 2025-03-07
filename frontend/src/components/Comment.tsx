import { useEffect, useState } from "react";
import MinusIcon from "../assets/icon-minus.svg";
import PlusIcon from "../assets/icon-plus.svg";
import ReplyIcon from "../assets/icon-reply.svg";
import { formatUserAt } from "../helpers/formatUserAt";
import { getComments, getUserById } from "../services/api";
import { type Comment } from "../types/Comments";
import { User } from "../types/Users";

const Comment = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [users, setUsers] = useState<Record<number, User>>({});

  useEffect(() => {
    getComments().then(setComments);
  }, []);

  useEffect(() => {
    const userIds = [...new Set(comments.map((comment) => comment.userId))];
    userIds.forEach((userId) => {
      if (!users[userId]) {
        getUserById(userId).then((userData) => {
          setUsers((prevUsers) => ({
            ...prevUsers,
            [userId]: userData,
          }));
        });
      }
    });
  }, [comments, users]);

  return (
    <div className="flex flex-col p-1 gap-5">
      {comments.map(({ content, score, id, userId, createdAt, replyingTo }) => {
        return (
          <div
            key={id}
            className={`flex w-full flex-col gap-3 p-3  rounded-xl bg-White ${
              replyingTo ? "mx-5 border-l-2 border-Moderate-blue" : ""
            }`}
          >
            <div className="flex items-center gap-10">
              <div className="flex gap-3 items-center">
                <img
                  src={users[userId]?.avatar}
                  alt={`${users[userId]?.username}'s profile picture`}
                  className="w-8 h-8 object-contain"
                />
                <span className="font-medium">{users[userId]?.username}</span>
              </div>
              <span className="text-Grayish-Blue">
                {new Date(createdAt).toLocaleDateString()}
              </span>
            </div>
            <div>
              <p className="text-Grayish-Blue">
                <span className="text-Moderate-blue font-medium">
                  {formatUserAt(replyingTo)}
                </span>{" "}
                {content}
              </p>
            </div>
            <div className="flex items-center justify-between w-full">
              <div className="flex rounded-xl items-center gap-3 px-4 py-1 bg-Light-gray">
                <button className="cursor-pointer">
                  <img
                    src={PlusIcon}
                    alt=""
                    aria-hidden
                    className="object-contain"
                  />
                </button>
                <span className="text-Moderate-blue font-medium">{score}</span>
                <button className="cursor-pointer">
                  <img
                    src={MinusIcon}
                    alt=""
                    aria-hidden
                    className="object-contain"
                  />
                </button>
              </div>
              <button className="cursor-pointer flex gap-2 items-center text-Moderate-blue font-medium">
                <img src={ReplyIcon} alt="" aria-hidden />
                Reply
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Comment;
