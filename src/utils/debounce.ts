export default function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay = 250
) {
  let timer: any;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => func(...args), delay);
  };
}
