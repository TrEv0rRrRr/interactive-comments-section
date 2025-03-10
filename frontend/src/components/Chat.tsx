import { useState } from "react";
import { useComments } from "../hooks/useComments";

const Chat = () => {
  const [comment, setComment] = useState("");
  const { addComment } = useComments();

  const handleClick = async () => {
    if (comment.trim() === "") return;

    try {
      const success = await addComment(comment);
      if (success) {
        setComment("");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) =>
    setComment(e.target.value);

  return (
    <div className="flex flex-col bg-White p-5 gap-5 w-full rounded-xl mt-4">
      <textarea
        placeholder="Add a comment..."
        className="border-[1px] border-Grayish-Blue/30 rounded 
        px-5 h-24 py-2 resize-none placeholder:text-Grayish-Blue hover:border-Moderate-blue focus:outline-Moderate-blue active:outline-Moderate-blue transition-all md:hidden"
        value={comment}
        onChange={handleChange}
      />

      <div className="flex justify-between items-center md:gap-5">
        <img
          src="avatars/image-juliusomo.webp"
          alt="Your profile picture"
          className="w-8 h-8 object-contain md:self-start"
        />
        <textarea
          placeholder="Add a comment..."
          className="border-[1px] border-Grayish-Blue/30 rounded 
        px-5 h-24 py-2 resize-none placeholder:text-Grayish-Blue 
        hover:border-Moderate-blue focus:outline-Moderate-blue 
        active:outline-Moderate-blue transition-all w-full hidden md:block md:h-14"
          value={comment}
          onChange={handleChange}
        />
        <button
          className="bg-Moderate-blue text-white font-medium rounded px-5 py-2 cursor-pointer hover:bg-Moderate-blue/40 transition-all md:self-start"
          onClick={handleClick}
        >
          SEND
        </button>
      </div>
    </div>
  );
};

export default Chat;
