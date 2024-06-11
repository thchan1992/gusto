// "use client";

// interface ButtonProps {
//   title: string;
//   onClick: () => void;
//   height: number;
//   width: number;
// }

// export default function Button({ title, onClick, height, width }: ButtonProps) {
//   return (
//     <button
//       style={{ width: `${width}px`, height: `${height}px` }}
//       className="bg-black p-3 m-3 border-black"
//       onClick={onClick}
//     >
//       <b>{title}</b>
//     </button>
//   );
// }

"use client";

interface ButtonProps {
  title: string;
  onClick: () => void;
}
function Button({ title, onClick }: ButtonProps) {
  return (
    <button
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
