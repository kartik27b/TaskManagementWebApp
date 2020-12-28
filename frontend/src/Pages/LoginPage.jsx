import {
  Box,
  Button,
  Container,
  CssBaseline,
  Typography,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import Field from "../Components/Field";
import { useForm } from "react-hook-form";
import { api } from "../extras/api";
import { useServerErrors } from "../extras/hooks";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../store/user";
import { getEverything } from "../store/data";

function LoginPage() {
  const dispatch = useDispatch();
  const { register, handleSubmit } = useForm();
  const [
    isError,
    nonFieldError,
    fieldError,
    setServerErrors,
  ] = useServerErrors();

  const history = useHistory();

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/login/", {
        username: data.username,
        password: data.password,
      });
      console.log(res.data);
      setServerErrors(null);
      dispatch(loginSuccess(res.data));
      dispatch(getEverything());
      history.push("/");
    } catch (err) {
      if (err.response) {
        const ans = err.response.data;

        setServerErrors(ans);
      }
    }
  };

  return (
    <Container maxWidth="sm" color="inherit">
      <CssBaseline />
      <Box mt={12}>
        <Box mb={3}>
          <Typography variant="h4" component="h2" color="textSecondary">
            Login
          </Typography>
        </Box>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Field
            autoFocus={true}
            error={isError("username")}
            ref={register}
            errorVal={fieldError["username"]}
            label="Username"
            name="username"
          ></Field>
          <Field
            error={isError("password")}
            ref={register}
            errorVal={fieldError["password"]}
            label="Password"
            name="password"
          ></Field>
          <Box
            mt={4}
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Button
              // disabled={loading}
              variant="contained"
              color="primary"
              type="submit"
            >
              Login
            </Button>

            <Typography
              component={Link}
              to="/signup"
              variant="h6"
              color="textSecondary"
            >
              Don't have an account ?
            </Typography>
          </Box>
        </form>
        <Typography variant="h6" color="textSecondary">
          {nonFieldError()}
        </Typography>
        {/* <Box mt={2}>{loading ? <LinearProgress /> : undefined}</Box> */}
      </Box>
    </Container>
  );
}

export default LoginPage;
