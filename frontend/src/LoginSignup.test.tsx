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

/*
test("renders create note form", () => {
 render(<LoginPage />); // this didn't work
 const createNoteButton = screen.getByText("Create Note");
 expect(createNoteButton).toBeInTheDocument();
});
*/
