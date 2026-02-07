const ChatsPage = () => {
  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-brand">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M7.9 20A9 9 0 1 0 4 16.1L2 22Z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-slate-900">Chats</h1>
      <p className="text-sm text-slate-500">Chat list will appear here.</p>
    </main>
  );
};

export default ChatsPage;
