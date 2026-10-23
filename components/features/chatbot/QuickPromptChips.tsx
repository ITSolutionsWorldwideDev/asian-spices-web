const prompts = [
  {
    title: "Recipe Ideas",
    subtitle: "Help me find a chicken dinner",
    prompt: "I want help finding a recipe.",
  },
  {
    title: "Find Products",
    subtitle: "Help me find the right spices",
    prompt: "I want help finding products.",
  },
  {
    title: "Build My Dish",
    subtitle: "Find the spices and staples for me",
    prompt: "I want help building a dish.",
  },
  {
    title: "Shop by Dish",
    subtitle: "Show me products for one recipe",
    prompt: "I want to shop for a dish.",
  },
];

type QuickPromptChipsProps = {
  disabled?: boolean;
  onSelect: (value: string) => void;
};

export function QuickPromptChips({
  disabled = false,
  onSelect,
}: QuickPromptChipsProps) {
  return (
    <div className="space-y-3 px-14 pb-4 pt-2">
      <p className="px-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[rgba(154,114,86,0.78)]">
        Try one of these
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {prompts.map((prompt) => (
          <button
            key={prompt.title}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(prompt.prompt)}
            className="rounded-[1.35rem] border border-[rgba(255,255,255,0.5)] bg-[rgba(255,251,246,0.8)] px-4 py-3 text-left shadow-[0_10px_24px_rgba(63,45,35,0.08)] transition hover:-translate-y-0.5 hover:bg-[rgba(255,255,255,0.92)] disabled:cursor-not-allowed disabled:opacity-55"
          >
            <div className="text-[0.98rem] font-semibold text-[#4f443c]">
              {prompt.title}
            </div>
            <div className="mt-1 text-sm leading-6 text-[#7b6a5d]">
              {prompt.subtitle}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
