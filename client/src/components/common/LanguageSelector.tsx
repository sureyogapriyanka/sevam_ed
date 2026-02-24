import { useLanguage } from "../../contexts/LanguageContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Languages } from "lucide-react";

export default function LanguageSelector() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="flex items-center space-x-3 w-full" data-testid="language-selector">
      <Languages className="h-5 w-5 text-muted-foreground" />
      <Select value={language} onValueChange={setLanguage}>
        <SelectTrigger className="w-full bg-transparent border-none h-auto p-0">
          <SelectValue placeholder={t("language")} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="te">తెలుగు</SelectItem>
          <SelectItem value="hi">हिंदी</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
