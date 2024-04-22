import React from "react";
import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import { Blog } from "./Blog";
import userEvent from '@testing-library/user-event'

jest.mock('../services/blogs')


describe("<Blog/>", () => {
  let container;

  let mockIncreaseLikes = jest.fn();
  let mockRemoveBlog = jest.fn();

  let authUser = {
    name: "Devian",
    username: "devdev",
    id: "658a2893ac9ab772764cef08",
  };

  let blog = {
    title: "Head First Java",
    author: "James Gosling",
    url: "https://www.rcsdk12.org/cms/lib/NY01001156/Centricity/Domain/4951/Head_First_Java_Second_Edition.pdf",
    likes: 10,
    user: {
      name: "Devian",
      username: "devdev",
      id: "658a2893ac9ab772764cef08",
    },
  };

  beforeEach(() => {
    container = render(
      <Blog
        blog={blog}
        onLike={mockIncreaseLikes}
        onDelete={mockRemoveBlog}
        currentUser={authUser}
      />
    ).container;
  });

  afterAll(()=>{
    jest. clearAllMocks()
  })

  test("Render a Blog", () => {
    expect(container).toHaveTextContent("Head First Java - James Gosling");
  });

  test("Render title and author but not render its url or number of likes", () => {
    expect(container).toHaveTextContent("Head First Java - James Gosling");
  });

  test("blog's url and number of likes are hide at first", () => {
    const div = container.querySelector(".blog-details");
    expect(div).toHaveStyle("display: none");
  });

  test("blog's url and number of likes are shown when button is clicked", () => {
    const button = screen.getByText("Show Details");
    fireEvent.click(button)
    const div = container.querySelector(".blog-details");
    expect(div).not.toHaveStyle("display: none");
  });

  test("when like button clicked twice, then event handler the component received is called twice",async () => {
    const button = screen.getByText("Like");
    const user = userEvent.setup()
    await user.click(button) 
    await user.click(button) 
    expect(mockIncreaseLikes).toHaveBeenCalledTimes(2)
  });
});
