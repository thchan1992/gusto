"use client";

interface ButtonProps {
  title: string;
  onClick: () => void;
  disabled?: boolean;
}
function Button({ title, onClick, disabled = false }: ButtonProps) {
  return (
    <button
      disabled={disabled}
      onClick={() => {
        onClick();
      }}
      className="rounded-md bg-primary px-8 py-4 text-base font-semibold text-white duration-300 ease-in-out hover:bg-primary/80"
    >
      {title}
    </button>
  );
}

export default Button;
