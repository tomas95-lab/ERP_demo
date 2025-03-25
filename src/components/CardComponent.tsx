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
}

export default function CardComponent ({title, description, action, children, full, path}: CardComponentProps) {
  return (
    <Card className="justify-between">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="">
        {children}
      </CardContent>
      <CardFooter className="flex justify-end">
        {path ? (
          <Link className={`${full ? 'w-full' : ''} h-[40px] cursor-pointer`} to={path}>
            <Button className={`${full ? 'w-full' : ''} h-[40px] cursor-pointer`}>{action}</Button>
          </Link>
        ) : (
          <Button className={`${full ? 'w-full' : ''} h-[40px] cursor-pointer`}>{action}</Button>
        )}
      </CardFooter>
    </Card>
  )
}