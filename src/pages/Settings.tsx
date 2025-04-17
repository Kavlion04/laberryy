
import { useTranslation } from 'react-i18next';
import { Settings, Moon, Sun, Globe } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTheme } from '@/context/ThemeContext';
import { Separator } from '@/components/ui/separator';
import i18n from '@/i18n';

const SettingsPage = () => {
  const { t } = useTranslation();
  const { theme, textColor, setTheme, setTextColor } = useTheme();
  
  const handleLanguageChange = (value: string) => {
    i18n.changeLanguage(value);
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('settings.subtitle')}
        </p>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.appearance')}</CardTitle>
            <CardDescription>
              {t('settings.theme')}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <Label>{t('settings.theme')}</Label>
              <RadioGroup 
                defaultValue={theme} 
                onValueChange={(value) => setTheme(value as 'light' | 'dark')}
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="theme-light" />
                  <Label htmlFor="theme-light" className="flex items-center">
                    <Sun className="w-4 h-4 mr-2" /> {t('settings.light')}
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="theme-dark" />
                  <Label htmlFor="theme-dark" className="flex items-center">
                    <Moon className="w-4 h-4 mr-2" /> {t('settings.dark')}
                  </Label>
                </div>
              </RadioGroup>
            </div>
            
            <Separator />
            
            <div className="space-y-4">
              <Label>{t('settings.textColor')}</Label>
              <RadioGroup 
                defaultValue={textColor} 
                onValueChange={(value) => setTextColor(value as any)}
                className="grid grid-cols-2 gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="default" id="color-default" />
                  <Label htmlFor="color-default">{t('settings.default')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="blue" id="color-blue" />
                  <Label htmlFor="color-blue" className="text-blue-500">{t('settings.blue')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="green" id="color-green" />
                  <Label htmlFor="color-green" className="text-green-500">{t('settings.green')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="purple" id="color-purple" />
                  <Label htmlFor="color-purple" className="text-purple-500">{t('settings.purple')}</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="red" id="color-red" />
                  <Label htmlFor="color-red" className="text-red-500">{t('settings.red')}</Label>
                </div>
              </RadioGroup>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.language')}</CardTitle>
            <CardDescription>
              <Globe className="w-4 h-4 inline mr-1" />
              {t('settings.language')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup 
              defaultValue={i18n.language} 
              onValueChange={handleLanguageChange}
              className="space-y-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="en" id="lang-en" />
                <Label htmlFor="lang-en">{t('settings.english')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="uz" id="lang-uz" />
                <Label htmlFor="lang-uz">{t('settings.uzbek')}</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="ru" id="lang-ru" />
                <Label htmlFor="lang-ru">{t('settings.russian')}</Label>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SettingsPage;
