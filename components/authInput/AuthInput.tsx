import { BaseSyntheticEvent, useState } from "react";
import {
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputBaseProps,
  InputLabel,
} from "@mui/material";
import OutlinedInput from "@mui/material/OutlinedInput";
import { Visibility, VisibilityOff } from "@mui/icons-material";

import styles from "./AuthInput.module.css";

type AuthInputProps = {
  label: string;
  value: string;
  changeHandler: (event: BaseSyntheticEvent) => void;
  type: InputBaseProps["type"];
  error?: string;
  name?: string;
};

export const AuthInput = ({
  label,
  value,
  changeHandler,
  error,
  type,
  name,
}: AuthInputProps) => {
  const [visible, setVisible] = useState<boolean>(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  return (
    <FormControl variant={"outlined"} size="small">
      <InputLabel>{label}</InputLabel>
      <OutlinedInput
        className={styles.formField}
        value={value}
        onChange={changeHandler}
        error={!!error}
        label={label}
        type={visible ? "text" : type}
        name={name}
        endAdornment={
          type === "password" ? (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={toggleVisibility}
                edge="end"
              >
                {visible ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ) : undefined
        }
      />
      {error && <FormHelperText>{error}</FormHelperText>}
    </FormControl>
  );
};
