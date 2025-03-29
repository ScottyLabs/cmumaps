/**
 * Know whether the user has enabled an option to reduce motion in animations
 * @returns true if the user has enabled the option; false otherwise
 */
export default function prefersReducedMotion() {
  return window?.matchMedia('(prefers-reduced-motion: reduce)')?.matches;
}
