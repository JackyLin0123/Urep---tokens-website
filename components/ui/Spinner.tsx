"use client";

export default function Spinner({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = { sm: "w-4 h-4", md: "w-6 h-6", lg: "w-10 h-10" }[size];

  return (
    <div className="flex items-center justify-center py-8">
      <div
        className={`${dim} border-2 border-eco-200 border-t-eco-600 rounded-full animate-spin`}
      />
    </div>
  );
}
