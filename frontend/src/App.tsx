import Chat from "./components/Chat";
import Comment from "./components/Comment";
import { CommentsProvider } from "./contexts/CommentsProvider";
import ModalProvider from "./contexts/ModalProvider";

function App() {
  return (
    <ModalProvider>
      <CommentsProvider>
        <Comment />
        <Chat />
      </CommentsProvider>
    </ModalProvider>
  );
}

export default App;
