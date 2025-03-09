import Chat from "./components/Chat";
import Comment from "./components/Comment";
import { CommentsProvider } from "./contexts/CommentsProvider";

function App() {
  return (
    <CommentsProvider>
      <Comment />
      <Chat />
    </CommentsProvider>
  );
}

export default App;
