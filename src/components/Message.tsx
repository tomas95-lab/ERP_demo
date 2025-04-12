export default function Message({
    content,
    role,
  }: {
    content: string;
    role: "user" | "bot" | "model";
  }) {
  
    return (
        <div
          className={`rounded-2xl p-3 max-w-[70%] ${
            role === "user"
              ? "bg-gray-200 text-black self-end"
              : "bg-blue-100 text-black self-start"
          }`}
        >
          <p>{content}</p>
        </div>
      );
    
}