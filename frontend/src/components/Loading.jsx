const Loading = ({ text = "Loading..." }) => (
  <div className="flex items-center justify-center py-10">
    <div className="flex items-center gap-3 text-gray-500">
      <div className="h-6 w-6 rounded-full bg-gradient-brand animate-spin p-0.5">
        <div className="h-full w-full rounded-full bg-white" style={{ clipPath: "inset(0 0 0 50%)" }} />
      </div>
      <span className="animate-pulse">{text}</span>
    </div>
  </div>
);

export default Loading;