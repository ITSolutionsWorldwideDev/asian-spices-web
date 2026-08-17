export type RecipeInstruction = {
  instruction_id?: string;
  step_number?: number | null;
  step_title?: string | null;
  step_description?: string | null;
  duration_minutes?: number | null;
};

type RecipeInstructionsListProps = {
  instructions?: RecipeInstruction[] | null;
};

export default function RecipeInstructionsList({
  instructions = [],
}: RecipeInstructionsListProps) {
  const items = Array.isArray(instructions) ? instructions : [];

  if (!items.length) return null;

  return (
    <section className="mt-8">
      <h3 className="mb-4 text-xl font-bold text-gray-900">Instructions</h3>
      <ol className="space-y-4">
        {items.map((item, index) => {
          const step = item.step_number ?? index + 1;

          return (
            <li
              key={item.instruction_id || `step-${step}-${index}`}
              className="rounded-xl border border-gray-100 bg-white p-4 shadow-sm sm:p-5"
            >
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-orange-50 text-sm font-bold text-[#e8924a]">
                  {step}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                    {item.step_title ? (
                      <h4 className="text-base font-semibold text-gray-900">
                        {item.step_title}
                      </h4>
                    ) : (
                      <h4 className="text-base font-semibold text-gray-900">
                        Step {step}
                      </h4>
                    )}
                    {item.duration_minutes != null &&
                    Number.isFinite(Number(item.duration_minutes)) ? (
                      <span className="text-xs font-medium text-[#e8924a]">
                        {Number(item.duration_minutes)} min
                      </span>
                    ) : null}
                  </div>
                  {item.step_description ? (
                    <p className="mt-2 text-sm leading-6 text-gray-600 sm:text-[15px]">
                      {item.step_description}
                    </p>
                  ) : null}
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
