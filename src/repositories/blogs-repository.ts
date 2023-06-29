import {Blog, BlogCreateModel, BlogUpdateModel} from "../types";

const blogsDbInstance: Blog[] = [];

const createBlogsModel = (): Blog[] => {
    if (process.env.NODE_ENV !== 'test') {
        return [...blogsDbInstance]
    }
    return [...blogsDbInstance]
}

const blogsModel: Blog[] = createBlogsModel();

export const blogsRepository = {
    getBlogs(): Blog[] {
        return blogsModel;
    },
    createBlog(input: BlogCreateModel): Blog {
        const newBlog: Blog = {
            id: blogsModel.length + 1,
            ...input,
        }
        blogsModel.push(newBlog);
        return newBlog;
    },
    findBlogById(id: number): Blog | null {
        return blogsModel.find(p => p.id === id) ?? null;
    },
    updateBlogById(id: number, input: BlogUpdateModel): Blog | null {
        let blog = this.findBlogById(id);
        if (blog) {
            blog.name = input.name;
            blog.description = input.description;
            blog.websiteUrl = input.websiteUrl;
            return blog;
        }
        return null;
    },
    deleteBlogById(id: number): boolean {
        for (let i = 0; i < blogsModel.length; i++) {
            if (blogsModel[i].id === id) {
                blogsModel.splice(i, 1);
                return true;
            }
        }
        return false;
    },

    clear(): void {
        blogsModel.splice(0, blogsModel.length)
    }
}