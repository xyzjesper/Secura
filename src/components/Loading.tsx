export function Loading({ error }: { error?: string }) {
  return (
    <div
      role="status"
      className="w-screen h-screen flex items-center flex-col justify-center align-middle bg-background"
    >
      <div>
        <span className="text-xl font-extrabold text-pink-300">
          {error ?? ""}
        </span>
      </div>
    </div>
  );
}
