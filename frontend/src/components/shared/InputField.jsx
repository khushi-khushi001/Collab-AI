

function InputField({type="text", name, value, placeholder, onChange}) {

    return ( 
        <input type={type}
          className="auth-input"
          name={name}
          value={value}
          placeholder={placeholder}
          onChange={onChange} />
     );
}

export default InputField;