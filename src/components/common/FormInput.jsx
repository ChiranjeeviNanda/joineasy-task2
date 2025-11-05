/**
 * A reusable input field with an optional icon and built-in styling.
 * Supports keyboard events, refs, and validation states for flexible form integration.
 */

const FormInput = ({
	id,
	label,
	type,
	placeholder,
	value,
	onChange,
	icon: Icon,
	disabled = false,
	inputRef = null,
	onKeyDown,
	required = true,
	name,
}) => {
	return (
		<div className="form-control group">
			<label className="label pb-1" htmlFor={id}>
				<span className="label-text text-base font-semibold text-base-content/90">
					{label}
				</span>
			</label>

			<div className="relative">
				{/* Optional leading icon */}
				{Icon && (
					<Icon
						className="absolute top-1/2 transform -translate-y-1/2 left-4 size-5 text-primary/70 z-10 transition-all duration-300 group-focus-within:text-primary group-focus-within:scale-110"
						aria-hidden="true"
					/>
				)}

				{/* Main input field */}
				<input
					ref={inputRef}
					id={id}
					type={type}
					name={name}
					placeholder={placeholder}
					className="input input-bordered input-lg w-full pl-12 rounded-2xl transition-all duration-300 focus:scale-[1.02] focus:shadow-lg border-2 hover:border-primary/50 focus:border-primary"
					value={value}
					onChange={onChange}
					onKeyDown={onKeyDown}
					required={required}
					disabled={disabled}
					tabIndex={0}
				/>
			</div>
		</div>
	);
};

export default FormInput;
