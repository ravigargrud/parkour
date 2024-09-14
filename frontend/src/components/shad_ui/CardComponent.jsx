import React from "react";
import {
  Card as BaseCard,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

const CardComponent = ({
  title,
  description,
  content,
  footer,
  children,
  className,
}) => {
  return (
    <BaseCard className={className}>
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {content}
        {children}
      </CardContent>
      <CardFooter>
        <p>{footer}</p>
      </CardFooter>
    </BaseCard>
  );
};

export default CardComponent;
