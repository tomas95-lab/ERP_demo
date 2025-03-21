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

interface CardComponentProps {
  title: string;
  description: string;
  action: string;
  children: ReactNode;
  full: boolean
}

export default function CardComponent ({title, description, action, children, full}: CardComponentProps) {
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
        <Button className={`${full ? 'w-full' : ''} h-[40px] cursor-pointer`}>{action}</Button>
      </CardFooter>
    </Card>
  )
}