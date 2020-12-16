import { Box, TextField } from "@material-ui/core";
import React, { forwardRef } from "react";

const Field = forwardRef((props, ref) => {
  const {
    label = "Default Label",
    onChange,
    error = false,
    errorVal,
    name,
    autoFocus = false,
  } = props;

  return (
    <Box my={2}>
      <TextField
        autoFocus={autoFocus}
        error={error}
        label={label}
        helperText={error && errorVal}
        variant="outlined"
        inputRef={ref}
        name={name}
        onChange={onChange}
        fullWidth
      />
    </Box>
  );
});

// const Field = forwardRef({
//   label = "Default Label",
//   onChange,
//   error = false,
//   errorVal,
//   name,
//   ref,
//   autoFocus = false,
//   ...props
// }) => {
//   return (
//     <Box my={2}>
//       <TextField
//         autoFocus={autoFocus}
//         error={error}
//         label={label}
//         helperText={error && errorVal}
//         variant="outlined"
//         inputRef={ref}
//         name={name}
//         onChange={onChange}
//         fullWidth
//       />
//     </Box>
//   );
// };

export default Field;
