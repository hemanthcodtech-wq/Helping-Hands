// Helping Hands Foundation logo. Use the same Cloudinary asset everywhere the logo appears.
export default function Logo({ className = "", variant = "color" }) {
  return (
    <img
      className={`object-contain drop-shadow-[0_4px_10px_rgba(6,29,73,0.24)] ${className}`}
      src="https://res.cloudinary.com/dwmjz9csc/image/upload/v1786889497/9ec8064b-61d9-4e70-897d-4790e9ea2cdf-removebg-preview_ogtw6d.png"
      alt="Helping Hands Foundation logo"
      loading="eager"
      decoding="async"
    />
  )
}
