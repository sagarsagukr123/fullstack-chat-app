import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X } from "lucide-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");//msg typed in input field
  const [imagePreview, setImagePreview] = useState(null);// selected img displayed just above chat we can remove or sent
  const fileInputRef = useRef(null);// ref for file input field
  const { sendMessage } = useChatStore();// call our endpoint

  // Function to handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };
// Function to remove the selected image
  // when we click on x button it removes the image and clears the input field
  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    //
  };
// Function to handle sending the message
  // when we click on send button (submit form)it sends the message and clears the input field
  // sendMessage is a function that sends the message to the server(endpoint)
  // it takes an object with text and image properties
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!text.trim() && !imagePreview) return;
    // if no text and no image then do nothing


    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });


      // Clear text and image preview after sending
      // Clear form
      setText("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      // Clear file input value
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  return (
    <div className="p-4 w-full">
      {imagePreview && (
        <div className="mb-3 flex items-center gap-2">
          <div className="relative">
            {/* Display the selected image preview */}
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-lg border border-zinc-700"
            />
            
            {/* when we click on x button it removes the image and clears the input field */}
            <button
              onClick={removeImage}
              className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-base-300
              flex items-center justify-center"
              type="button"
            >
              {/* X icon to remove the image */}
              <X className="size-3" />
            </button>
          </div>
        </div>
      )}
      {/* Form to send message and image */}
      {/* when we click on send button it sends the message and clears the input field */}
      <form onSubmit={handleSendMessage} className="flex items-center gap-2">
        <div className="flex-1 flex gap-2">
          {/* Input field for text message */}
          <input
            type="text"
            className="w-full input input-bordered rounded-lg input-sm sm:input-md"
            placeholder="Type a message..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          {/* Hidden file input for image selection */}
          {/* when we click on send button it sends the message and clears the input field */}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageChange}
          />

          {/* choose file hidden by photo icon (upload button) bcoz its ugly(large) on Ui*/}
          <button
            type="button"
            className={`hidden sm:flex btn btn-circle
                     ${imagePreview ? "text-emerald-500" : "text-zinc-400"}`}
                    //  image selected button green if uploaded else grey
            onClick={() => fileInputRef.current?.click()}
          >
            <Image size={20} />
          </button>
        </div>
        <button
          type="submit"
          className="btn btn-sm btn-circle"
          disabled={!text.trim() && !imagePreview}// if no text and no image then disable the button
        //  when we click on send button it sends the message and clears the input field
        >
          <Send size={22} />
        </button>
      </form>
    </div>
  );
};
export default MessageInput;