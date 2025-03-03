import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {Button} from "@/components/ui/button";

export function UploadButton() {
    return (
        <div className="grid w-full max-w-sm items-center gap-1.5">

            <Button variant="outline">
                <Input id="picture" type="file" />
            </Button>
        </div>
    )
}