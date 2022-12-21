import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import { FormProvider, useForm } from "react-hook-form";
import { supabase } from "../../providers/client";
import TextInput from "../inputs/TextInput";
import { InputValidation } from "../inputs/types";

type LogInInputs = {
  email: string;
  password: string;
};

type LogInValidation = {
  [prop in keyof LogInInputs]?: InputValidation;
};

export default function LogIn() {
  const formMethods = useForm<LogInInputs>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
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

  const onLogin = async (data: LogInInputs) => {
    await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="body1" padding={1}>
          You are NOT logged in.
        </Typography>
        <FormProvider {...formMethods}>
          <form onSubmit={formMethods.handleSubmit(onLogin)}>
            <Grid
              container
              direction="column"
              alignItems="stretch"
              padding={1}
              rowSpacing={2}
            >
              <Grid item>
                <TextInput
                  name="email"
                  label="Email"
                  type="email"
                  autocomplete="email"
                  rules={formValidation.email}
                />
              </Grid>
              <Grid item>
                <TextInput
                  name="password"
                  label="Password"
                  type="password"
                  autocomplete="current-password"
                  rules={formValidation.password}
                />
              </Grid>

              <Grid item>
                <Button
                  variant="contained"
                  type="submit"
                  disabled={formMethods.formState.isSubmitting}
                >
                  {formMethods.formState.isSubmitting
                    ? "Logging in..."
                    : "LOG IN"}
                </Button>
              </Grid>
            </Grid>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}
