/**
 * Универсальный helper для объединения className строк
 * Работает как clsx + twMerge (но без внешних зависимостей)
 */

export function cn(
  ...inputs: Array<string | false | null | undefined>
): string {
  return inputs.filter(Boolean).join(" ");
}
