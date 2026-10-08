type CartPlusIconProps = {
  className?: string;
};

/** Exact cart+plus mark from the reference (knockout + shows button bg). */
export default function CartPlusIcon({ className }: CartPlusIconProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/images/cart-plus-icon.png"
      alt=""
      aria-hidden="true"
      draggable={false}
      className={className}
    />
  );
}
