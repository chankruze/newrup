import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";

export const TestimonialCard = ({ testimony }: { testimony: any }) => {
  return (
    <Card className="h-[350px] w-full max-w-md rounded-lg border text-center shadow-lg">
      <CardHeader>
        <CardTitle className="font-outfit text-lg">{testimony.name}</CardTitle>
        <CardDescription className="font-roboto">
          {testimony.position}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="mx-auto h-24 w-24 overflow-hidden rounded-full">
          <img
            src={testimony.image}
            alt={testimony.name}
            loading="lazy"
            className="h-full w-full object-cover"
          />
        </div>
        <p className="line-clamp-3 font-outfit font-medium">
          {testimony.content}
        </p>
      </CardContent>
    </Card>
  );
};
