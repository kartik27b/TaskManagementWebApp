import { Box, Button, Container, Typography } from "@material-ui/core";
import { Link } from "react-router-dom";
import Field from "../Components/Field";
import { useForm } from "react-hook-form";
import { api } from "../extras/api";
import { useServerErrors } from "../extras/hooks";

function SignupPage() {
  const { register, handleSubmit } = useForm();
  const [
    isError,
    nonFieldError,
    fieldError,
    setServerErrors,
  ] = useServerErrors();

  const onSubmit = async (data) => {
    try {
      const res = await api.post("/auth/signup/", {
        username: data.username,
        password: data.password,
      });
      console.log(res.data);
      setServerErrors(null);
    } catch (err) {
      if (err.response) {
        const ans = err.response.data;

        setServerErrors(ans);
      }
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={12}>
        <Box mb={3}>
          <Typography variant="h4" component="h2" color="textSecondary">
            Signup
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
              to="/login"
              variant="h6"
              color="textSecondary"
            >
              Already have an account ?
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

export default SignupPage;