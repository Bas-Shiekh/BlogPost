import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/Card"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/Avatar"
import { Skeleton } from "./ui/Skeleton"
import { Link } from "react-router-dom"
import { formatDate } from "../lib/utils"
import { MessageSquare } from "lucide-react"
import type { Blog } from "../lib/types"

/**
 * Props for the BlogList component
 */
interface BlogListProps {
  blogs: Blog[]
  isLoading: boolean
  limit?: number
}

export default function BlogList({ blogs, isLoading, limit }: BlogListProps) {
  // Show skeleton loading state
  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(limit || 6)].map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardHeader className="p-0">
              <Skeleton className="h-48 rounded-none" />
            </CardHeader>
            <CardContent className="p-6">
              <Skeleton className="h-6 w-2/3 mb-2" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-4 w-2/3" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  // Show message when no blogs are found
  if (!blogs.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No blogs found</p>
      </div>
    )
  }

  // Render the blog grid
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => (
        <Link key={blog.id} to={`/blogs/${blog.id}`}>
          <Card className="h-full overflow-hidden hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={blog.author.avatar} alt={blog.author.name} />
                  <AvatarFallback>{blog.author.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="text-sm text-muted-foreground">{blog.author.name}</span>
              </div>
              <CardTitle className="line-clamp-2">{blog.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground line-clamp-3">{blog.excerpt}</p>
            </CardContent>
            <CardFooter className="text-sm text-muted-foreground flex justify-between">
              <span>{formatDate(blog.createdAt)}</span>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                <span>{blog.commentCount}</span>
              </div>
            </CardFooter>
          </Card>
        </Link>
      ))}
    </div>
  )
}

