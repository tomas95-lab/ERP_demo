import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
import { ReactNode, useState } from "react"
import { Button } from "./ui/button";
  
interface DialogComponentProps {
  trigger: ReactNode;
  title: string;
  description: string;
  button: boolean,
  full?: boolean
  height?: string
  className?: string; // Add this line
  children: (onClose: () => void) => ReactNode;
}
  
  export function DialogComponent({ trigger, title, description, children, button, full, height }: DialogComponentProps) {
    const [open, setOpen] = useState(false);
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger className= {full ? "w-100" : ""} onClick={() => setOpen(true)}>
          {button ?  <Button className={full ? `w-full h-[${height}]` : " "}> {trigger}</Button> : trigger}
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{description}</DialogDescription>
          </DialogHeader>
          {children(() => setOpen(false))}
        </DialogContent>
      </Dialog>
    );
  }
