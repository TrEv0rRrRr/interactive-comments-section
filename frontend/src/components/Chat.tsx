import { useState } from "react";
import { createComment } from "../services/api";

const Chat = () => {
  const [comment, setComment] = useState("");

  const handleClick = async () => {
    if (comment.trim() === "") return;

    try {
      await createComment(comment);
      setComment("");
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setComment(e.target.value);

  return (
    <div className="flex flex-col bg-White p-5 gap-5 w-full">
      <textarea
        placeholder="Add a comment..."
        className="border-[1px] border-Grayish-Blue/30 rounded 
        px-5 h-24 py-2 resize-none placeholder:text-Grayish-Blue hover:border-Moderate-blue focus:outline-Moderate-blue active:outline-Moderate-blue transition-all"
        value={comment}
        onChange={handleChange}
      />

      <div className="flex justify-between items-center">
        <img
          src="avatars/image-juliusomo.webp"
          alt="Your profile picture"
          className="w-8 h-8 object-contain"
        />
        <button
          className="bg-Moderate-blue text-white font-medium rounded px-5 py-2 cursor-pointer hover:bg-Moderate-blue/40 transition-all"
          onClick={handleClick}
        >
          SEND
        </button>
      </div>
    </div>
  );
};

export default Chat;
