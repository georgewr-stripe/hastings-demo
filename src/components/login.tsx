"use client";

import React from "react";
import { Button, Card, Text, TextInput, Title } from "@tremor/react";
import { createCustomer } from "@/api/createCustomer";
import { useSession } from "@/hooks/useSession";
import { useRouter } from "next/navigation";

type Props = {
  nextURL: string;
};

type CustomerCreate = {
  name: string;
  nameValid: boolean;
  email: string;
  emailValid: boolean;
  loading: boolean;
};

function validateEmail(email: string) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

const Login = (props: Props) => {
  const { customer, setCustomer } = useSession();
  const router = useRouter();

  const [state, setState] = React.useState<CustomerCreate>({
    name: customer?.name || "",
    nameValid: true,
    email: customer?.email || "",
    emailValid: true,
    loading: false,
  });

  React.useEffect(
    () => setState((prev) => ({ ...prev, emailValid: true })),
    [state.email]
  );
  React.useEffect(
    () => setState((prev) => ({ ...prev, nameValid: true })),
    [state.name]
  );

  const login: React.FormEventHandler<HTMLFormElement> = React.useCallback(
    (e) => {
      e.preventDefault();
      if (state.name.length < 1) {
        setState((prev) => ({ ...prev, nameValid: false }));
        return;
      }
      if (!validateEmail(state.email)) {
        setState((prev) => ({ ...prev, nameValid: false }));
        return;
      }
      setState((prev) => ({ ...prev, loading: true }));
      createCustomer({
        email: state.email,
        name: state.email,
      })
        .then((customer) => {
          console.log(customer);
          setCustomer(customer);
          setState((prev) => ({ ...prev, loading: false }));
          router.push(props.nextURL);
        })
        .catch((e) => {
          console.log(e);
          setState((prev) => ({
            ...prev,
            loading: false,
            nameValid: false,
            emailValid: false,
          }));
        });
    },
    [state]
  );

  return (
    <Card className=" w-full sm:w-4/5">
      <form className="flex flex-col gap-2 p-4" onSubmit={login}>
        <Title>Log in</Title>
        <div className="p-1">
          <Text>Name</Text>
          <TextInput
            type="text"
            error={!state.nameValid}
            value={state.name}
            errorMessage="Please enter your full name"
            placeholder="Full name"
            onValueChange={(name) => setState((prev) => ({ ...prev, name }))}
          />
        </div>
        <div className="p-1">
          <Text>Email</Text>
          <TextInput
            type="email"
            error={!state.emailValid}
            errorMessage="Please enter an email address"
            value={state.email}
            placeholder="email address"
            onValueChange={(email) => setState((prev) => ({ ...prev, email }))}
          />
        </div>
        <Button
          loading={state.loading}
          type="submit"
          className="bg-hastings-green"
        >
          Login
        </Button>
      </form>
    </Card>
  );
};

export default Login;
