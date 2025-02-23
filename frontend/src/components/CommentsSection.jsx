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
      <div className="flex items-center space-x-1.5 text-xl mb-4">
        <span className="material-symbols-outlined ">chat</span>
        <span className="text-xl font-medium">Komentarze</span>
      </div>

      <div className="space-y-4">
        {comments.map((comment, index) => (
          <div key={index} className="space-y-1 w-fit">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {comment.created_date}
            </p>
            <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p className="font-medium">{comment.user}:</p>
              <p className="whitespace-pre-wrap">{comment.content}</p>
            </div>
          </div>
        ))}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div className="flex items-center space-x-2">
            <textarea
              className="auto-resize-textarea border-gray-200 dark:border-gray-700"
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
