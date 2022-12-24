import { Box, Button, Card, CardContent, Typography } from "@mui/material";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import signIn from "../../providers/authProvider";
import { getErrorMessage } from "../../providers/helpers";
import TextInput from "../inputs/TextInput";
import { InputValidation } from "../inputs/types";
import Page from "../Page";

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
  const [error, setError] = useState<string | null>(null);

  const formMethods = useForm<LogInInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onLogin = async (data: LogInInputs) => {
    setError(null);

    try {
      await signIn(data.email, data.password);
    } catch (error) {
      setError(getErrorMessage(error));
    }
  };

  return (
    <Page busy={formMethods.formState.isSubmitting} error={error}>
      <Card>
        <CardContent>
          <Typography variant="body1" padding={1}>
            Log In
          </Typography>
          <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onLogin)}>
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
                <Button
                  variant="contained"
                  type="submit"
                  disabled={formMethods.formState.isSubmitting}
                  sx={{ alignSelf: "start" }}
                >
                  {formMethods.formState.isSubmitting
                    ? "Logging in..."
                    : "LOG IN"}
                </Button>
              </Box>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </Page>
  );
}
