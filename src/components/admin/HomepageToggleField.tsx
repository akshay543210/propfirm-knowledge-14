import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface HomepageToggleFieldProps {
  formData: {
    show_on_homepage: boolean;
  };
  setFormData: (data: any) => void;
  loading?: boolean;
}

const HomepageToggleField = ({ formData, setFormData, loading = false }: HomepageToggleFieldProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="show_on_homepage" className="text-white">
        Show on Homepage
      </Label>
      <div className="flex items-center space-x-2">
        <Switch
          id="show_on_homepage"
          checked={formData.show_on_homepage}
          onCheckedChange={(checked) => setFormData({ ...formData, show_on_homepage: checked })}
          disabled={loading}
        />
        <Label htmlFor="show_on_homepage" className="text-gray-300 text-sm">
          {formData.show_on_homepage ? 'Featured on homepage' : 'Not featured on homepage'}
        </Label>
      </div>
      <p className="text-gray-400 text-xs">
        Toggle this to control whether this firm appears on the homepage featured section.
      </p>
    </div>
  );
};

export default HomepageToggleField;