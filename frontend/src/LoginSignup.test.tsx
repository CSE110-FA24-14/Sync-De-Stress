import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { LoginPage } from "./LoginPage";
import { SignUpPage } from "./SignUpPage";

test("renders login form", () => {
    render(
        <BrowserRouter>
          <LoginPage />
        </BrowserRouter>
    );
    const loginButton = screen.getByText("Login");
    expect(loginButton).toBeInTheDocument();
});

test("renders signup form", () => {
    render(
        <BrowserRouter>
          <SignUpPage />
        </BrowserRouter>
    );
    const signupButton = screen.getByText("Sign Up");
    expect(signupButton).toBeInTheDocument();
});

test("'I don't have an account button' goes to Sign Up Page", () => {
    render(
        <BrowserRouter>
          <LoginPage />
          <SignUpPage />
        </BrowserRouter>
    );
    const loginButton = screen.getByText("I don't have an account.");
    fireEvent.click(loginButton);
    expect(window.location.pathname).toBe('/SignUpPage');
});

test("'I already have an account button' goes to Login Page", () => {
    render(
        <BrowserRouter>
          <LoginPage />
          <SignUpPage />
        </BrowserRouter>
    );
    const signupButton = screen.getByText("I already have an account.");
    fireEvent.click(signupButton);
    expect(window.location.pathname).toBe('/');
});
