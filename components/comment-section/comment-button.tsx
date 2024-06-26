"use client"

import { useState, useTransition } from "react"
import { addComment } from "@/actions/add-comment"
import { MessageCircle } from "lucide-react"

import { Tables } from "@/types/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

import SignUpDialog from "../navbar/sign-up-dialog"
import { useToast } from "../ui/use-toast"
import Comments from "./comments"

interface CommentButtonProps {
  comments: Tables<"comments">[] | null
  profileId: string | null
  articleId: string
}

export function CommentButton({
  comments,
  profileId,
  articleId,
}: CommentButtonProps) {
  const [comment, setComment] = useState<string>("")
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  const handleCommentChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setComment(event.target.value)
  }

  const handleCommentSubmit = () => {
    startTransition(async () => {
      const data = await addComment(comment, profileId!, articleId!)
      if (data?.error) {
        toast({ variant: "destructive", title: data.error })
      }
      setComment("") // Clear the input field after submission
    })
  }

  return (
    <>
      {profileId ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="p-0.5">
              <MessageCircle className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Responses</SheetTitle>
            </SheetHeader>
            {/* comment section */}
            <div className="flex gap-3 py-3">
              <Input
                id="comment"
                className="col-span-3"
                onChange={handleCommentChange}
                value={comment}
              />
              <Button onClick={handleCommentSubmit} disabled={isPending}>
                Submit
              </Button>
            </div>
            {/* display comment */}
            <div className="my-4 flex">
              <p className="text-sm font-medium">Recent Comments</p>
            </div>
            <Comments comments={comments} />
          </SheetContent>
        </Sheet>
      ) : (
        <SignUpDialog>
          <Button variant="ghost" size="icon" className="p-0.5">
            <MessageCircle className="size-6" />
          </Button>
        </SignUpDialog>
      )}
    </>
  )
}
