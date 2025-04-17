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
import { useEffect } from "react";

const AboutPage = () => {
  const { t } = useTranslation();

  const goals = [
    {
      title: t("about.goals.accessibility.title"),
      description: t("about.goals.accessibility.description"),
      icon: "📚",
    },
    {
      title: t("about.goals.digitalization.title"),
      description: t("about.goals.digitalization.description"),
      icon: "💻",
    },
    {
      title: t("about.goals.community.title"),
      description: t("about.goals.community.description"),
      icon: "🤝",
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
    <div className="container mx-auto p-4 space-y-8">
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
        <CardContent>
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
                    className="md:basis-1/2 lg:basis-1/3 pl-4"
                  >
                    <div className="p-4 border rounded-lg h-full flex flex-col items-center text-center">
                      <div className="text-4xl mb-4">{goal.icon}</div>
                      <h3 className="text-xl font-semibold mb-2">
                        {goal.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {goal.description}
                      </p>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="absolute -left-12 top-1/2 -translate-y-1/2">
                <CarouselPrevious />
              </div>
              <div className="absolute -right-12 top-1/2 -translate-y-1/2">
                <CarouselNext />
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
