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
}

export default function CardComponent ({title, description, action, children}: CardComponentProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {children}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button className="cursor-pointer">{action}</Button>
      </CardFooter>
    </Card>
  )
}