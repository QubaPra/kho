const resizeTextareas = () => {
  const textareas = document.querySelectorAll(".auto-resize-textarea");
    textareas.forEach((textarea) => {
      textarea.style.height = "auto";
      textarea.style.height = `${textarea.scrollHeight}px`;
    });  
};

export default resizeTextareas;