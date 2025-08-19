// CodeInput.tsx
import { forwardRef, useId } from "react";
import "./CodeInput.css";

interface CodeInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id?: string;
}

const CodeInput = forwardRef<HTMLInputElement, CodeInputProps>(
  ({ label, id, ...props }, ref) => {
    const autoId = useId();
    const inputId = id ?? autoId;

    return (
      <div className="glitch-input-wrapper">
        <div className="input-container">
          <input
            ref={ref}                 // ✅ attach the ref
            type="text"
            id={inputId}              // ✅ unique id per field
            className="holo-input"
            placeholder=" "
            required
            {...props}
          />
          <label
            htmlFor={inputId}         // ✅ label targets the unique id
            className="input-label"
            data-text={label}
          >
            {label}
          </label>

          <div className="input-border"></div>
          <div className="input-scanline"></div>
          <div className="input-glow"></div>

          <div className="input-data-stream">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="stream-bar"
                style={{ ["--i" as any]: i } as React.CSSProperties}
              />
            ))}
          </div>

          <div className="input-corners">
            <div className="corner corner-tl"></div>
            <div className="corner corner-tr"></div>
            <div className="corner corner-bl"></div>
            <div className="corner corner-br"></div>
          </div>
        </div>
      </div>
    );
  }
);

export default CodeInput;
