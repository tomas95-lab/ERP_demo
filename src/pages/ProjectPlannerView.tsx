import { useEffect, useState, useRef } from "react";
import { db } from "@/firebaseConfig";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { useSearchParams } from "react-router-dom";
import { format, set } from "date-fns";
import { useFirestoreCollection } from "@/hooks/useFirestoreCollection";

import { Button } from "@/components/ui/button";
import { Label } from "@radix-ui/react-label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDropPreview } from "@/components/FileDropPreview";
import { RefreshCcw } from "lucide-react";

export default function ProjectPlannerView() {
  const [postingComment, setPostingComment] = useState(false);

  const [searchParams] = useSearchParams();
  const projectId = searchParams.get("id");
  const [project, setProject] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [assignee, setAssignee] = useState("");
  const [newComment, setNewComment] = useState("");

  const { data: tasks } = useFirestoreCollection(`projects/${projectId}/tasks`);
  const { data: users } = useFirestoreCollection(`users`);
  const previewRef = useRef<{ reset: () => void }>(null);

  useEffect(() => {
    if (!projectId) return;
    const fetchProject = async () => {
      const docRef = doc(db, "projects", projectId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setProject({ id: docSnap.id, ...docSnap.data() });
      }
    };
    fetchProject();
  }, [projectId]);

  useEffect(() => {
    if (!projectId) return;
    const fetchComments = async () => {
      const commentsRef = collection(db, "projects", projectId, "comments");
      const snapshot = await getDocs(commentsRef);
      const commentData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setComments(commentData);
    };
    fetchComments();
  }, [projectId]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = formData.get("name") as string;
    const start = formData.get("start") as string;
    const end = formData.get("end") as string;
    const progress = Number(formData.get("progress") || 0);
    const parent = formData.get("parent") || null;

    if (!name || !start || !end || !assignee) {
      toast.error("All required fields must be filled.");
      return;
    }
    const startDate = new Date(start);
    const endDate = new Date(end);
    if (endDate < startDate) {
      toast.error("End date cannot be earlier than start date.");
      return;
    }
    const newTask = {
      name,
      start,
      end,
      progress,
      parent,
      createdAt: new Date(),
      type: "task",
      duration: 0,
      assign: assignee,
    };
    if (!projectId) return;
    const taskRef = collection(db, "projects", projectId, "tasks");
    await addDoc(taskRef, newTask);
    toast.success("Task created successfully.");
    form.reset();
    setAssignee("");
    form.querySelector<HTMLInputElement>("#name")?.focus();
  };

  const handleCommentSubmit = async () => {
    if(newComment === ""){
      return toast.error("Comment cannot be empty.");
    }
    if (!projectId) return;
    setPostingComment(true);
    const commentsRef = collection(db, "projects", projectId, "comments");
    await addDoc(commentsRef, {
      text: newComment.trim(),
      author: "Tomas Ruiz",
      createdAt: serverTimestamp(),
    });
    setNewComment("");
    toast.success("Comment added.");
    const snapshot = await getDocs(commentsRef);
    setComments(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    setPostingComment(false);
  };
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between flex-wrap items-center">
        <div>
          <h1 className="text-xl font-bold">Project Planner</h1>
          <p className="text-sm text-muted-foreground">
            Manage the full lifecycle of this project: define phases, assign tasks, upload design files, and collaborate with your team in real time.
          </p>
        </div>
      </div>

      {project && users.length > 0? (
        <div className="flex flex-col gap-4 p-4">
          {/* Header */}
          <section className="flex justify-between flex-col gap-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold mb-4">{project.name}</h2>
              <span
                className={`px-3 py-1 rounded-sm ${
                  project.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : project.status === "Pending"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                } text-sm`}
              >
                {project.status}
              </span>
            </div>

            <div className="flex justify-between items-center gap-8 px-2">
              <div>
                <p className="text-sm text-muted-foreground text-center">Start Date</p>
                <span>{format(new Date(project.startDate), "MM/dd/yyyy")}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground text-center">End Date</p>
                <span>{format(new Date(project.endDate), "MM/dd/yyyy")}</span>
              </div>
              <div>
                <p className="text-sm text-muted-foreground text-center">Supervisor</p>
                <span>{project.supervisor}</span>
              </div>
            </div>
          </section>

          {/* Schedule Section */}
          <section className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 bg-white rounded-xl p-4 shadow ">
              <h3 className="font-medium text-lg mb-4">Task Overview</h3>
              <ul className="space-y-3 max-h-[430px] overflow-y-auto">
                {tasks.map(task => {
                  const start = new Date(task.start).getTime();
                  const end = new Date(task.end).getTime();
                  const duration = Math.max(1, (end - start) / (1000 * 60 * 60 * 24));

                  const getStatusLabel = (progress: number) => {
                    if (progress === 0) return "To Do";
                    if (progress === 100) return "Done";
                    return "In Progress";
                  };

                  const getStatusStyle = (progress: number) => {
                    if (progress === 100) return "bg-green-100 text-green-700";
                    if (progress > 0) return "bg-yellow-100 text-yellow-700";
                    return "bg-gray-100 text-gray-700";
                  };

                  return (
                    <li
                      key={task.id}
                      className="border rounded px-4 py-3 flex flex-col gap-1"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-semibold">{task.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {task.start} → {task.end}
                          </p>
                          {task.parent && (
                            <p className="text-xs text-muted-foreground mt-1">
                              Depends on: {task.parent}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-sm text-muted-foreground space-y-1">
                          <span className="block">{duration} days</span>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusStyle(task.progress)}`}>
                            {getStatusLabel(task.progress)}
                          </span>
                        </div>
                      </div>
                      <div className="w-full bg-gray-100 h-2 rounded mt-2">
                        <div
                          className="bg-blue-600 h-2 rounded"
                          style={{ width: `${task.progress}%` }}
                        />
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="bg-white rounded-xl p-4 shadow h-min">
            <h4 className="font-semibold mb-2">Create new Task</h4>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="grid gap-2">
                <Label htmlFor="name">Task Name</Label>
                <Input id="name" name="name" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="assign">Assign to</Label>
                <Select value={assignee} onValueChange={setAssignee}>
                  <SelectTrigger className="w-full mt-2">
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users
                      .filter((user) => user.name?.trim())
                      .map((user) => (
                        <SelectItem key={user.id} value={user.name}>
                          {user.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="start">Start Date</Label>
                <Input id="start" name="start" type="date" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="end">End Date</Label>
                <Input id="end" name="end" type="date" required />
              </div>

              <div className="grid gap-2">
                <Label htmlFor="parent">Depends on (optional)</Label>
                <Input id="parent" name="parent" />
              </div>

              <Button type="submit" className="w-full">
                Create Task
              </Button>
            </form>
            </div>
          </section>

          <section>
            <div className="flex flex-col mb-2">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Project Files Preview</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => previewRef.current?.reset()}
                  className="gap-2"
                >
                  <RefreshCcw size={16} />
                  Reset View
                </Button>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Drag and drop a file to preview it (images, PDF or 3D models).
              </p>
            </div>
            <div className="rounded-xl border bg-background h-[400px] p-4 shadow-sm">
              <FileDropPreview ref={previewRef} />
            </div>
          </section>
          {/* Comments Section */}
          <section className="bg-white rounded-xl p-4 shadow">
            <h3 className="font-medium text-lg mb-2">Comments</h3>
            <div className="space-y-2">
              {comments.length === 0 ? (
                <p className="text-sm text-muted-foreground">No comments yet.</p>
              ) : (
                comments.map((comment) => (
                  <div key={comment.id} className="border rounded p-2 bg-gray-50">
                    <p className="text-sm">
                      <strong>{comment.author}</strong>: {comment.text}
                    </p>
                  </div>
                ))
              )}
            </div>
            <div className="mt-4 space-y-2">
              <Label htmlFor="comment">Add Comment</Label>
              <Textarea
                id="comment"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
              />
              <Button size="sm" disabled={postingComment} onClick={handleCommentSubmit}>
                Post Comment
              </Button>
            </div>
          </section>
        </div>
      ) : (
        <div className="text-center text-muted-foreground">Loading data...</div>
      )}
    </div>
  );
}
