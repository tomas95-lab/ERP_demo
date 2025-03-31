import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { ReactNode } from 'react';
import { Link } from "react-router-dom";

interface CardComponentProps {
  title: string;
  description: string;
  action: string;
  children: ReactNode;
  full: boolean;
  path?: string;
  center?: boolean;
  onActionClick?: () => void;
  variant?: 'default' | 'destructive' | 'outline' | 'green' | 'yellow' | 'red';
  active?: boolean;
}

export default function CardComponent ({
  title,
  description,
  action,
  children,
  full,
  path,
  center,
  onActionClick,
  variant = 'default',
  active = false,
}: CardComponentProps) {

  const variantClassMap: Record<string, string> = {
    green: 'bg-green-600 hover:bg-green-700 text-white',
    yellow: 'bg-yellow-500 hover:bg-yellow-600 text-white',
    red: 'bg-red-800 hover:bg-red-700 text-white',
    outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
    default: 'bg-primary text-white hover:bg-primary/90',
    destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  }

  const ringClassMap: Record<string, string> = {
    green: 'ring-green-300',
    yellow: 'ring-yellow-300',
    red: 'ring-red-800',
    default: 'ring-primary',
    destructive: 'ring-destructive',
    outline: 'ring-border',
  }

  const variantClasses = variantClassMap[variant]
  const ringClass = active ? `ring-2 ring-offset-2 ${ringClassMap[variant] ?? 'ring-primary'}` : ''

  return (
    <Card className="justify-between h-full">
      <CardHeader>
        <CardTitle className={`${center ? 'text-center' : ''}`}>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <CardFooter className="flex justify-end">
        {path ? (
          <Link className={`${full ? 'w-full' : ''} h-[40px]`} to={path}>
            <Button className={`${full ? 'w-full' : ''} h-[40px]`}>{action}</Button>
          </Link>
        ) : action === "false" ? null : (
          <Button
            className={`${variantClasses} ${ringClass} ${full ? 'w-full' : ''} h-[40px]`}
            onClick={onActionClick}
          >
            {action}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
