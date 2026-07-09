import { FaEye, FaEyeSlash } from "react-icons/fa";

const InputField = ({
  label,
  name,
  type = "text",
  placeholder,
  value,
  onChange,
  error,
  showPassword,
  togglePassword,
}) => {
  const isPasswordField = type === "password";

  return (
    <div className="mb-5">

      <label className="block text-gray-300 mb-2 font-medium">
        {label}
      </label>

      <div className="relative">

        <input
          name={name}
          type={
            isPasswordField
              ? showPassword
                ? "text"
                : "password"
              : type
          }
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full rounded-xl border px-4 py-3 bg-slate-800 text-white outline-none transition

          ${
            error
              ? "border-red-500"
              : "border-slate-700 focus:border-blue-500"
          }`}
        />

        {isPasswordField && (
          <button
            type="button"
            onClick={togglePassword}
            className="absolute right-4 top-4 text-gray-400"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        )}

      </div>

      {error && (
        <p className="text-red-400 text-sm mt-1">
          {error}
        </p>
      )}

    </div>
  );
};

export default InputField;