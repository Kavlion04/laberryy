
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const LoadingScreen = () => {
  const { t } = useTranslation();
  
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
      <p className="text-muted-foreground">{t('common.loading')}</p>
    </div>
  );
};

export default LoadingScreen;
