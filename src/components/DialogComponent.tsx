import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from "@/components/ui/dialog"
  import { ReactNode, useState } from "react"
  
  interface DialogComponentProps {
    trigger: ReactNode;
    title: string;
    description: string;
    children: (onClose: () => void) => ReactNode;
  }
  
  export function DialogComponent({ trigger, title, description, children }: DialogComponentProps) {
    const [open, setOpen] = useState(false);
  
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger onClick={() => setOpen(true)}>{trigger}</DialogTrigger>
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
  