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
    <div class="space-y-6 mt-12">
      <div class="flex items-center space-x-1.5 text-xl mb-4">
        <span class="material-symbols-outlined ">chat</span>
        <span class="text-xl font-medium">Komentarze</span>
      </div>

      <div class="space-y-4">
        {comments.map((comment, index) => (
          <div key={index} class="space-y-1 w-fit">
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {comment.date}
            </p>
            <div class="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              <p class="font-medium">{comment.author}:</p>
              <p class="whitespace-pre-wrap">{comment.content}</p>
            </div>
          </div>
        ))}
        <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
          <div class="flex items-center space-x-2">
            <textarea
              class="auto-resize-textarea border-gray-200 dark:border-gray-700"
              placeholder="Twój komentarz"
              rows={1}
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <button
              class="material-symbols-outlined text-blue-600 hover:text-blue-800"
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
