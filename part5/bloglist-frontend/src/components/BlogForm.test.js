import React from "react";
import "@testing-library/jest-dom";
import { BlogForm } from "./BlogForm";
import { render, screen } from "@testing-library/react";
import userEvent from '@testing-library/user-event'

const mockCreateBlog = jest.fn()

describe('New Blog form', ()=>{
    let container;
    
    beforeEach(() => {
        container = render(
            <BlogForm
            createBlog={mockCreateBlog}
            />
        ).container;
    });

    test('It should call createBlog with the right details when creating a blog', async()=>{
        const user = userEvent.setup();
        const form = container.querySelector('.formDiv')

        expect(form).toBeInTheDocument();

        const inputs = screen.getAllByRole('textbox')
        const likesInput = screen.getByRole('spinbutton')
        const saveButton = screen.getByText('Submit')

        const newBlog = {
            title:'Java Data Structures',
            author:'James Gosling',
            url:'https://java-for-all.com',
            likes:'23'
        }

        await user.type(inputs[0],newBlog.title)
        await user.type(inputs[1],newBlog.author)
        await user.type(inputs[2],newBlog.url)
        await user.type(likesInput, newBlog.likes);

        await user.click(saveButton)

        expect(mockCreateBlog).toHaveBeenCalled();
        expect(mockCreateBlog).toHaveBeenCalledWith(newBlog)

    })



})