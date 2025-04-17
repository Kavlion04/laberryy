import { useTranslation } from "react-i18next";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Library, BookOpen, Users } from "lucide-react";

const HomePage = () => {
  const { t } = useTranslation();

  const stats = [
    {
      title: t("home.stats.libraries"),
      value: "50+",
      description: t("home.stats.librariesDesc"),
      icon: Library,
      color: "text-blue-500",
    },
    {
      title: t("home.stats.books"),
      value: "10,000+",
      description: t("home.stats.booksDesc"),
      icon: BookOpen,
      color: "text-green-500",
    },
    {
      title: t("home.stats.users"),
      value: "5,000+",
      description: t("home.stats.usersDesc"),
      icon: Users,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="container mx-auto p-4 space-y-8">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">{t("home.title")}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {t("home.description")}
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/libraries">{t("home.exploreLibraries")}</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link to="/about">{t("home.learnMore")}</Link>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">{stat.value}</div>
              <p className="text-muted-foreground">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("home.features.title")}</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((feature) => (
            <div key={feature} className="space-y-2">
              <h3 className="text-lg font-semibold">
                {t(`home.features.feature${feature}.title`)}
              </h3>
              <p className="text-muted-foreground">
                {t(`home.features.feature${feature}.description`)}
              </p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default HomePage;
