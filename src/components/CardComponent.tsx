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
  center?: boolean
}

export default function CardComponent ({title, description, action, children, full, path, center}: CardComponentProps) {
  return (
    <Card className="justify-between">
      <CardHeader>
        <CardTitle className={`${center ? 'text-center':''}`}>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="">
        {children}
      </CardContent>
      <CardFooter className="flex justify-end">
        {path ? (
          <Link className={`${full ? 'w-full' : ''} h-[40px]`} to={path}>
            <Button className={`${full ? 'w-full' : ''} h-[40px]`}>{action}</Button>
          </Link>
        ) : (
          action === "false" ? null : (
            <Button className={`${full ? 'w-full' : ''} h-[40px]`}>{action}</Button>
          )
        )}
      </CardFooter>
    </Card>
  )
}