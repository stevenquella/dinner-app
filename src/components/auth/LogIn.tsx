import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import { FormProvider, useForm } from "react-hook-form";
import { signIn, signUp } from "../../providers/providerAuth";
import TextInput from "../inputs/TextInput";
import { InputValidation } from "../inputs/types";
import Page, { combineStates } from "../Page";

type LogInInputs = {
  email: string;
  password: string;
};

type LogInValidation = {
  [prop in keyof LogInInputs]?: InputValidation;
};

const formValidation: LogInValidation = {
  email: {
    required: {
      value: true,
      message: "Email is required.",
    },
  },
  password: {
    required: {
      value: true,
      message: "Password is required.",
    },
  },
};

export default function LogIn() {
  const formMethods = useForm<LogInInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const loginMutation = useMutation({
    mutationFn: (data: LogInInputs) => signIn(data.email, data.password),
  });
  const signupMutation = useMutation({
    mutationFn: (data: LogInInputs) => signUp(data.email, data.password),
  });

  const pageState = combineStates([loginMutation, signupMutation]);

  return (
    <Page {...pageState}>
      <Card>
        <CardContent>
          <Typography variant="body1" padding={1}>
            Log In
          </Typography>
          <FormProvider {...formMethods}>
            <form
              onSubmit={formMethods.handleSubmit((x) =>
                loginMutation.mutate(x)
              )}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "stretch",
                  rowGap: 2,
                  p: 1,
                }}
              >
                <TextInput
                  name="email"
                  label="Email"
                  type="email"
                  autocomplete="email"
                  rules={formValidation.email}
                />
                <TextInput
                  name="password"
                  label="Password"
                  type="password"
                  autocomplete="current-password"
                  rules={formValidation.password}
                />
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    alignItems: "center",
                    columnGap: 1,
                  }}
                >
                  <Button
                    variant="contained"
                    type="submit"
                    disabled={pageState.isLoading}
                  >
                    LOG IN
                  </Button>
                  <Typography variant="body1">OR</Typography>
                  <Button
                    variant="contained"
                    color="secondary"
                    type="button"
                    disabled={pageState.isLoading}
                    onClick={formMethods.handleSubmit((x) =>
                      signupMutation.mutate(x)
                    )}
                  >
                    SIGN UP
                  </Button>
                </Box>
              </Box>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </Page>
  );
}
