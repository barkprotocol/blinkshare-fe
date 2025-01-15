import { BlinkData } from "@/app/data/";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface FormProps {
  blinkData: BlinkData;
  onBlinkDataChange: (key: keyof BlinkData, value: string) => void;
}

export function Form({ blinkData, onBlinkDataChange }: FormProps) {
  return (
    <form className="space-y-4">
      <div>
        <Label htmlFor="icon">Icon URL</Label>
        <Input
          id="icon"
          type="url"
          value={blinkData.icon}
          onChange={(e) => onBlinkDataChange('icon', e.target.value)}
          placeholder="Enter icon URL"
        />
      </div>
      <div>
        <Label htmlFor="label">Label</Label>
        <Input
          id="label"
          type="text"
          value={blinkData.label}
          onChange={(e) => onBlinkDataChange('label', e.target.value)}
          placeholder="Enter label"
        />
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={blinkData.description}
          onChange={(e) => onBlinkDataChange('description', e.target.value)}
          placeholder="Enter description"
          rows={3}
        />
      </div>
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          type="text"
          value={blinkData.title}
          onChange={(e) => onBlinkDataChange('title', e.target.value)}
          placeholder="Enter title"
        />
      </div>
    </form>
  );
}

