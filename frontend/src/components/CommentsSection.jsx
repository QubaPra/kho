import { useState, useEffect } from "react";

function CommentsSection({ comments, onAddComment }) {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = () => {
    if (newComment.trim()) {
      onAddComment(newComment);
      setNewComment("");
    }
  };

  useEffect(() => {
      const textareas = document.querySelectorAll(".auto-resize-textarea");
      textareas.forEach((textarea) => {
        textarea.style.height = "auto";
        textarea.style.height = `${textarea.scrollHeight}px`;
      });
    });

  return (
    <div className="space-y-6 mt-12">
      <h3 className="text-xl font-medium">Komentarze</h3>
      <div className="space-y-4">
        {comments.map((comment, index) => (
          <div key={index} className="space-y-1 w-fit">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {comment.date}
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="font-medium">{comment.author}:</p>
              <p className="whitespace-pre-wrap">{comment.content}</p>
            </div>
          </div>
        ))}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center space-x-2">
            <textarea
              className="auto-resize-textarea resize-none w-full overflow-hidden break-words rounded-lg border border-gray-200 dark:border-gray-700 p-2 focus:outline-none"
              placeholder="Twój komentarz"
              rows={1}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <button
              className="material-symbols-outlined text-blue-600 hover:text-blue-800"
              onClick={handleAddComment}
            >
              send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CommentsSection;