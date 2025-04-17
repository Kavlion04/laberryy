import { useTranslation } from "react-i18next";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  Book,
  BookOpen,
  Users,
  Laptop,
  Mail,
  Phone,
  MessageSquare,
  Search,
  Clock,
  Shield,
  Lightbulb,
  GraduationCap,
  MousePointer,
  Link,
} from "lucide-react";

const AboutPage = () => {
  const { t } = useTranslation();

  const goals = [
    {
      icon: <BookOpen className="h-12 w-12 text-primary" />,
      title: t("about.goals.easyAccess.title"),
      description: t("about.goals.easyAccess.description"),
    },
    {
      icon: <Laptop className="h-12 w-12 text-primary" />,
      title: t("about.goals.digitalization.title"),
      description: t("about.goals.digitalization.description"),
    },
    {
      icon: <Users className="h-12 w-12 text-primary" />,
      title: t("about.goals.community.title"),
      description: t("about.goals.community.description"),
    },
    {
      icon: <Search className="h-12 w-12 text-primary" />,
      title: t("about.goals.search.title"),
      description: t("about.goals.search.description"),
    },
    {
      icon: <Clock className="h-12 w-12 text-primary" />,
      title: t("about.goals.availability.title"),
      description: t("about.goals.availability.description"),
    },
    {
      icon: <Shield className="h-12 w-12 text-primary" />,
      title: t("about.goals.security.title"),
      description: t("about.goals.security.description"),
    },
    {
      icon: <Lightbulb className="h-12 w-12 text-primary" />,
      title: t("about.goals.innovation.title"),
      description: t("about.goals.innovation.description"),
    },
    {
      icon: <GraduationCap className="h-12 w-12 text-primary" />,
      title: t("about.goals.education.title"),
      description: t("about.goals.education.description"),
    },
    {
      icon: <MousePointer className="h-12 w-12 text-primary" />,
      title: t("about.goals.accessibility.title"),
      description: t("about.goals.accessibility.description"),
    },
    {
      icon: <Link className="h-12 w-12 text-primary" />,
      title: t("about.goals.integration.title"),
      description: t("about.goals.integration.description"),
    },
  ];

  const faqs = [
    {
      question: t("about.faq.howToRegister.question"),
      answer: t("about.faq.howToRegister.answer"),
    },
    {
      question: t("about.faq.borrowBooks.question"),
      answer: t("about.faq.borrowBooks.answer"),
    },
    {
      question: t("about.faq.returnBooks.question"),
      answer: t("about.faq.returnBooks.answer"),
    },
    {
      question: t("about.faq.lateReturns.question"),
      answer: t("about.faq.lateReturns.answer"),
    },
  ];

  return (
    <div style={{"marginLeft" : "-40px"}} className="container   mx-auto p-4 space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>{t("about.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-lg text-muted-foreground">
            {t("about.description")}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("about.goals.title")}</CardTitle>
        </CardHeader>
        <CardContent className="px-4 sm:px-8 md:px-12">
          <div className="relative">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {goals.map((goal, index) => (
                  <CarouselItem
                    key={index}
                    className="md:basis-1/2 lg:basis-1/3 pl-2 sm:pl-4"
                  >
                    <Card className="h-full">
                      <CardContent className="p-4 sm:p-6 text-center space-y-4 flex flex-col justify-between h-full">
                        <div>
                          <div className="flex justify-center mb-4">
                            {goal.icon}
                          </div>
                          <h3 className="font-semibold text-lg mb-2">
                            {goal.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {goal.description}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute -left-2 sm:-left-0 top-1/2 -translate-y-1/2">
                <CarouselPrevious className="bg-background border-primary" />
              </div>
              <div className="absolute -right-2 sm:-right-0 top-1/2 -translate-y-1/2">
                <CarouselNext className="bg-background border-primary" />
              </div>
            </Carousel>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("about.faq.title")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("about.contact.title")}</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <h3 className="font-semibold">
              {t("about.contact.address.title")}
            </h3>
            <p className="text-muted-foreground">
              {t("about.contact.address.value")}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">{t("about.contact.phone.title")}</h3>
            <p className="text-muted-foreground">
              {t("about.contact.phone.value")}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">{t("about.contact.email.title")}</h3>
            <p className="text-muted-foreground">
              {t("about.contact.email.value")}
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-semibold">
              {t("about.contact.workingHours.title")}
            </h3>
            <p className="text-muted-foreground">
              {t("about.contact.workingHours.value")}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AboutPage;
