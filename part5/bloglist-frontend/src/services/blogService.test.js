import blogService from './blogs'
import axios from 'axios';

jest.mock('axios');

describe('Blog service', ()=>{
    
    test('should return a list of blogs', async () => {
        const blogs = [
          { id: 'valid-id-1', title: 'Blog 1', author : 'author 1', url:'https//:blog-test-1.com' },
          { id: 'valid-id-2', title: 'Blog 2', author : 'author 2', url:'https//:blog-test-2.com' },
          { id: 'valid-id-3', title: 'Blog 3', author : 'author 3', url:'https//:blog-test-3.com' },
        ];
    
        axios.get.mockResolvedValue({data:blogs});
    
        const result = await blogService.getAll()

        expect(result).toEqual(blogs);
        expect(axios.get).toHaveBeenCalledTimes(1);
        expect(axios.get).toHaveBeenCalledWith('/api/blogs');
      });
    
    //   test('should handle error when fetching blogs', async () => {
    //     const errorMessage = 'Failed to fetch blogs';
    //     axios.get.mockRejectedValue(new Error(errorMessage));
    
    //     await expect(getBlogs()).rejects.toThrow(errorMessage);
    //     expect(axios.get).toHaveBeenCalledTimes(1);
    //     expect(axios.get).toHaveBeenCalledWith('https://api.example.com/blogs');
    //   });
})