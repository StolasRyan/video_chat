import { HashIcon } from "lucide-react";
import '../styles/stream-chat-theme.css';

const CustomChannelPreview = ({ channel, activeChannel, setActiveChannel }) => {
  const isActive = activeChannel && activeChannel?.id === channel?.id;
  const isDirectMessage =
    channel?.data?.member_count === 2 && channel?.data?.id.includes("user_");

  if (isDirectMessage) return null;

  const unreadCount = channel?.countUnread();
  return (
    <button
      onClick={() => setActiveChannel(channel)}
      className={`str-chat__channel-preview-messenger transition-colors flex items-center w-full text-left px-4 py-2 rounded-lg mb-1 font-medium hover:bg-blue-50/80 min-h-9 ${
        isActive 
        ? "bg-black/20 hover:bg-black/20 border-l-8 border-purple-500 shadow-lg text-blue-900" 
        : ""
      }`}
    >
      <HashIcon className="size-4 mr-2 text-[#9b9b9b]"/>
      <span className="str-chat__channel-preview-messenger-name flex-1">{channel.data.id}</span>
      {unreadCount > 0 && (
          <span className="flex items-center justify-center ml-2 size-4 text-xs rounded-full bg-red-500">
            {unreadCount}
          </span>
      )}
    </button>
  );
};

export default CustomChannelPreview;
