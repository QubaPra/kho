import { useState, useEffect, useRef } from "react";
import axios from "../api/axios";

function CommentsSection({ comments, trialId }) {
  const [formattedComments, setFormattedComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    const formatComments = comments.map((comment) => {
      const formattedDate = new Intl.DateTimeFormat("pl-PL", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(new Date(comment.created_date));
      return {
        ...comment,
        created_date: formattedDate,
        
      };
    });
    setFormattedComments(formatComments);
  }, [comments]);  

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try {
        const response = await axios.post("/comments/", {
          content: newComment,
          trial: trialId,
        });

        const newCommentData = {
          ...response.data,
          created_date: new Intl.DateTimeFormat("pl-PL", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }).format(new Date(response.data.created_date))
        };

        setFormattedComments([...formattedComments, newCommentData]);
        setNewComment("");
      } catch (error) {
        console.error("Błąd podczas dodawania komentarza:", error);
      }
    }
  };

  useEffect(() => {
    const textareas = document.querySelectorAll(".auto-resize-textarea");
    textareas.forEach((textarea) => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    });
  }, [newComment]);

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = scrollContainerRef.current.scrollHeight
    }
  }, [formattedComments]);

  return (
    <div className="space-y-6 mt-12">
      <div className="flex items-center space-x-1.5 text-xl mb-4">
        <span className="material-symbols-outlined ">chat</span>
        <span className="text-xl font-medium">Komentarze</span>
      </div>
  
      <div className="space-y-4 max-h-96 overflow-y-auto" ref={scrollContainerRef}>
        {formattedComments.map((comment, index) => (
          <div key={index} className="space-y-1 w-fit max-w-11/12">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {comment.created_date}
          </p>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
            <p className="font-medium">{comment.user}:</p>
            <p className="whitespace-pre-wrap break-words">{comment.content}</p>
          </div>
        </div>
        ))}
        
      </div>
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
  );
}

export default CommentsSection;
