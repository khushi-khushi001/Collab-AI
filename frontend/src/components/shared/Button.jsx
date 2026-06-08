

function Button(props) {

    return (
        <button type={props.type}
         className="auth-btn"
         onClick={props.onClick}
         
        >

            {props.text}

         </button>
      );
}

export default Button;